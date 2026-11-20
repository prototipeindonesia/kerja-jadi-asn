import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";
import { gdriveToImageUrl } from "@/lib/gdrive";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();

  try {
    const { packageId, questions } = await req.json();
    if (!packageId || !questions?.length) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    // Firestore batasnya 500 per batch, kita pakai 400 agar aman
    const chunkSize = 400;
    let berhasil = 0;

    for (let i = 0; i < questions.length; i += chunkSize) {
      const chunk = questions.slice(i, i + chunkSize);
      const batch = adminDb.batch();

      chunk.forEach((q: any) => {
        const ref = adminDb.collection("questions").doc();
        batch.set(ref, {
          packageId,
          subtest: q.subtest,
          topic: q.topik || "",
          text: q.pertanyaan,
          imageUrl: gdriveToImageUrl(q.gambar_url) || "",
          options: [q.opsi_a, q.opsi_b, q.opsi_c, q.opsi_d, q.opsi_e],
          scores: [
            Number(q.skor_a) || 0,
            Number(q.skor_b) || 0,
            Number(q.skor_c) || 0,
            Number(q.skor_d) || 0,
            Number(q.skor_e) || 0,
          ],
          explanation: q.pembahasan || "",
          explanationImageUrl: gdriveToImageUrl(q.gambar_pembahasan_url) || "",
          explanationVideoUrl: q.video_pembahasan_url || "",
          order: i + chunk.indexOf(q),
          createdAt: new Date(),
        });
      });

      await batch.commit();
      berhasil += chunk.length;
    }

    return NextResponse.json({ success: true, count: berhasil });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}