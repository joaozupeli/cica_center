import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
// Função para obter a instância do toast quando necessário
const getToast = () => useToast();

// Armazena o ID do último toast para poder removê-lo
let lastToastId: string | number | null = null;

// Função helper para mostrar toast único (remove o anterior)
function showUniqueToast(
  type: "success" | "error" | "warning" | "info",
  message: string
) {
  const toast = getToast();

  // Remove o toast anterior se existir
  if (lastToastId !== null) {
    toast.dismiss(lastToastId);
  }

  // Mostra o novo toast e armazena seu ID
  lastToastId = toast[type](message);
}

// Estender o tipo InternalAxiosRequestConfig para incluir requestId
declare module "axios" {
  interface InternalAxiosRequestConfig {
    requestId?: string;
  }
}

// Configuração do timeout máximo para o loading (em ms)
// const MAX_LOADING_TIME = 30000; // 30 segundos
let loadingTimeoutId: number | null = null;

// Função para forçar a desativação do loading após um tempo máximo
// function forceResetLoading() {
//   const appStore = useAppStore();
//   if (activeRequests > 0) {
//     activeRequests = 0;
//     appStore.setLoading(false);
//   }
// }

const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("igcampanhas:token")}`,
  },
});

// Contador de requisições ativas
let activeRequests = 0;

// Mapa para rastrear requisições por ID
let requestsMap: Record<string, { url: string; startTime: number }> = {};

// Controle de throttle para atualização de localização via localStorage
const LOCATION_UPDATE_INTERVAL = 300000; // 5 minutos em ms
const LOCATION_STORAGE_KEY = "igcampanhas:last-location-update";

// Função para gerar um ID único para cada requisição
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Função para depurar requisições ativas
function debugActiveRequests() {
  if (activeRequests > 0) {
    console.log(
      `[Axios Debug] ${activeRequests} requisições ativas:`,
      requestsMap
    );
  }
}

// Configure o interceptador de REQUISIÇÃO (REQUEST)
Axios.interceptors.request.use(
  (config) => {
    // Importa o store aqui dentro para garantir que o Pinia já esteja ativo
    const appStore = useAppStore();

    // Gera um ID único para esta requisição
    const requestId = generateRequestId();
    (config as InternalAxiosRequestConfig).requestId = requestId;

    // Registra a requisição no mapa
    requestsMap[requestId] = {
      url: config.url || "desconhecido",
      startTime: Date.now(),
    };

    // Atualizar localização com throttle usando localStorage
    const now = Date.now();
    const isLocationUpdateRequest = config.url?.includes(
      "atualizar-localizacao"
    );
    const hasToken = localStorage.getItem("igcampanhas:token");
    const lastUpdate = parseInt(
      localStorage.getItem(LOCATION_STORAGE_KEY) || "0"
    );

    if (
      !isLocationUpdateRequest &&
      hasToken &&
      now - lastUpdate >= LOCATION_UPDATE_INTERVAL
    ) {
      localStorage.setItem(LOCATION_STORAGE_KEY, now.toString());
      // Chama de forma assíncrona sem bloquear a requisição atual
      // appStore.atualizarLocalizacao().catch(() => {
      //   // Ignora erros silenciosamente
      // });
    }

    // Se é a primeira requisição, ativa o loading e configura o timeout de segurança
    if (activeRequests === 0) {
      appStore.setLoading(true);

      // Configura um timeout para garantir que o loading não fique preso
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
      }
      // loadingTimeoutId = window.setTimeout(forceResetLoading, MAX_LOADING_TIME);
    }

    activeRequests++;

    // É crucial retornar a config para a requisição continuar
    return config;
  },
  (error) => {
    // Em caso de erro ao montar a requisição, também desativa o loading
    const appStore = useAppStore();

    // Limpa o timeout de segurança
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      loadingTimeoutId = null;
    }

    // Reseta o contador e o mapa de requisições
    activeRequests = 0;
    requestsMap = {};

    appStore.setLoading(false);
    console.error("[Axios] Erro ao montar requisição:", error);
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => {
    const appStore = useAppStore();

    // Remove a requisição do mapa
    if (response.config && response.config.requestId) {
      delete requestsMap[response.config.requestId];
    }

    activeRequests = Math.max(0, activeRequests - 1);

    if (activeRequests === 0) {
      appStore.setLoading(false);

      // Limpa o timeout de segurança
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
        loadingTimeoutId = null;
      }
    }

    // Tratamento de mensagens de resposta com toast
    if (response.data) {
      if (typeof response.data.mensagem === "string") {
        showUniqueToast("success", response.data.mensagem);
      } else if (Array.isArray(response.data.erro)) {
        showUniqueToast(
          "error",
          Object.values(response.data.erro[0]).toString()
        );
      } else if (typeof response.data.erro === "string") {
        showUniqueToast("error", response.data.erro);
      } else if (typeof response.data.atencao === "string") {
        showUniqueToast("warning", response.data.atencao);
      } else if (typeof response.data.informacao === "string") {
        showUniqueToast("info", response.data.informacao);
      }
    }

    return response;
  },
  (error) => {
    const appStore = useAppStore();
    const router = useRouter();

    // Remove a requisição do mapa
    if (error.config && error.config.requestId) {
      delete requestsMap[error.config.requestId];
    }

    activeRequests = Math.max(0, activeRequests - 1);

    if (activeRequests === 0) {
      appStore.setLoading(false);

      // Limpa o timeout de segurança
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
        loadingTimeoutId = null;
      }
    }

    // Debug para verificar se ainda existem requisições pendentes
    if (activeRequests > 0) {
      debugActiveRequests();
    }

    // Tratamento de erros com toast
    if (!error.response) {
      window.console.log(error);
      showUniqueToast(
        "error",
        "Erro ao processar requisição. Tente novamente!"
      );
    } else if (error.response.status === 401) {
      localStorage.removeItem("igcampanhas:token");
      localStorage.removeItem("igcampanhas:nome");
      localStorage.removeItem("igcampanhas:email");
      localStorage.removeItem("igcampanhas:paginas-usuario");
      localStorage.removeItem("igcampanhas:last-location-update");

      if (
        error.response.config &&
        error.response.config.url &&
        error.response.config.url !== "autenticacao/auth"
      ) {
        router.push("/auth");
        showUniqueToast(
          "error",
          "Sessão expirada. Por favor, faça login novamente."
        );
      }
    } else if (error.response.status === 403) {
      showUniqueToast("error", "Usuário sem permissão!");
    } else if (error.response.status === 404) {
      showUniqueToast("error", "Requisição não encontrada!");
      return Promise.reject(error);
    } else if (
      error.response.status === 400 &&
      Array.isArray(error.response.data.erro)
    ) {
      showUniqueToast(
        "error",
        Object.values(error.response.data.erro[0]).toString()
      );
    } else if (
      error.response.status === 400 &&
      typeof error.response.data.erro === "string"
    ) {
      showUniqueToast("error", error.response.data.erro);
    } else if (error.response.status === 500) {
      showUniqueToast(
        "error",
        error.response.data.erro || "Erro interno do servidor"
      );
    } else if (error.response.data && error.response.data.erro) {
      showUniqueToast("error", error.response.data.erro);
    } else {
      showUniqueToast("error", "Ocorreu um erro ao processar sua solicitação.");
    }

    return Promise.reject(error.response?.data);
  }
);

export default Axios;
