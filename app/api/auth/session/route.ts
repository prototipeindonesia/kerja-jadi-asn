import { NextRequest, NextResponse } from "next/server";
import { requireUser, syncUserDoc, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  await syncUserDoc(user.uid, user.email);
  return NextResponse.json({ ok: true });
}