import { NextRequest, NextResponse } from "next/server";
import { requireUser, unauthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";
import { scoreAttempt, Q } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const { attemptId, answers } = await req.json();

  const attemptRef = adminDb.collection("attempts").doc(attemptId);
  const attemptSnap = await attemptRef.get();
  if (!attemptSnap.exists) return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
  
  const attempt = attemptSnap.data();
  if (attempt?.uid !== user.uid) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  if (attempt?.status === "done") return NextResponse.json({ error: "Ujian sudah selesai" }, { status: 400 });

  // Ambil soal asli untuk dinilai
  const qSnap = await adminDb.collection("questions").where("packageId", "==", attempt?.packageId).get();
  const questions: Q[] = [];
  qSnap.forEach(doc => {
    const d = doc.data();
    questions.push({ id: doc.id, subtest: d.subtest, topic: d.topic, scores: d.scores });
  });

  // Hitung skor di server
  const result = scoreAttempt(questions, answers);

  // Simpan hasil ujian
  await attemptRef.update({
    answers,
    finishedAt: new Date(),
    status: "done",
    result: {
      twk: result.sub.TWK,
      tiu: result.sub.TIU,
      tkp: result.sub.TKP,
      total: result.total,
    },
    topicStats: result.topic,
  });

  // Update Leaderboard (jika skor lebih tinggi dari sebelumnya)
  const lbRef = adminDb.collection("leaderboards").doc(attempt?.packageId).collection("entries").doc(user.uid);
  const lbSnap = await lbRef.get();
  const userSnap = await adminDb.collection("users").doc(user.uid).get();
  const nama = userSnap.data()?.nama || user.email;

  if (!lbSnap.exists || result.total > lbSnap.data()?.bestScore) {
    await lbRef.set({
      nama,
      bestScore: result.total,
      bestAttemptId: attemptId,
      updatedAt: new Date()
    });
  }

  return NextResponse.json({ success: true, attemptId });
}