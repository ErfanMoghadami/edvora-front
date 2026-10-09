import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "@/types/auth";

const COOKIE_OPTIONS = {
  expires: 7,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  hasHydrated: false,

  setAuth: (user, token) => {
    Cookies.set("auth_token", token, COOKIE_OPTIONS);
    Cookies.set("auth_user", JSON.stringify(user), COOKIE_OPTIONS);
    set({ user, isAuthenticated: true, hasHydrated: true });
  },

  setUser: (user) => {
    Cookies.set("auth_user", JSON.stringify(user), COOKIE_OPTIONS);
    set({ user });
  },

  clearAuth: () => {
    Cookies.remove("auth_token", { path: "/" });
    Cookies.remove("auth_user", { path: "/" });
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = Cookies.get("auth_token");
    const userStr = Cookies.get("auth_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, isAuthenticated: true, hasHydrated: true });
        return;
      } catch {
        // ignore parse error
      }
    }

    set({ user: null, isAuthenticated: false, hasHydrated: true });
  },
}));