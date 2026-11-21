"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function HasilPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      // Ambil data hasil dari firestore client-side (karena rules mengizinkan baca milik sendiri)
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc } = await import("firebase/firestore");
      
      const snap = await getDoc(doc(db, "attempts", attemptId as string));
      if (snap.exists()) {
        setResult(snap.data());
      }
    })();
  }, [attemptId]);

  if (!result) return <div className="min-h-screen flex items-center justify-center">Memuat hasil...</div>;

  const skor = result.result;
  // Passing grade contoh (bisa diubah dari settings nanti)
  const PG = { twk: 65, tiu: 80, tkp: 166 };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-brand-blue mb-2">Ujian Selesai!</h1>
          <p className="text-slate-500">Ini adalah hasil simulasi SKD Anda.</p>
        </div>

        {/* Kartu Skor Utama */}
        <div className="bg-gradient-milenial rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 opacity-20 text-9xl">🏆</div>
          <p className="text-lg font-medium opacity-90 mb-1">Total Skor Anda</p>
          <h2 className="text-6xl font-black mb-4">{skor.total}</h2>
          <div className="bg-white/20 rounded-xl p-3 inline-block backdrop-blur-sm">
            <span className="text-sm">Status: {skor.total >= (PG.twk + PG.tiu + PG.tkp) ? "Lolos Passing Grade (Simulasi)" : "Belum Lolos Passing Grade"}</span>
          </div>
        </div>

        {/* Rincian Subtes */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "TWK", val: skor.twk, pg: PG.twk },
            { label: "TIU", val: skor.tiu, pg: PG.tiu },
            { label: "TKP", val: skor.tkp, pg: PG.tkp },
          ].map(s => (
            <div key={s.label} className="bg-white p-4 rounded-2xl shadow-sm text-center">
              <p className="text-sm font-bold text-slate-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.val >= s.pg ? 'text-green-500' : 'text-red-500'}`}>{s.val}</p>
              <p className="text-xs text-slate-400 mt-1">PG: {s.pg}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Link href="/paket" className="flex-1 py-3 text-center rounded-xl bg-white border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition">
            Kembali
          </Link>
          <Link href={`/ranking/${result.packageId}`} className="flex-1 py-3 text-center rounded-xl btn-primary">
            Lihat Ranking
          </Link>
        </div>
      </div>
    </div>
  );
}