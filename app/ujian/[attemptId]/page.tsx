"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuestions, calcDuration, type Question } from "@/lib/questions";
import { scoreAttempt } from "@/lib/scoring";

export default function ExamPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [ready, setReady] = useState(false);

  const duration = useMemo(() => (questions.length ? calcDuration(questions.length) * 60 : 0), [questions]);

  // Load soal + state attempt
  useEffect(() => {
    const qs = getQuestions();
    setQuestions(qs);

    const saved = localStorage.getItem(`attempt:${params.attemptId}`);
    if (saved) {
      const d = JSON.parse(saved);
      setAnswers(d.answers || {});
      setFlagged(d.flagged || {});
      if (typeof d.secondsLeft === "number") {
        setSecondsLeft(d.secondsLeft);
      } else {
        setSecondsLeft(calcDuration(qs.length) * 60);
      }
    } else {
      setSecondsLeft(calcDuration(qs.length) * 60);
    }
    setReady(true);
  }, [params.attemptId]);

  // Persist (debounced 30s dari blueprint — di sini pakai effect setiap perubahan, masih lokal)
  useEffect(() => {
    if (!ready || questions.length === 0) return;
    localStorage.setItem(
      `attempt:${params.attemptId}`,
      JSON.stringify({ answers, flagged, secondsLeft })
    );
  }, [answers, flagged, secondsLeft, params.attemptId, ready, questions.length]);

  // Timer
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [ready]);

  // Auto-submit saat waktu habis
  useEffect(() => {
    if (ready && secondsLeft === 0 && questions.length > 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, ready, questions.length]);

  function handleSubmit() {
    if (questions.length === 0) return;
    const result = scoreAttempt(questions, answers);
    localStorage.setItem(
      `result:${params.attemptId}`,
      JSON.stringify({
        answers,
        flagged,
        result,
        finishedAt: new Date().toISOString(),
        questions, // simpan snapshot soal agar halaman hasil bisa menampilkan pembahasan + gambar
      })
    );
    localStorage.removeItem(`attempt:${params.attemptId}`);
    router.push(`/hasil/${params.attemptId}`);
  }

  if (!ready || questions.length === 0) {
    return <div className="p-8 text-center text-dslate/60">Memuat soal...</div>;
  }

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-sky flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b border-dslate/10 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-xs text-dslate/60">Soal</div>
            <div className="font-bold text-navy">
              {current + 1} <span className="text-dslate/40">/ {questions.length}</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-mono font-bold ${secondsLeft < 60 ? "bg-orange text-white animate-pulse" : "bg-navy text-white"}`}>
            ⏱ {mm}:{ss}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto w-full px-4 py-6 flex-1">
        <div className="bg-white rounded-2xl p-5 border border-dslate/10 mb-4">
          <div className="flex gap-2 mb-3">
            <span className="bg-navy text-white text-xs px-2 py-1 rounded">{q.subtest}</span>
            <span className="bg-orange/10 text-orange text-xs px-2 py-1 rounded">{q.topic}</span>
          </div>
          <p className="text-dslate font-medium leading-relaxed whitespace-pre-line">{q.text}</p>

          {q.imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-dslate/10 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.imageUrl}
                alt="Ilustrasi soal"
                className="w-full max-h-96 object-contain"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [q.id]: i })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  selected
                    ? "border-orange bg-orange/5"
                    : "border-dslate/10 bg-white hover:border-navy/30"
                }`}
              >
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  selected ? "bg-orange text-white" : "bg-slate-100 text-dslate"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm">{opt || `(opsi ${String.fromCharCode(65 + i)} kosong)`}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setFlagged({ ...flagged, [q.id]: !flagged[q.id] })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              flagged[q.id] ? "bg-orange text-white" : "bg-white border border-dslate/20 text-dslate"
            }`}
          >
            {flagged[q.id] ? "✓ Ragu-ragu" : "Tandai Ragu"}
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dslate/10 px-4 py-3 z-20">
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="px-4 py-3 rounded-lg bg-slate-100 text-dslate font-semibold disabled:opacity-40"
          >
            ←
          </button>
          <button
            onClick={() => setShowNav(true)}
            className="flex-1 px-4 py-3 rounded-lg bg-navy text-white font-semibold text-sm"
          >
            Navigasi ({answered}/{questions.length})
          </button>
          {current === questions.length - 1 ? (
            <button
              onClick={() => confirm("Yakin submit? Jawaban tidak bisa diubah.") && handleSubmit()}
              className="px-4 py-3 rounded-lg bg-orange text-white font-semibold text-sm"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}
              className="px-4 py-3 rounded-lg bg-navy text-white font-semibold"
            >
              →
            </button>
          )}
        </div>
      </div>

      {/* Bottom Sheet Nav */}
      {showNav && (
        <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setShowNav(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[70vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-300 rounded mx-auto mb-4" />
            <h3 className="font-bold text-navy mb-4">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((qq, i) => {
                const isAnswered = answers[qq.id] !== undefined;
                const isFlag = flagged[qq.id];
                const isActive = i === current;
                return (
                  <button
                    key={qq.id}
                    onClick={() => { setCurrent(i); setShowNav(false); }}
                    className={`aspect-square rounded-lg font-bold text-sm ${
                      isActive ? "ring-2 ring-navy" : ""
                    } ${
                      isFlag ? "bg-orange text-white" :
                      isAnswered ? "bg-green-500 text-white" :
                      "bg-slate-200 text-dslate"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 text-xs mt-4 justify-center text-dslate/60">
              <span>🟩 Dijawab</span>
              <span>🟧 Ragu</span>
              <span>⬜ Kosong</span>
            </div>
            <button
              onClick={() => confirm("Yakin submit? Jawaban tidak bisa diubah.") && handleSubmit()}
              className="mt-4 w-full bg-orange text-white py-3 rounded-xl font-bold"
            >
              Submit Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}