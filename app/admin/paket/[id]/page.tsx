"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function EditPaketPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [form, setForm] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/paket/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.error);
      setForm(data.package);
    })();
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`/api/admin/paket/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error);
    router.push("/admin/paket");
  }

  if (!form) return <p>Memuat...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Paket</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl">
        <label className="block">
          <span className="text-sm font-medium">Nama</span>
          <input
            value={form.nama ?? ""}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Deskripsi</span>
          <textarea
            value={form.deskripsi ?? ""}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Tier</span>
            <select
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="free">Gratis</option>
              <option value="paid">Berbayar</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Harga</span>
            <input
              type="number"
              value={form.price ?? 0}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Jumlah Soal</span>
            <input
              type="number"
              value={form.jumlahSoal ?? 0}
              onChange={(e) =>
                setForm({ ...form, jumlahSoal: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Durasi (menit)</span>
            <input
              type="number"
              value={form.durasiMenit ?? 0}
              onChange={(e) =>
                setForm({ ...form, durasiMenit: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Jenis</span>
            <select
              value={form.jenis}
              onChange={(e) => setForm({ ...form, jenis: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="full">Full</option>
              <option value="subtes">Subtes</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full py-2 bg-brand-600 text-white rounded-lg">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}