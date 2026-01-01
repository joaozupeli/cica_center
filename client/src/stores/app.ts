import axios from "@/plugins/axios";
import { defineStore } from "pinia";

export interface SnackBar {
  value: boolean;
  color: string;
  text: any;
  icon: string;
  timeout: number;
}

export interface Notify {
  text: any;
  icon: string;
  type?: boolean | undefined | string;
}

export const useAppStore = defineStore("app", {
  state: () => ({
    loading: false,
    user: null as any,
    userLogin: null as string | null,
    snackBar: {
      value: false,
      color: "success",
      text: "",
      icon: "",
      timeout: -1,
    },
  }),
  actions: {
    async setNotify(snackBar: Notify) {
      this.setNotifySnackBar({
        value: !!snackBar.text,
        color: <any>snackBar.type || "success",
        text: snackBar.text,
        icon: snackBar.icon,
        timeout: snackBar.type !== "error" ? 1200 : -1,
      });
    },
    async setNotifySnackBar(snackBar: SnackBar) {
      this.snackBar = {
        value: snackBar.value,
        color: snackBar.color,
        text: snackBar.text,
        icon: snackBar.icon,
        timeout: snackBar.timeout,
      };
    },
    async setLoading(loading: boolean) {
      this.loading = loading;
    },
    async login(payload: any): Promise<any> {
      try {
        const res = await axios.post("autenticacao/login", payload);

        if (res?.data?.token) {
          localStorage.setItem("zperp:token", res.data.token);
          localStorage.setItem("zperp:login", window.btoa(payload.login));
          localStorage.setItem("zperp:nome", window.btoa(res.data.nome));
          localStorage.setItem("zperp:email", window.btoa(res.data.email));
          
          // Salvar perfilId se existir
          if (res.data.perfilId) {
            localStorage.setItem("zperp:perfilId", res.data.perfilId.toString());
          }

          this.userLogin = payload.login;

          axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        }
        return res.data;
      } catch (error) {
        return error;
      }
    },
    async logout(): Promise<any> {
      try {
        localStorage.removeItem("zperp:token");
        localStorage.removeItem("zperp:login");
        localStorage.removeItem("zperp:nome");
        localStorage.removeItem("zperp:email");
        localStorage.removeItem("zperp:perfilId");
        axios.defaults.headers.Authorization = null;
        return { mensagem: "Logout realizado com sucesso" };
      } catch (error) {
        return error;
      }
    },
    
    // Função para obter perfilId do usuário
    getPerfilId(): number | null {
      const perfilId = localStorage.getItem("zperp:perfilId");
      return perfilId ? parseInt(perfilId, 10) : null;
    },
    
    // Função para verificar se o perfil tem acesso a uma rota
    hasAccess(perfisPermitidos: number[] | undefined): boolean {
      if (!perfisPermitidos || perfisPermitidos.length === 0) {
        return true;
      }
      const perfilId = this.getPerfilId();
      return perfilId !== null && perfisPermitidos.includes(perfilId);
    },
  },
});
