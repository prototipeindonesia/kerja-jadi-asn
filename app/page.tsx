
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Siap Lolos <span className="text-transparent bg-clip-text bg-gradient-milenial">SKD CPNS?</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Platform try out online dengan simulasi CAT BKN, analisis kelemahan per topik, dan ranking nasional. Mulai perjalanan Anda sekarang.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary text-lg">
            Mulai Latihan Gratis
          </Link>
          <Link href="#fitur" className="px-6 py-3 rounded-full bg-white text-brand-blue font-semibold shadow-sm border border-slate-200 hover:bg-slate-50 transition">
            Lihat Fitur
          </Link>
        </div>
      </main>
    </div>
  );
}