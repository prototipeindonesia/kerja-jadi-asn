import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";
import { gdriveToImageUrl } from "@/lib/gdrive";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const snap = await adminDb.collection("questions").doc(params.id).get();
  if (!snap.exists)
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ question: { id: snap.id, ...snap.data() } });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const b = await req.json();
  await adminDb
    .collection("questions")
    .doc(params.id)
    .update({
      subtest: b.subtest,
      topic: b.topic,
      text: b.text,
      imageUrl: gdriveToImageUrl(b.imageUrl) ?? "",
      options: b.options,
      scores: b.scores,
      explanation: b.explanation,
      order: Number(b.order ?? 0),
      updatedAt: new Date(),
    });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  await adminDb.collection("questions").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}