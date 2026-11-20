import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const snap = await adminDb.collection("packages").doc(params.id).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ package: { id: snap.id, ...snap.data() } });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const body = await req.json();
  await adminDb
    .collection("packages")
    .doc(params.id)
    .update({
      nama: body.nama,
      deskripsi: body.deskripsi ?? "",
      tier: body.tier,
      price: body.tier === "free" ? 0 : Number(body.price ?? 0),
      status: body.status,
      jumlahSoal: Number(body.jumlahSoal ?? 0),
      durasiMenit: Number(body.durasiMenit ?? 100),
      jenis: body.jenis,
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
  await adminDb.collection("packages").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}