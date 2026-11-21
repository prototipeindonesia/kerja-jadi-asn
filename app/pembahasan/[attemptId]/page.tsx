"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function PembahasanPage() {
  const { attemptId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/attempts/${attemptId}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setData(await res.json());
    })();
  }, [attemptId]);

  if (!data) return <div className="p-8 text-center">Memuat pembahasan...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-brand-blue mb-6">Pembahasan & Analisis</h1>

        {/* Analisis Topik */}
        <div className="card-glass p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">Analisis Kelemahan Topik</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.topicStats || {}).map(([topik, stat]: any) => {
              const persen = Math.round((stat.benar / stat.total) * 100);
              return (
                <div key={topik} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-700 truncate">{topik}</p>
                  <p className={`text-2xl font-black ${persen >= 60 ? 'text-green-500' : 'text-red-500'}`}>{persen}%</p>
                  <p className="text-xs text-slate-400">{stat.benar} benar dari {stat.total} soal</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daftar Soal */}
        <h2 className="font-bold text-xl mb-4">Rincian Jawaban</h2>
        <div className="space-y-6">
          {data.questions.map((q: any, i: number) => {
            const isBenar = q.userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-brand-blue">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-slate-400">Soal {i + 1}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isBenar ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isBenar ? "BENAR" : "SALAH"}
                  </span>
                </div>
                <p className="text-slate-800 mb-4 whitespace-pre-wrap">{q.text}</p>

                <div className="space-y-2 mb-4">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isKunci = optIdx === q.correctAnswer;
                    const isPilihanUser = optIdx === q.userAnswer;
                    let bgClass = "bg-slate-50 border-slate-100";
                    if (isKunci) bgClass = "bg-green-50 border-green-500 text-green-800 font-medium";
                    else if (isPilihanUser) bgClass = "bg-red-50 border-red-500 text-red-800";

                    return (
                      <div key={optIdx} className={`p-3 rounded-lg border ${bgClass}`}>
                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                        {isKunci && <span className="ml-2 text-xs font-bold text-green-600">(Kunci)</span>}
                        {isPilihanUser && !isKunci && <span className="ml-2 text-xs font-bold text-red-600">(Pilihan Anda)</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-brand-blue mb-1">Pembahasan:</p>
                  <p className="text-sm text-slate-600">{q.explanation || "Belum ada pembahasan untuk soal ini."}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => router.push("/paket")} className="mt-8 w-full btn-primary py-3">
          Kembali ke Daftar Paket
        </button>
      </div>
    </div>
  );
}