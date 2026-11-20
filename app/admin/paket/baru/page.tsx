"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function NewPaketPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    tier: "free",
    price: 0,
    status: "draft",
    jumlahSoal: 110,
    durasiMenit: 100,
    jenis: "full",
  });
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch("/api/admin/paket", {
      method: "POST",
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

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Paket Baru</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl">
        <Field label="Nama">
          <input
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="input"
            required
          />
        </Field>
        <Field label="Deskripsi">
          <textarea
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="input"
            rows={3}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tier">
            <select
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
              className="input"
            >
              <option value="free">Gratis</option>
              <option value="paid">Berbayar</option>
            </select>
          </Field>
          <Field label="Harga (Rp)">
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="input"
              min={0}
              disabled={form.tier === "free"}
            />
          </Field>
          <Field label="Jumlah Soal">
            <input
              type="number"
              value={form.jumlahSoal}
              onChange={(e) =>
                setForm({ ...form, jumlahSoal: Number(e.target.value) })
              }
              className="input"
              min={1}
            />
          </Field>
          <Field label="Durasi (menit)">
            <input
              type="number"
              value={form.durasiMenit}
              onChange={(e) =>
                setForm({ ...form, durasiMenit: Number(e.target.value) })
              }
              className="input"
              min={1}
            />
          </Field>
          <Field label="Jenis">
            <select
              value={form.jenis}
              onChange={(e) => setForm({ ...form, jenis: e.target.value })}
              className="input"
            >
              <option value="full">Full (110 soal)</option>
              <option value="subtes">Per Subtes</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
          Simpan
        </button>
      </form>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}