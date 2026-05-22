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

// ── Decode JWT without verification ──────────────────────────
// Used client-side to check expiry and extract userId
// Signature verification happens on Express for every API call

function decodeToken(): { userId: string; role: string; exp: number } | null {
  if (typeof document === "undefined") return null;
  try {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("tastyc_access_token="));
    if (!cookie) return null;
    const token = cookie.split("=")[1];
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

function getTokenExpiryMs(): number | null {
  const payload = decodeToken();
  if (!payload?.exp) return null;
  return payload.exp * 1000 - Date.now();
}

function hasValidToken(): boolean {
  const expiryMs = getTokenExpiryMs();
  return expiryMs !== null && expiryMs > 0;
}

// ── How long before expiry to refresh ────────────────────────
// 30 seconds before expiry — gives buffer for network latency
const REFRESH_BUFFER_MS = 30 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  // ── Clear proactive refresh timer ────────────────────────
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // ── Schedule proactive refresh ────────────────────────────
  // Fires REFRESH_BUFFER_MS before token expiry
  // On success: new token set, timer restarted, user stays logged in
  // On failure: both tokens expired, user cleared

  const scheduleProactiveRefresh = useCallback(() => {
    clearRefreshTimer();

    const expiryMs = getTokenExpiryMs();
    if (!expiryMs || expiryMs <= 0) return;

    const delay = Math.max(expiryMs - REFRESH_BUFFER_MS, 0);


    refreshTimerRef.current = setTimeout(async () => {

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/refresh`,
          { method: "POST", credentials: "include" },
        );

        if (res.ok) {

          // Invalidate Redis cache so next /api/auth/me gets fresh data
          // Then re-fetch user to update context
          await fetchUser(false); // false = don't reschedule (scheduleProactiveRefresh handles it)
          scheduleProactiveRefresh(); // restart timer with new token's expiry
        } else {

          clear();
        }
      } catch {

        // Don't clear — might be temporary network issue
        // apiFetch will handle it reactively when the next API call fires
      }
    }, delay);
  }, [clearRefreshTimer]);

  // ── Fetch user from API ───────────────────────────────────
  // Redis-cached on the backend — fast after first call

  const fetchUser = useCallback(async (andScheduleRefresh = true) => {
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
        if (andScheduleRefresh) scheduleProactiveRefresh();
      } else {
        setUser(null);
        clearRefreshTimer();
      }
    } catch (err: any) {
      if (!(window as any).__tastyc_redirecting) {
        setUser(null);
        clearRefreshTimer();
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [scheduleProactiveRefresh, clearRefreshTimer]);

  const clear = useCallback(() => {
    setUser(null);
    setLoading(false);
    clearRefreshTimer();
  }, [clearRefreshTimer]);

  const refresh = useCallback(async () => {
    await fetchUser(true);
  }, [fetchUser]);

  // ── Route change handler ──────────────────────────────────
  // Only re-fetch if token is expired or user is null
  // If token valid + user present → skip API call (use cached context)

  useEffect(() => {
    if (hasValidToken() && user) {
      // Token still valid and we have user data — no need to hit API
      // Just ensure the refresh timer is running
      if (!refreshTimerRef.current) {
        scheduleProactiveRefresh();
      }
      return;
    }

    // Token expired or no user — fetch (apiFetch handles silent refresh internally)
    fetchUser(true);
  }, [pathname]);

  // ── Initial mount ─────────────────────────────────────────
  useEffect(() => {
    fetchUser(true);

    return () => clearRefreshTimer(); // cleanup on unmount
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