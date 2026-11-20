"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type Pkg = { id: string; nama: string; tier: string };

export default function NewSoalPage() {
  const router = useRouter();
  const [paket, setPaket] = useState<Pkg[]>([]);
  const [form, setForm] = useState({
    packageId: "",
    subtest: "TWK",
    topic: "",
    text: "",
    imageUrl: "",
    options: ["", "", "", "", ""],
    scores: [5, 0, 0, 0, 0],
    explanation: "",
    explanationImageUrl: "",
    explanationVideoUrl: "",
    order: 0,
  });
  const [err, setErr] = useState("");

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch("/api/admin/soal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error);
    router.push("/admin/soal");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Soal Baru</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl">
        <label className="block">
          <span className="text-sm font-medium">Paket</span>
          <select
            value={form.packageId}
            onChange={(e) => setForm({ ...form, packageId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">— pilih —</option>
            {paket.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Subtes</span>
            <select
              value={form.subtest}
              onChange={(e) => setForm({ ...form, subtest: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="TWK">TWK</option>
              <option value="TIU">TIU</option>
              <option value="TKP">TKP</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Topik</span>
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="mis. Pancasila"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium">Pertanyaan</span>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">
            URL Gambar (opsional, Google Drive/Cloudinary)
          </span>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </label>

        <div>
          <p className="text-sm font-medium mb-2">Opsi & Skor</p>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <span className="w-6 text-sm font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <input
                value={form.options[i]}
                onChange={(e) => {
                  const opts = [...form.options];
                  opts[i] = e.target.value;
                  setForm({ ...form, options: opts });
                }}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
              />
              <input
                type="number"
                value={form.scores[i]}
                onChange={(e) => {
                  const sc = [...form.scores];
                  sc[i] = Number(e.target.value);
                  setForm({ ...form, scores: sc });
                }}
                className="w-20 px-3 py-2 border rounded-lg"
                min={0}
                max={5}
              />
            </div>
          ))}
        </div>

        <label className="block">
          <span className="text-sm font-medium">Pembahasan</span>
          <textarea
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </label>

        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full py-2 bg-brand-600 text-white rounded-lg">
          Simpan
        </button>
      </form>
    </div>
  );
}