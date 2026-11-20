"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";

type Soal = {
  id: string;
  packageId: string;
  subtest: string;
  topic: string;
  text: string;
};

export default function AdminSoalList() {
  const [list, setList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch("/api/admin/soal", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setList(data.questions ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Hapus soal ini?")) return;
    const token = await auth.currentUser?.getIdToken();
    await fetch(`/api/admin/soal/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Soal</h1>
        <Link
          href="/admin/soal/baru"
          className="px-4 py-2 bg-brand-600 text-white rounded-lg"
        >
          + Soal Baru
        </Link>
      </div>
      {loading ? (
        <p>Memuat...</p>
      ) : list.length === 0 ? (
        <div className="bg-white p-6 rounded-xl text-slate-500">
          Belum ada soal.
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Subtes</th>
                <th className="p-3">Topik</th>
                <th className="p-3">Pertanyaan</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((q) => (
                <tr key={q.id} className="border-t">
                  <td className="p-3">{q.subtest}</td>
                  <td className="p-3">{q.topic}</td>
                  <td className="p-3 max-w-md truncate">{q.text}</td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/admin/soal/${q.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(q.id)}
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