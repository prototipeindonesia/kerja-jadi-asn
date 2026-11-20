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
        const token = await u.getIdTokenResult();
        setAdmin(token.claims.admin === true);
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