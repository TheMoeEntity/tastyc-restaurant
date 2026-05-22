"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import apiFetch from "@/lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  loyaltyPoints: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  clear: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  refresh: async () => { },
  clear: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isFetchingRef = useRef(false);

  const fetchUser = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (typeof document === "undefined") return;

    if (!document.cookie.includes("tastyc_user_id=")) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (window.location.pathname.startsWith("/auth/")) {
      setLoading(false);
      return;
    }

    isFetchingRef.current = true;
    try {
      const res = await apiFetch<any>("/api/auth/me");
      if (res.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      if (!(window as any).__tastyc_redirecting) {
        setUser(null);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const clear = useCallback(() => {
    setUser(null);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // ── Route change handler ──────────────────────────────────
  // Skip API call if user already in state — no unnecessary network calls
  useEffect(() => {
    if (user) return;
    fetchUser();
  }, [pathname]);

  // ── Initial mount ─────────────────────────────────────────
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, refresh, clear }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}