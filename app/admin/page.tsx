"use client";
import { useState } from "react";
import Link from "next/link";
import type { Question, Subtest } from "@/lib/questions";
import { convertGDriveUrl } from "@/lib/gdrive";

type ParsedRow = Question & { _rowNum: number };

function pick(row: Record<string, any>, ...keys: string[]): any {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== "") return row[k];
  }
  return undefined;
}

export default function AdminPage() {
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setErrors([]);
    setSaved(false);
    setParsed([]);

    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });

      const errs: string[] = [];
      const out: ParsedRow[] = [];

      rows.forEach((r, i) => {
        const rowNum = i + 2; // header di baris 1
        const subtest = String(pick(r, "subtes", "subtest", "sub_tes") || "").toUpperCase().trim();
        const text = String(pick(r, "pertanyaan", "soal", "question", "text") || "").trim();
        const topic = String(pick(r, "topik", "topic") || "Umum").trim();

        if (!text) {
          errs.push(`Baris ${rowNum}: "pertanyaan" kosong, dilewati.`);
          return;
        }
        if (!["TWK", "TIU", "TKP"].includes(subtest)) {
          errs.push(`Baris ${rowNum}: subtes "${subtest}" tidak valid (harus TWK/TIU/TKP), dilewati.`);
          return;
        }

        const options = ["opsi_a", "opsi_b", "opsi_c", "opsi_d", "opsi_e"].map((k) =>
          String(pick(r, k, k.replace("opsi_", "")) || "").trim()
        );
        if (options.filter(Boolean).length < 2) {
          errs.push(`Baris ${rowNum}: minimal 2 opsi jawaban wajib diisi, dilewati.`);
          return;
        }

        const scores = ["skor_a", "skor_b", "skor_c", "skor_d", "skor_e"].map((k) => {
          const v = pick(r, k, k.replace("skor_", "score_"));
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        });

        const rawImg = pick(r, "gambar_url", "gambar", "image_url");
        const rawExpImg = pick(r, "gambar_pembahasan_url", "gambar_pembahasan", "explanation_image_url");
        const rawVideo = pick(r, "video_pembahasan_url", "video_pembahasan", "explanation_video_url");

        out.push({
          _rowNum: rowNum,
          id: `imp_${Date.now()}_${i}`,
          subtest: subtest as Subtest,
          topic,
          text,
          imageUrl: rawImg ? convertGDriveUrl(String(rawImg)) : undefined,
          options,
          scores,
          explanation: String(pick(r, "pembahasan", "explanation") || "").trim(),
          explanationImageUrl: rawExpImg ? convertGDriveUrl(String(rawExpImg)) : undefined,
          explanationVideoUrl: rawVideo ? String(rawVideo) : undefined,
        });
      });

      setParsed(out);
      setErrors(errs);
    } catch (err: any) {
      setErrors([`Gagal membaca file: ${err?.message || err}`]);
    } finally {
      setLoading(false);
    }
  }

  function save() {
    const clean = parsed.map(({ _rowNum, ...q }) => q);
    localStorage.setItem("kjb:questions", JSON.stringify(clean));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function reset() {
    if (!confirm("Hapus semua soal hasil import? Akan kembali ke 10 soal demo.")) return;
    localStorage.removeItem("kjb:questions");
    setParsed([]);
    setErrors([]);
    alert("Soal import dihapus. Demo default aktif.");
  }

  async function downloadTemplate() {
    const XLSX = await import("xlsx");
    const rows = [
      {
        subtes: "TWK", topik: "Pancasila",
        pertanyaan: "Contoh soal TWK tanpa gambar...",
        gambar_url: "",
        opsi_a: "Jawaban A", opsi_b: "Jawaban B", opsi_c: "Jawaban C", opsi_d: "Jawaban D", opsi_e: "Jawaban E",
        skor_a: 5, skor_b: 0, skor_c: 0, skor_d: 0, skor_e: 0,
        pembahasan: "Penjelasan mengapa A benar.",
        gambar_pembahasan_url: "",
        video_pembahasan_url: "",
      },
      {
        subtes: "TIU", topik: "Silogisme",
        pertanyaan: "Contoh soal TIU dengan gambar (isi gambar_url dengan link GDrive)...",
        gambar_url: "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz01234/view?usp=sharing",
        opsi_a: "Jawaban A", opsi_b: "Jawaban B", opsi_c: "Jawaban C", opsi_d: "Jawaban D", opsi_e: "Jawaban E",
        skor_a: 0, skor_b: 5, skor_c: 0, skor_d: 0, skor_e: 0,
        pembahasan: "Penjelasan mengapa B benar.",
        gambar_pembahasan_url: "",
        video_pembahasan_url: "",
      },
      {
        subtes: "TKP", topik: "Pelayanan Publik",
        pertanyaan: "Contoh soal TKP dengan skor bertingkat...",
        gambar_url: "",
        opsi_a: "Sangat tidak sesuai", opsi_b: "Kurang sesuai", opsi_c: "Cukup sesuai", opsi_d: "Sesuai", opsi_e: "Sangat sesuai",
        skor_a: 1, skor_b: 2, skor_c: 3, skor_d: 4, skor_e: 5,
        pembahasan: "TKP menggunakan skor bertingkat 1–5.",
        gambar_pembahasan_url: "",
        video_pembahasan_url: "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Soal");
    XLSX.writeFile(wb, "template-soal-kjb.xlsx");
  }

  const bySub = parsed.reduce<Record<string, number>>((a, q) => {
    a[q.subtest] = (a[q.subtest] || 0) + 1;
    return a;
  }, {});

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-sm text-navy mb-4 inline-block">← Dashboard</Link>

      <h1 className="text-2xl font-bold text-navy mb-1">Admin — Import Soal</h1>
      <p className="text-sm text-dslate/60 mb-6">
        Upload file Excel (.xlsx). Soal gambar otomatis dikonversi dari link Google Drive.
      </p>

      <div className="bg-white rounded-2xl p-6 border border-dslate/10 mb-6">
        <h2 className="font-bold text-navy mb-3">1. Download Template</h2>
        <button
          onClick={downloadTemplate}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          ⬇️ Download Template Excel
        </button>
        <p className="text-xs text-dslate/60 mt-3 leading-relaxed">
          Kolom: <code className="bg-slate-100 px-1 rounded">subtes, topik, pertanyaan, gambar_url,
          opsi_a–opsi_e, skor_a–skor_e, pembahasan, gambar_pembahasan_url, video_pembahasan_url</code>.
          Subtes harus <b>TWK / TIU / TKP</b>.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-dslate/10 mb-6">
        <h2 className="font-bold text-navy mb-3">2. Upload Excel</h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="block w-full text-sm text-dslate file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange file:text-white file:font-semibold"
        />
        {loading && <p className="text-sm text-dslate/60 mt-3">Membaca file...</p>}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-red-700 mb-2">⚠️ {errors.length} masalah ditemukan</h3>
          <ul className="text-xs text-red-700 space-y-1 max-h-40 overflow-auto">
            {errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        </div>
      )}

      {parsed.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-dslate/10 mb-6">
          <h2 className="font-bold text-navy mb-2">3. Preview ({parsed.length} soal valid)</h2>
          <div className="flex gap-2 mb-4 text-xs">
            {(["TWK", "TIU", "TKP"] as Subtest[]).map((s) => (
              <span key={s} className="bg-navy text-white px-3 py-1 rounded-full">
                {s}: {bySub[s] || 0}
              </span>
            ))}
          </div>

          <div className="space-y-3 max-h-96 overflow-auto">
            {parsed.slice(0, 20).map((q) => (
              <div key={q.id} className="border border-dslate/10 rounded-lg p-3 text-sm">
                <div className="flex gap-2 mb-1 text-xs">
                  <span className="bg-navy text-white px-2 py-0.5 rounded">{q.subtest}</span>
                  <span className="bg-orange/10 text-orange px-2 py-0.5 rounded">{q.topic}</span>
                  <span className="text-dslate/40">baris {q._rowNum}</span>
                </div>
                <p className="font-medium mb-2">{q.text}</p>
                {q.imageUrl && (
                  <img
                    src={q.imageUrl}
                    alt="gambar soal"
                    className="max-h-32 rounded border border-dslate/10 mb-2"
                  />
                )}
              </div>
            ))}
            {parsed.length > 20 && (
              <p className="text-xs text-dslate/50 text-center">
                +{parsed.length - 20} soal lainnya tidak ditampilkan
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={save}
              className="flex-1 bg-orange text-white py-3 rounded-xl font-bold"
            >
              {saved ? "✓ Tersimpan!" : "💾 Simpan & Pakai untuk Ujian"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-dslate/10">
        <h2 className="font-bold text-navy mb-2">Reset</h2>
        <p className="text-xs text-dslate/60 mb-3">
          Hapus soal import & kembali ke 10 soal demo default.
        </p>
        <button
          onClick={reset}
          className="border border-red-400 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          🗑 Hapus Soal Import
        </button>
      </div>
    </main>
  );
}