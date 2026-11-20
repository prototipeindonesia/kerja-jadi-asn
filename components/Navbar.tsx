"use client";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, admin, loading } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-brand-700">
          Kerja Jadi ASN
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          {admin && <Link href="/admin">Admin</Link>}
          {!loading && !user && <Link href="/login">Login</Link>}
          {!loading && user && (
            <button
              onClick={() => signOut(auth)}
              className="text-red-600 hover:underline"
            >
              Keluar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}