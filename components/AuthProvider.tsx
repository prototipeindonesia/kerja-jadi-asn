"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Ctx = { user: User | null; loading: boolean; admin: boolean };

const AuthCtx = createContext<Ctx>({ user: null, loading: true, admin: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          // Tanya langsung ke server apakah UID ini punya akses admin
          const token = await u.getIdToken(true);
          const res = await fetch("/api/auth/session/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setAdmin(data.admin === true);
        } catch (err) {
          setAdmin(false);
        }
      } else {
        setAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, admin }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);