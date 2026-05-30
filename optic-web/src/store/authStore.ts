import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "optic-auth",
      // Use cookies via document.cookie so middleware can read it
      storage: createJSONStorage(() => ({
        getItem: (key: string) => {
          if (typeof window === "undefined") return null;
          const cookies = document.cookie.split("; ");
          const cookie = cookies.find((c) => c.startsWith(`${key}=`));
          return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
        },
        setItem: (key: string, value: string) => {
          if (typeof window === "undefined") return;
          document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7}`;
        },
        removeItem: (key: string) => {
          if (typeof window === "undefined") return;
          document.cookie = `${key}=;path=/;max-age=0`;
        },
      })),
    }
  )
);
