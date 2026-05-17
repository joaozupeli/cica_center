import { defineStore } from "pinia";
import api, { setAuthToken } from "@/services/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  authGuard: {
    open: boolean;
    redirectTo: string | null;
    message: string;
  };
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    authGuard: {
      open: false,
      redirectTo: null,
      message: "",
    },
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },

  actions: {
    async login(payload: LoginPayload): Promise<void> {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      this.setAuth(data);
    },

    async register(payload: RegisterPayload): Promise<void> {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      this.setAuth(data);
    },

    setAuth(data: AuthResponse) {
      this.user = data.user;
      this.token = data.token;
      setAuthToken(data.token);
    },

    logout() {
      this.user = null;
      this.token = null;
      setAuthToken(null);
    },

    requireAuth(redirectTo: string, message = "Faça login para continuar") {
      this.authGuard = {
        open: true,
        redirectTo,
        message,
      };
    },

    closeAuthGuard() {
      this.authGuard = {
        open: false,
        redirectTo: null,
        message: "",
      };
    },
  },
});
