import { NextRequest, NextResponse } from "next/server";
import { requireUser, unauthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const { attemptId, questionId, answerIndex } = await req.json();
  const attemptRef = adminDb.collection("attempts").doc(attemptId);
  const snap = await attemptRef.get();

  if (!snap.exists || snap.data()?.uid !== user.uid) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  // Update jawaban spesifik di dalam map `answers`
  await attemptRef.update({
    [`answers.${questionId}`]: answerIndex
  });

  return NextResponse.json({ success: true });
}