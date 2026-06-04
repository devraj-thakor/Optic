import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;          // true once Zustand has read from the cookie
  setHasHydrated: (v: boolean) => void;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// Cookie helpers — synchronous, work in middleware and client components
const COOKIE_NAME = "optic-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  },

  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
  },

  removeItem: (key: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=;path=/;max-age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`;
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: COOKIE_NAME,
      storage: createJSONStorage(() => cookieStorage),

      // Called once Zustand has finished reading state from the cookie.
      // Until this fires, _hasHydrated is false and auth guards must not act.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
