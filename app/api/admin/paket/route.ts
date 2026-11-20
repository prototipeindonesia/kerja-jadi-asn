import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized, forbidden } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const snap = await adminDb.collection("packages").orderBy("nama").get();
  const packages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ packages });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return forbidden();
  const body = await req.json();
  if (!body.nama) {
    return NextResponse.json({ error: "Nama wajib" }, { status: 400 });
  }
  const ref = await adminDb.collection("packages").add({
    nama: body.nama,
    deskripsi: body.deskripsi ?? "",
    tier: body.tier ?? "free",
    price: body.tier === "free" ? 0 : Number(body.price ?? 0),
    status: body.status ?? "draft",
    jumlahSoal: Number(body.jumlahSoal ?? 0),
    durasiMenit: Number(body.durasiMenit ?? 100),
    jenis: body.jenis ?? "full",
    createdAt: new Date(),
  });
  return NextResponse.json({ id: ref.id });
}