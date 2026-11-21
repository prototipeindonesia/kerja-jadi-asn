"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/questions";

export default function ResultPage({ params }: { params: { attemptId: string } }) {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(`result:${params.attemptId}`);
    if (raw) setData(JSON.parse(raw));
  }, [params.attemptId]);

  if (!data) return <div className="p-8 text-center">Memuat hasil...</div>;

  const { result, answers, questions = [] } = data;
  const totalSoal = Object.keys(answers).length;

  const ogUrl = `/api/og/skor?nama=Pejuang+ASN&total=${result.total}&twk=${result.sub.TWK}&tiu=${result.sub.TIU}&tkp=${result.sub.TKP}`;

  function copyShare() {
    const url = window.location.origin + ogUrl;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const weakTopics = Object.entries(result.topic)
    .filter(([_, v]: any) => v.akurasi < 60)
    .sort((a: any, b: any) => a[1].akurasi - b[1].akurasi);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <Link href="/dashboard" className="text-sm text-navy mb-4 inline-block">← Dashboard</Link>

      <div className="bg-gradient-to-br from-navy to-navy/80 rounded-2xl p-6 text-white text-center mb-6">
        <div className="text-sm opacity-80 mb-2">Skor Total</div>
        <div className="text-6xl font-bold mb-2">{result.total}</div>
        <div className="text-sm opacity-80 mb-4">dari {totalSoal} soal terjawab</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["TWK", "TIU", "TKP"] as const).map((s) => (
          <div key={s} className="bg-white rounded-xl p-4 border border-dslate/10 text-center">
            <div className="text-xs text-dslate/60">{s}</div>
            <div className="text-2xl font-bold text-orange">{result.sub[s]}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-dslate/10 mb-6">
        <h3 className="font-bold text-navy mb-4">📊 Analisis Topik</h3>
        <div className="space-y-3">
          {Object.entries(result.topic).map(([topic, v]: any) => (
            <div key={topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{topic}</span>
                <span className={v.akurasi < 60 ? "text-orange font-bold" : "text-green-600 font-bold"}>
                  {v.akurasi}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${v.akurasi < 60 ? "bg-orange" : "bg-green-500"}`}
                  style={{ width: `${v.akurasi}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {weakTopics.length > 0 && (
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-5 mb-6">
          <div className="font-bold text-orange mb-2">⚠️ Kelemahan Kritis Terdeteksi</div>
          <p className="text-sm text-dslate/70 mb-3">
            Topik berikut akurasinya &lt;60%. Fokus latihan di sini.
          </p>
          <ul className="text-sm space-y-1">
            {weakTopics.map(([topic, v]: any) => (
              <li key={topic} className="flex justify-between">
                <span>{topic}</span>
                <span className="font-bold text-orange">{v.akurasi}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-dslate/10 mb-6">
        <h3 className="font-bold text-navy mb-3">🏆 Bagikan Kartu Skor</h3>
        <p className="text-sm text-dslate/60 mb-4">
          Bagikan ke IG Story / TikTok / WhatsApp.
        </p>
        <div className="rounded-lg overflow-hidden border border-dslate/10 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ogUrl} alt="Score Card" className="w-full" />
        </div>
        <button
          onClick={copyShare}
          className="w-full bg-orange text-white py-3 rounded-xl font-bold"
        >
          {copied ? "✓ Link Tersalin!" : "Salin Link Kartu Skor"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-dslate/10 mb-6 overflow-hidden">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full p-6 text-left flex justify-between items-center"
          >
            <h3 className="font-bold text-navy">📖 Lihat Pembahasan ({questions.length} soal)</h3>
            <span className="text-2xl text-dslate/40">{showReview ? "−" : "+"}</span>
          </button>

          {showReview && (
            <div className="border-t border-dslate/10 divide-y divide-dslate/10">
              {questions.map((q: Question, i: number) => {
                const userAns = answers[q.id];
                const maxScore = Math.max(...q.scores);
                const givenScore = userAns === undefined ? 0 : q.scores[userAns] ?? 0;
                const correct = givenScore === maxScore && maxScore > 0;
                return (
                  <div key={q.id} className="p-5 text-sm">
                    <div className="flex gap-2 items-center mb-2 flex-wrap">
                      <span className="bg-navy text-white text-xs px-2 py-0.5 rounded">#{i + 1}</span>
                      <span className="bg-slate-100 text-xs px-2 py-0.5 rounded">{q.subtest}</span>
                      <span className="bg-orange/10 text-orange text-xs px-2 py-0.5 rounded">{q.topic}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ml-auto ${
                        correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {correct ? "BENAR" : "SALAH"} ({givenScore} pt)
                      </span>
                    </div>
                    <p className="font-medium mb-2 whitespace-pre-line">{q.text}</p>
                    {q.imageUrl && (
                      <img src={q.imageUrl} alt="" className="rounded border border-dslate/10 my-2 max-h-64 object-contain" />
                    )}
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, oi) => {
                        const isUser = userAns === oi;
                        const isKey = q.scores[oi] === maxScore && maxScore > 0;
                        return (
                          <div
                            key={oi}
                            className={`px-3 py-1.5 rounded text-xs ${
                              isKey ? "bg-green-50 text-green-800 font-semibold" :
                              isUser ? "bg-red-50 text-red-800" :
                              "text-dslate/70"
                            }`}
                          >
                            <span className="font-bold mr-1">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                            {isKey && <span className="ml-2">✓ kunci</span>}
                            {isUser && !isKey && <span className="ml-2">✗ pilihanmu</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-3 bg-slate-50 rounded p-3 text-xs text-dslate/80">
                        <b>Pembahasan:</b> {q.explanation}
                      </div>
                    )}
                    {q.explanationImageUrl && (
                      <img src={q.explanationImageUrl} alt="pembahasan" className="mt-2 rounded border border-dslate/10 max-h-64 object-contain" />
                    )}
                    {q.explanationVideoUrl && (
                      <a
                        href={q.explanationVideoUrl}
                        target="_blank"
                        rel="noopener"
                        className="mt-2 inline-block text-xs text-navy underline"
                      >
                        ▶ Tonton video pembahasan
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Link href="/dashboard" className="block text-center bg-navy text-white py-3 rounded-xl font-bold">
        Coba Lagi
      </Link>
    </main>
  );
}