import { NextRequest, NextResponse } from "next/server";
import { requireUser, unauthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const attemptSnap = await adminDb.collection("attempts").doc(params.id).get();
  if (!attemptSnap.exists || attemptSnap.data()?.uid !== user.uid) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const attempt = attemptSnap.data();
  if (attempt?.status !== "done") {
    return NextResponse.json({ error: "Ujian belum selesai" }, { status: 400 });
  }

  // Ambil soal asli (termasuk kunci jawaban & pembahasan)
  const qSnap = await adminDb.collection("questions").where("packageId", "==", attempt?.packageId).get();
  const questions: any[] = [];
  
  qSnap.forEach(doc => {
    const q = doc.data();
    // Cari index jawaban yang benar (skor tertinggi)
    const maxScore = Math.max(...q.scores);
    const correctIndex = q.scores.indexOf(maxScore);

    questions.push({
      id: doc.id,
      text: q.text,
      options: q.options,
      explanation: q.explanation,
      userAnswer: attempt?.answers?.[doc.id] ?? null, // Jawaban peserta
      correctAnswer: correctIndex, // Kunci jawaban
    });
  });

  return NextResponse.json({ 
    result: attempt?.result, 
    topicStats: attempt?.topicStats,
    questions 
  });
}