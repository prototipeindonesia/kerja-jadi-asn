import Link from "next/link";

export default function AdminHome() {
  const items = [
    { href: "/admin/paket", label: "Kelola Paket", desc: "Buat dan atur paket try out", icon: "📦" },
    { href: "/admin/soal", label: "Kelola Soal", desc: "Lihat daftar soal", icon: "📝" },
    { href: "/admin/soal/impor", label: "Impor Excel", desc: "Masukkan soal massal dari file", icon: "📊" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Panel</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="card-glass p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{it.icon}</div>
            <p className="font-bold text-lg text-brand-blue mb-1">{it.label}</p>
            <p className="text-sm text-slate-500">{it.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}