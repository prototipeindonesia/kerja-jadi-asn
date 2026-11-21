"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function HasilPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "attempts", attemptId as string));
        if (snap.exists()) {
          setResult(snap.data());
        }
      } catch (err) {
        console.error("Gagal memuat hasil", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-brand-blue font-bold animate-pulse">Memuat hasil...</p>
      </div>
    );
  }

  // Jika data tidak ditemukan atau ujian belum selesai
  if (!result || !result.result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Hasil tidak ditemukan</h1>
        <p className="text-slate-500 mb-6 text-center">Pastikan Anda sudah menyelesaikan ujian.</p>
        <Link href="/paket" className="btn-primary">Kembali ke Paket</Link>
      </div>
    );
  }

  const skor = result.result;
  // Passing grade contoh (bisa diubah dari settings nanti)
  const PG = { twk: 65, tiu: 80, tkp: 166 };

  // Logika Kelulusan SKD: Harus lulus SEMUA subtes dan Total
  const isTWKPass = skor.twk >= PG.twk;
  const isTIUPass = skor.tiu >= PG.tiu;
  const isTKPPass = skor.tkp >= PG.tkp;
  const isTotalPass = skor.total >= (PG.twk + PG.tiu + PG.tkp);
  const isLulus = isTWKPass && isTIUPass && isTKPPass && isTotalPass;

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
          
          <div className={`rounded-xl p-3 inline-block backdrop-blur-sm ${isLulus ? 'bg-green-500/30 border border-green-300' : 'bg-red-500/30 border border-red-300'}`}>
            <span className="text-sm font-bold">
              Status: {isLulus ? "✅ LOLOS Passing Grade (Simulasi)" : "❌ BELUM LOLOS Passing Grade"}
            </span>
          </div>
        </div>

        {/* Rincian Subtes */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "TWK", val: skor.twk, pg: PG.twk, isPass: isTWKPass },
            { label: "TIU", val: skor.tiu, pg: PG.tiu, isPass: isTIUPass },
            { label: "TKP", val: skor.tkp, pg: PG.tkp, isPass: isTKPPass },
          ].map((s) => (
            <div key={s.label} className="bg-white p-4 rounded-2xl shadow-sm text-center border-b-4" style={{ borderBottomColor: s.isPass ? '#22c55e' : '#ef4444' }}>
              <p className="text-sm font-bold text-slate-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.isPass ? 'text-green-500' : 'text-red-500'}`}>
                {s.val}
              </p>
              <p className="text-xs text-slate-400 mt-1">PG: {s.pg}</p>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3 mt-4">
          <Link 
            href={`/pembahasan/${attemptId}`} 
            className="w-full py-4 text-center rounded-xl bg-gradient-milenial text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform"
          >
            📖 Lihat Pembahasan & Analisis
          </Link>
          
          <Link 
            href={`/ranking/${result.packageId}`} 
            className="w-full py-3 text-center rounded-xl bg-white border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            🏆 Lihat Ranking Nasional
          </Link>
          
          <Link 
            href="/paket" 
            className="w-full py-2 mt-2 text-center text-sm font-medium text-slate-400 hover:text-brand-blue transition"
          >
            Kembali ke Daftar Paket
          </Link>
        </div>
      </div>
    </div>
  );
}