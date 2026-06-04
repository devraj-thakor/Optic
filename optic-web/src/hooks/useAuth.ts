"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { AuthUser } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

// Hard redirect that forces a full page reload — bypasses any stale Next.js
// router state or hydration mismatch. Used as the final fallback.
function hardRedirect(path: string) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();

  // ─── Login ───────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data.data as { token: string; user: AuthUser };
    },
    onSuccess: async (result) => {
      // 1. Write to store (also persists to cookie via zustand persist middleware)
      setAuth(result.token, result.user);

      toast.success(`Welcome back, ${result.user.name}!`);

      // 2. Give the cookie storage one tick to flush (cookie write is sync but
      //    zustand persist's setItem may batch with other microtasks)
      await new Promise((r) => setTimeout(r, 80));

      // 3. Try Next.js router first (soft navigation — fastest, no flash)
      try {
        router.push("/dashboard");

        // 4. Fallback: if the soft nav hasn't committed after 400ms, do a hard
        //    redirect. This catches the Vercel/production case where router.push
        //    silently fails because the middleware sees no cookie yet.
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/dashboard")
          ) {
            hardRedirect("/dashboard");
          }
        }, 400);
      } catch {
        // 5. Last resort — always works
        hardRedirect("/dashboard");
      }
    },
    onError: () => {
      toast.error("Invalid credentials. Please try again.");
    },
  });

  // ─── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      // Fire-and-forget the server logout (revokes Sanctum token).
      // We don't await this because we want instant client-side cleanup
      // regardless of whether the API call succeeds.
      api.post("/auth/logout").catch(() => {/* ignore */});
    } finally {
      // 1. Clear all cached query data so no stale authenticated data lingers
      queryClient.clear();

      // 2. Clear Zustand auth state + cookie
      storeLogout();

      // 3. Short delay to let React flush the state update (prevents the
      //    sidebar from briefly showing stale user info during navigation)
      await new Promise((r) => setTimeout(r, 50));

      // 4. Hard redirect — most reliable, bypasses any router state issues.
      //    router.push('/login') can be flaky if the component is already
      //    unmounting or if the router cache has stale entries.
      hardRedirect("/login");
    }
  }, [queryClient, storeLogout]);

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: false, // logout is now instant
  };
}
