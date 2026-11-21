import { NextRequest, NextResponse } from "next/server";
import { requireUser, unauthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const { packageId } = await req.json();

  // 1. Ambil data paket
  const pkgSnap = await adminDb.collection("packages").doc(packageId).get();
  if (!pkgSnap.exists) return NextResponse.json({ error: "Paket tidak ada" }, { status: 404 });
  const pkg = pkgSnap.data();

  // 2. Cek akses (Sementara kita buat gratis dulu untuk testing)
  // if (pkg?.tier === "paid") {
  //   const userSnap = await adminDb.collection("users").doc(user.uid).get();
  //   const purchased = userSnap.data()?.purchasedPackages || [];
  //   if (!purchased.includes(packageId)) return NextResponse.json({ error: "Anda belum membeli paket ini" }, { status: 403 });
  // }

  // 3. Buat attempt baru
  const attemptRef = adminDb.collection("attempts").doc();
  await attemptRef.set({
    uid: user.uid,
    packageId,
    startedAt: new Date(),
    status: "ongoing",
    answers: {},
    flagged: [],
  });

  // 4. Ambil soal & hapus kunci jawaban/skor/pembahasan
  const qSnap = await adminDb.collection("questions").where("packageId", "==", packageId).get();
  let questions: any[] = [];
  qSnap.forEach(doc => {
    const q = doc.data();
    questions.push({
      id: doc.id,
      text: q.text,
      imageUrl: q.imageUrl,
      options: q.options,
      subtest: q.subtest,
      // scores, explanation, topic DISEMBUNYIKAN!
    });
  });

  // Acak urutan soal agar tidak bisa ditebak (opsional)
  questions = questions.sort(() => Math.random() - 0.5);

  return NextResponse.json({ 
    attemptId: attemptRef.id, 
    questions,
    durasiMenit: pkg?.durasiMenit || 10
  });
}