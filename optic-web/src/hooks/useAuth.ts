import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { AuthUser } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data.data as { token: string; user: AuthUser };
    },
    onSuccess: (result) => {
      setAuth(result.token, result.user);
      toast.success(`Welcome back, ${result.user.name}!`);
    },
    onError: () => {
      toast.error("Invalid credentials. Please try again.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSettled: () => {
      logout();
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
