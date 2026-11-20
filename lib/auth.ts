import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "./firebaseAdmin";

export type AuthUser = { uid: string; email?: string; admin: boolean };

export async function requireUser(req: NextRequest): Promise<AuthUser | null> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.substring(7);
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      admin: decoded.admin === true,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest): Promise<AuthUser | null> {
  const user = await requireUser(req);
  if (!user?.admin) return null;
  return user;
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

// Sync user doc from token (dipanggil di session route)
export async function syncUserDoc(uid: string, email?: string) {
  const ref = adminDb.collection("users").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      nama: email?.split("@")[0] ?? "Peserta",
      email: email ?? "",
      foto: "",
      role: "user",
      purchasedPackages: [],
      streak: { current: 0, longest: 0, lastStudyDate: null },
      badges: [],
      createdAt: new Date(),
    });
  }
}