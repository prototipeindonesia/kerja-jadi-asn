"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QUESTIONS, getQuestions } from "@/lib/questions";

export default function Dashboard() {
  const [total, setTotal] = useState(QUESTIONS.length);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    const qs = getQuestions();
    setTotal(qs.length);
    setIsCustom(qs.length !== QUESTIONS.length || localStorage.getItem("kjb:questions") !== null);
  }, []);

  function startExam() {
    const id = "demo-" + Date.now();
    localStorage.removeItem(`attempt:${id}`);
    window.location.href = `/ujian/${id}`;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-navy mb-4 inline-block">← Kembali</Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Dashboard</h1>
          <p className="text-sm text-dslate/60">Halo Pejuang ASN 👋</p>
        </div>
        <Link
          href="/admin"
          className="bg-dslate text-white text-xs px-3 py-2 rounded-lg font-semibold"
        >
          ⚙️ Admin
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-dslate/10 text-center">
          <div className="text-2xl font-bold text-orange">0</div>
          <div className="text-xs text-dslate/60 mt-1">Streak</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-dslate/10 text-center">
          <div className="text-2xl font-bold text-orange">0</div>
          <div className="text-xs text-dslate/60 mt-1">Try Out</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-dslate/10 text-center">
          <div className="text-2xl font-bold text-orange">{total}</div>
          <div className="text-xs text-dslate/60 mt-1">Bank Soal</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-navy to-navy/90 rounded-2xl p-6 text-white mb-6">
        <div className="text-sm opacity-80 mb-1">
          {isCustom ? "Soal Import Excel" : "Try Out Demo"}
        </div>
        <h2 className="text-xl font-bold mb-2">Simulasi SKD — {total} Soal</h2>
        <p className="text-sm opacity-80 mb-4">
          TWK, TIU, TKP. Timer otomatis sesuai jumlah soal. Kerjakan seperti ujian asli.
        </p>
        <button
          onClick={startExam}
          className="bg-orange text-white px-6 py-3 rounded-xl font-semibold w-full"
        >
          Mulai Ujian Sekarang →
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-dslate/10">
        <h3 className="font-bold text-navy mb-3">🎯 Analisis Kelemahan</h3>
        <p className="text-sm text-dslate/60">
          Selesaikan minimal 1 try out untuk melihat analisis kelemahan per topik.
        </p>
      </div>
    </main>
  );
}