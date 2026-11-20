import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-brand-700">
          Latihan SKD CPNS Online
        </h1>
        <p className="mt-4 text-slate-600 max-w-xl mx-auto">
          Simulasi CAT, analisis kelemahan, ranking nasional, dan target skor
          per formasi. Gratis untuk mulai.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
          >
            Mulai Latihan
          </Link>
        </div>
      </main>
    </>
  );
}