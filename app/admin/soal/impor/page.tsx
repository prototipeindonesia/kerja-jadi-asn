"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { auth } from "@/lib/firebase";

export default function ImportSoalPage() {
  const router = useRouter();
  const [paket, setPaket] = useState<any[]>([]);
  const [packageId, setPackageId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    (async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/paket", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPaket(data.packages ?? []);
    })();
  }, []);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !packageId) return alert("Pilih paket dan file Excel!");
    
    setLoading(true);
    setPesan("");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/import-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId, questions: jsonData }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setPesan(`✅ Berhasil! ${result.count} soal telah diimpor.`);
      setFile(null);
    } catch (err: any) {
      setPesan(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Impor Soal Excel</h1>
      <p className="text-slate-500 mb-8">Unggah file .xlsx sesuai format template.</p>

      <form onSubmit={handleImport} className="card-glass p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Paket Tujuan</label>
          <select
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue outline-none"
            required
          >
            <option value="">— Pilih Paket —</option>
            {paket.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Upload File Excel (.xlsx)</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"
            required
          />
        </div>

        {pesan && (
          <div className={`p-4 rounded-xl text-sm font-medium ${pesan.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {pesan}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Mulai Impor Soal"}
        </button>
      </form>

      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-brand-blue mb-2">Format Kolom Excel yang Diperlukan:</h3>
        <p className="text-sm text-slate-600 mb-2">Pastikan baris pertama Excel Anda berisi nama kolom berikut:</p>
        <code className="text-xs bg-white p-3 block rounded-lg overflow-x-auto text-slate-800">
          subtes | topik | pertanyaan | gambar_url | opsi_a | opsi_b | opsi_c | opsi_d | opsi_e | skor_a | skor_b | skor_c | skor_d | skor_e | pembahasan | gambar_pembahasan_url | video_pembahasan_url
        </code>
      </div>
    </div>
  );
}