"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function UjianPage() {
  const router = useRouter();
  const { attemptId } = useParams();
  const searchParams = useSearchParams();
  const durasiMenit = Number(searchParams.get("durasi") || 10);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(durasiMenit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ambil soal dari sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`exam_${attemptId}`);
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      alert("Sesi ujian tidak ditemukan. Silakan mulai ulang.");
      router.push("/paket");
    }
  }, [attemptId, router]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Auto submit jika waktu habis
      return;
    }
    timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (optIdx: number) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: optIdx });
  };

  const toggleFlag = () => {
    const qid = questions[currentIdx].id;
    setFlagged(prev => prev.includes(qid) ? prev.filter(id => id !== qid) : [...prev, qid]);
  };

  async function handleSubmit() {
    if (isSubmitting) return;
    if (timeLeft > 0 && !confirm("Yakin ingin menyelesaikan ujian? Jawaban tidak bisa diubah.")) return;
    
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/attempts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attemptId, answers }),
      });
      if (!res.ok) throw new Error("Gagal submit");
      
      sessionStorage.removeItem(`exam_${attemptId}`);
      router.push(`/hasil/${attemptId}`);
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan jawaban.");
      setIsSubmitting(false);
    }
  }

  if (questions.length === 0) return <div className="p-8 text-center">Memuat soal...</div>;

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header Timer */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="font-bold text-brand-blue">KerjaJadiASN</div>
        <div className={`font-mono text-xl font-bold px-4 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-brand-blue'}`}>
          {formatTime(timeLeft)}
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-orange-600">
          {isSubmitting ? "Menyimpan..." : "Selesai"}
        </button>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 pb-24">
        {/* Info Soal */}
        <div className="flex justify-between items-center mb-4">
          <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-bold">Soal {currentIdx + 1} / {questions.length}</span>
          <button onClick={toggleFlag} className={`text-sm px-3 py-1 rounded-full border ${flagged.includes(q.id) ? 'bg-orange-100 border-brand-orange text-brand-orange' : 'bg-white text-slate-500'}`}>
            {flagged.includes(q.id) ? "🚩 Ragu-ragu" : "Tandai Ragu-ragu"}
          </button>
        </div>

        {/* Card Soal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-lg text-slate-800 mb-6 whitespace-pre-wrap">{q.text}</p>
          
          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => (
              <button 
                key={i} 
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${answers[q.id] === i ? 'border-brand-blue bg-blue-50 ring-2 ring-brand-blue ring-opacity-20' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${answers[q.id] === i ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Navigasi Bawah */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t p-3 flex justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} 
          disabled={currentIdx === 0}
          className="px-6 py-2 rounded-lg bg-slate-100 font-bold text-slate-600 disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button 
          onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))} 
          disabled={currentIdx === questions.length - 1}
          className="px-6 py-2 rounded-lg bg-brand-blue text-white font-bold disabled:opacity-50 shadow-md"
        >
          Selanjutnya
        </button>
      </footer>
    </div>
  );
}