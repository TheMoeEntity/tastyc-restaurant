"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
  refresh: async () => {},
  clear: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    // Only fetch if we have a cookie — avoids unnecessary API calls
    if (typeof document === "undefined") return;
    if (!document.cookie.includes("tastyc_user_id=")) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch<any>("/api/auth/me");
      if (res.success) {
        setUser(res.data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refresh: fetchUser,
        clear,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
