import Link from "next/link";

export default function AdminHome() {
  const items = [
    { href: "/admin/paket", label: "Kelola Paket" },
    { href: "/admin/soal", label: "Kelola Soal" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow transition"
          >
            <p className="font-semibold text-brand-700">{it.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}