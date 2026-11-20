"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  async function syncSession() {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function handleGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      await syncSession();
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      await syncSession();
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-brand-700 text-center mb-6">
          Kerja Jadi ASN
        </h1>
        <button
          onClick={handleGoogle}
          className="w-full py-2 border rounded-lg mb-4 hover:bg-slate-50"
        >
          Masuk dengan Google
        </button>
        <div className="text-center text-sm text-slate-400 mb-4">atau</div>
        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            minLength={6}
          />
          {err && <p className="text-red-600 text-xs">{err}</p>}
          <button className="w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
            {mode === "login" ? "Masuk" : "Daftar"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-center text-sm text-brand-600 mt-4 hover:underline"
        >
          {mode === "login"
            ? "Belum punya akun? Daftar"
            : "Sudah punya akun? Masuk"}
        </button>
      </div>
    </div>
  );
}