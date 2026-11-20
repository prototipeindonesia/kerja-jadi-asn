"use client";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-slate-600">
            Selamat datang, <b>{user?.email ?? "Peserta"}</b>.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Belum ada progres. Mulai try out dari menu paket.
          </p>
        </div>
      </main>
    </>
  );
}