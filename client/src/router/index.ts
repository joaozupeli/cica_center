import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useToast } from "vue-toastification";
import { useAppStore } from "@/stores/app";

export const routes = [
  {
    path: "/",
    component: () => import("@/layouts/index.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { perfis: [], title: "Dashboard" },
      },
      {
        path: "home",
        redirect: "/dashboard",
      },
      {
        path: "financeiro",
        name: "Financeiro",
        component: () => import("@/views/financeiro/index.vue"),
        meta: { perfis: [], title: "Financeiro" },
      },
      {
        path: "tarefas",
        name: "Tarefas",
        component: () => import("@/views/tarefas/index.vue"),
        meta: { perfis: [], title: "Tarefas" },
      },
      {
        path: "clientes",
        name: "Clientes",
        component: () => import("@/views/clientes/index.vue"),
        meta: { perfis: [], title: "Clientes" },
      },
      {
        path: "produtos",
        name: "Produtos",
        component: () => import("@/views/produtos/index.vue"),
        meta: { perfis: [], title: "Produtos" },
      },
      {
        path: "vendas",
        name: "Vendas",
        component: () => import("@/views/vendas/index.vue"),
        meta: { perfis: [], title: "Vendas" },
      },
      {
        path: "relatorios",
        name: "Relatorios",
        component: () => import("@/views/relatorios/index.vue"),
        meta: { perfis: [], title: "Relatórios" },
      },
      {
        path: "configuracoes",
        name: "Configuracoes",
        component: () => import("@/views/configuracoes/index.vue"),
        meta: { perfis: [1], title: "Configurações" },
      },
      {
        path: "configuracoes/usuarios",
        name: "Usuarios",
        component: () => import("@/views/configuracoes/usuarios/index.vue"),
        meta: { perfis: [1], title: "Usuários" },
      },
      {
        path: "configuracoes/empresa",
        name: "Empresa",
        component: () => import("@/views/configuracoes/empresa/index.vue"),
        meta: { perfis: [1], title: "Empresa" },
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
  
  // Atualizar título da página
  const title = to.meta.title as string;
  document.title = title ? `${title} | zpErp` : 'zpErp - Sistema de Gestão Empresarial';
  
  // Verificar autenticação
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // const token = localStorage.getItem("zperp:token");
    // if (!token) {
    //   toast.error("Por favor, faça login para acessar esta página.");
    //   next({ path: "/auth" });
    //   return;
    // }
    
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
