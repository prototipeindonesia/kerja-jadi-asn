"use client";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, admin, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight">
          <span className="text-brand-blue">Kerja</span>
          <span className="text-brand-orange">JadiASN</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard" className="text-slate-600 hover:text-brand-blue transition">Dashboard</Link>
          {admin && (
            <Link href="/admin" className="text-brand-orange hover:text-orange-600 transition font-bold">
              Admin
            </Link>
          )}
          {!loading && !user && (
            <Link href="/login" className="btn-primary py-2 px-5 text-sm">Masuk</Link>
          )}
          {!loading && user && (
            <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-red-500 transition">
              Keluar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}