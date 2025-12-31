import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useToast } from "vue-toastification";
import { useAppStore } from "@/stores/app";

export const routes = [
  {
    path: "/",
    component: () => import("@/layouts/index.vue"), // Layout como componente pai
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        redirect: "/home",
      },
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: { perfis: [] }, // Todos os perfis têm acesso
      },
    ],
  },

  {
    path: "/auth",
    name: "Login",
    meta: { requiresAuth: false },
    component: () => import("@/views/auth/index.vue"),
  },
  {
    path: "/proibido",
    name: "Proibido",
    meta: { requiresAuth: false, title: "Acesso Negado" },
    component: () => import("@/views/error/403.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "Nao Encontrado",
    meta: { requiresAuth: false, title: "Página não encontrada" },
    component: () => import("@/views/error/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PORT),
  routes: routes as RouteRecordRaw[],
});

router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  const toast = useToast();
  
  // Verificar autenticação
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("igcampanhas:token");
    if (!token) {
      toast.error("Por favor, faça login para acessar esta página.");
      next({ path: "/auth" });
      return;
    }
    
    // Verificar permissão de acesso por perfil
    const perfisPermitidos = to.meta.perfis as number[] | undefined;
    if (perfisPermitidos && perfisPermitidos.length > 0) {
      if (!appStore.hasAccess(perfisPermitidos)) {
        toast.error("Você não tem permissão para acessar esta página.");
        next({ path: "/proibido" });
        return;
      }
    }
  }
  
  next();
});

export default router;
