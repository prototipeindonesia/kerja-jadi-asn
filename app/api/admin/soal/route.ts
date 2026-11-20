import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";
import { gdriveToImageUrl } from "@/lib/gdrive";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const snap = await adminDb
    .collection("questions")
    .orderBy("order")
    .limit(200)
    .get();
  const questions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ questions });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const b = await req.json();
  if (!b.packageId || !b.text || !b.options?.length) {
    return NextResponse.json({ error: "Data kurang lengkap" }, { status: 400 });
  }
  const ref = await adminDb.collection("questions").add({
    packageId: b.packageId,
    subtest: b.subtest ?? "TWK",
    topic: b.topic ?? "",
    text: b.text,
    imageUrl: gdriveToImageUrl(b.imageUrl) ?? "",
    options: b.options,
    scores: b.scores,
    explanation: b.explanation ?? "",
    explanationImageUrl: gdriveToImageUrl(b.explanationImageUrl) ?? "",
    explanationVideoUrl: b.explanationVideoUrl ?? "",
    order: Number(b.order ?? 0),
    createdAt: new Date(),
  });
  return NextResponse.json({ id: ref.id });
}