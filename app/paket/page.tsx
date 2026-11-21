"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

export default function PaketPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [paket, setPaket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch paket dari API admin (atau buat API publik khusus paket published)
    (async () => {
      const token = await auth.currentUser?.getIdToken();
      // Kita pakai API admin yang sudah ada untuk sementara
      const res = await fetch("/api/admin/paket", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Hanya tampilkan yang published
        setPaket(data.packages.filter((p: any) => p.status === "published"));
      }
      setLoading(false);
    })();
  }, []);

  async function mulaiUjian(packageId: string) {
    if (!user) return router.push("/login");
    
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/attempts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      // Simpan soal di sessionStorage agar tidak hilang saat refresh
      sessionStorage.setItem(`exam_${data.attemptId}`, JSON.stringify(data.questions));
      
      // Pindah ke halaman ujian
      router.push(`/ujian/${data.attemptId}?durasi=${data.durasiMenit}`);
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-800">Pilih Paket Try Out</h1>
        
        {loading ? <p>Memuat paket...</p> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paket.map((p) => (
              <div key={p.id} className="card-glass p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">{p.jenis}</span>
                  <h2 className="text-xl font-bold text-brand-blue mt-2 mb-2">{p.nama}</h2>
                  <p className="text-slate-500 text-sm mb-4">{p.deskripsi || "Tingkatkan peluang lolos Anda."}</p>
                  
                  <div className="flex gap-4 text-sm mb-6">
                    <span className="bg-blue-50 px-3 py-1 rounded-full text-brand-blue">⏱ {p.durasiMenit} Menit</span>
                    <span className="bg-orange-50 px-3 py-1 rounded-full text-brand-orange">📝 {p.jumlahSoal} Soal</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => mulaiUjian(p.id)}
                  className="w-full btn-primary py-3 text-center"
                >
                  Mulai Ujian
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}