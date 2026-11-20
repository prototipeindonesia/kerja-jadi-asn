"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";

type Pkg = {
  id: string;
  nama: string;
  tier: "free" | "paid";
  status: "draft" | "published";
  price: number;
  jumlahSoal: number;
  durasiMenit: number;
  jenis: string;
};

export default function AdminPaketList() {
  const [list, setList] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/paket", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setList(data.packages ?? []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Hapus paket ini?")) return;
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`/api/admin/paket/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Paket</h1>
        <Link
          href="/admin/paket/baru"
          className="px-4 py-2 bg-brand-600 text-white rounded-lg"
        >
          + Paket Baru
        </Link>
      </div>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      {loading ? (
        <p>Memuat...</p>
      ) : list.length === 0 ? (
        <div className="bg-white p-6 rounded-xl text-slate-500">
          Belum ada paket. Klik "+ Paket Baru".
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Jumlah Soal</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-medium">{p.nama}</td>
                  <td className="p-3">{p.tier}</td>
                  <td className="p-3">
                    {p.price === 0 ? "Gratis" : `Rp ${p.price.toLocaleString()}`}
                  </td>
                  <td className="p-3">{p.jumlahSoal}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        p.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/admin/paket/${p.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}