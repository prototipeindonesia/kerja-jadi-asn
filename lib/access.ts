import { adminDb } from "./firebaseAdmin";

export type Pkg = {
  id: string;
  tier: "free" | "paid";
  status: "draft" | "published";
};

export async function canAccess(uid: string, pkg: Pkg): Promise<boolean> {
  if (pkg.tier === "free") return true;
  const userSnap = await adminDb.collection("users").doc(uid).get();
  const data = userSnap.data();
  return data?.purchasedPackages?.includes(pkg.id) ?? false;
}