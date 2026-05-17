import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "Cica Center" },
  },
  {
    path: "/produtos",
    name: "Produtos",
    component: () => import("@/views/ProductsView.vue"),
    meta: { title: "Produtos" },
  },
  {
    path: "/produtos/:id",
    name: "ProdutoDetalhe",
    component: () => import("@/views/ProductDetailView.vue"),
    meta: { title: "Detalhe do produto" },
    props: true,
  },
  {
    path: "/carrinho",
    name: "Carrinho",
    component: () => import("@/views/CartView.vue"),
    meta: { title: "Carrinho" },
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: () => import("@/views/CheckoutView.vue"),
    meta: { title: "Finalizar compra", requiresAuth: true },
  },
  {
    path: "/conta",
    name: "Conta",
    component: () => import("@/views/AccountView.vue"),
    meta: { title: "Minha conta", requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { title: "Entrar" },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || "/"),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string | undefined;
  document.title = title ? `${title} | Cica Center` : "Cica Center";

  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
      return;
    }
  }
  next();
});

export default router;
