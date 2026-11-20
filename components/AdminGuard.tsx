"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !admin)) router.push("/login");
  }, [user, admin, loading, router]);

  if (loading) return <div className="p-8">Memuat...</div>;
  if (!admin) return <div className="p-8">Akses ditolak.</div>;
  return <>{children}</>;
}