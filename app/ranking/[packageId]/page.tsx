"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function RankingPage() {
  const { packageId } = useParams();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "leaderboards", packageId as string, "entries"),
        orderBy("bestScore", "desc"),
        limit(50)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((doc, idx) => ({ id: doc.id, rank: idx + 1, ...doc.data() }));
      setList(data);
      setLoading(false);
    })();
  }, [packageId]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-brand-blue mb-2">🏆 Ranking Nasional</h1>
          <p className="text-slate-500">Top 50 peserta dengan skor tertinggi di paket ini.</p>
        </div>

        {loading ? <p className="text-center">Memuat ranking...</p> : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {list.map((u) => (
              <div key={u.id} className="flex items-center p-4 border-b last:border-0 hover:bg-slate-50 transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 
                  ${u.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                    u.rank === 2 ? 'bg-slate-200 text-slate-600' : 
                    u.rank === 3 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                  {u.rank}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{u.nama}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-brand-orange">{u.bestScore}</p>
                  <p className="text-xs text-slate-400">Skor</p>
                </div>
              </div>
            ))}
            {list.length === 0 && <p className="p-8 text-center text-slate-500">Belum ada peserta di ranking ini.</p>}
          </div>
        )}
      </main>
    </div>
  );
}