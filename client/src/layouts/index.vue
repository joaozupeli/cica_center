<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { useDateFormat, useNow } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { version } from "../../package.json";
import Loading from "@/components/Loading.vue";

const router = useRouter();
const appStore = useAppStore();
const { mobile } = useDisplay();
const dataAtual = useDateFormat(useNow(), "DD/MM/YYYY HH:mm");
const drawer = ref(!mobile.value);

const login = localStorage.getItem("zperp:login")
  ? window.atob(localStorage.getItem("zperp:login") || "")
  : "Usuário";

const nome = localStorage.getItem("zperp:nome")
  ? window.atob(localStorage.getItem("zperp:nome") || "")
  : "";

const menuItemsConfig = [
  { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard", perfis: [] },
  { title: "Financeiro", icon: "mdi-cash-multiple", to: "/financeiro", perfis: [] },
  { title: "Tarefas", icon: "mdi-clipboard-check-outline", to: "/tarefas", perfis: [] },
  { title: "Clientes", icon: "mdi-account-group", to: "/clientes", perfis: [] },
  { title: "Produtos", icon: "mdi-package-variant-closed", to: "/produtos", perfis: [] },
  { title: "Vendas", icon: "mdi-cart-outline", to: "/vendas", perfis: [] },
  { title: "Relatórios", icon: "mdi-chart-bar", to: "/relatorios", perfis: [] },
];

const configItemsConfig = [
  { title: "Usuários", icon: "mdi-account-cog", to: "/configuracoes/usuarios", perfis: [1] },
  { title: "Empresa", icon: "mdi-domain", to: "/configuracoes/empresa", perfis: [1] },
  { title: "Sistema", icon: "mdi-cog", to: "/configuracoes", perfis: [1] },
];

const menuItems = computed(() => {
  return menuItemsConfig.filter((item) => {
    if (!item.perfis || item.perfis.length === 0) return true;
    return appStore.hasAccess(item.perfis);
  });
});

const configItems = computed(() => {
  return configItemsConfig.filter((item) => {
    if (!item.perfis || item.perfis.length === 0) return true;
    return appStore.hasAccess(item.perfis);
  });
});

async function handleLogout() {
  await appStore.setLoading(true);
  await appStore.logout();
  router.push("/auth");
  await appStore.setLoading(false);
}

function goToRoute(path: string) {
  if (path !== router.currentRoute.value.path) {
    router.push(path);
  }
}

function isActiveRoute(path: string) {
  return router.currentRoute.value.path === path || 
         router.currentRoute.value.path.startsWith(path + '/');
}

onMounted(async () => {
  if (localStorage.getItem("zperp:token")) {
  }
});
</script>

<template>
  <v-app class="app-container">
    <v-app-bar color="black" elevation="0" density="compact" height="48">
      <template #prepend>
        <v-app-bar-nav-icon color="white" size="small" @click="drawer = !drawer" />
      </template>

      <div class="d-flex align-center" style="cursor: pointer" @click="goToRoute('/dashboard')">
        <v-icon size="20" color="white" class="mr-2">mdi-cogs</v-icon>
        <span class="app-title d-none d-sm-block">zpErp</span>
      </div>

      <v-spacer />

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" size="small" class="text-grey-lighten-1">
            <v-icon size="18" class="mr-1">mdi-account-circle</v-icon>
            <span class="d-none d-sm-block text-caption">{{ login }}</span>
            <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-card min-width="200" color="grey-darken-4" class="py-1">
          <v-list density="compact" bg-color="transparent" class="py-0">
            <v-list-item class="text-grey-lighten-1">
              <div class="text-caption font-weight-medium">{{ login }}</div>
              <div class="text-caption text-grey">{{ nome }}</div>
            </v-list-item>
          </v-list>
          <v-divider color="grey-darken-3" class="my-1" />
          <v-list density="compact" bg-color="transparent" class="py-0">
            <v-list-item
              prepend-icon="mdi-logout"
              class="text-grey-lighten-1"
              @click="handleLogout"
            >
              <v-list-item-title class="text-caption">Sair</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :temporary="mobile"
      color="grey-darken-4"
      width="220"
    >
      <v-list density="compact" nav class="py-2 px-2">
        <div class="menu-section-title">MENU</div>
        
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :active="isActiveRoute(item.to)"
          :class="{ 'sidebar-item-active': isActiveRoute(item.to) }"
          class="sidebar-item mb-1"
          rounded="lg"
          height="36"
        >
          <template #prepend>
            <v-icon :color="isActiveRoute(item.to) ? 'white' : 'grey'" size="18">
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            class="text-caption"
            :class="isActiveRoute(item.to) ? 'text-white' : 'text-grey-lighten-1'"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-divider color="grey-darken-3" class="my-2" />

        <div class="menu-section-title">CONFIG</div>
        
        <v-list-item
          v-for="item in configItems"
          :key="item.to"
          :to="item.to"
          :active="isActiveRoute(item.to)"
          :class="{ 'sidebar-item-active': isActiveRoute(item.to) }"
          class="sidebar-item mb-1"
          rounded="lg"
          height="36"
        >
          <template #prepend>
            <v-icon :color="isActiveRoute(item.to) ? 'white' : 'grey'" size="18">
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            class="text-caption"
            :class="isActiveRoute(item.to) ? 'text-white' : 'text-grey-lighten-1'"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2 text-center">
          <span class="text-caption text-grey-darken-1">v{{ version }}</span>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="main-content">
      <RouterView />
    </v-main>

    <v-footer app color="black" height="24">
      <div class="d-flex align-center justify-center w-100">
        <span class="text-caption text-grey-darken-1">
          {{ dataAtual }} | zpErp v{{ version }}
        </span>
      </div>
    </v-footer>

    <Loading v-model="appStore.loading" />
  </v-app>
</template>

<style lang="scss" scoped>
.app-container {
  background: #121212 !important;
}

.app-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
}

.menu-section-title {
  font-size: 0.6rem;
  font-weight: 600;
  color: #444;
  letter-spacing: 1px;
  padding: 8px 12px 4px;
}

.sidebar-item {
  min-height: 36px;
}

.sidebar-item-active {
  background: rgba(255, 255, 255, 0.08) !important;
}

.main-content {
  background: #1a1a1a;
}

:deep(.v-navigation-drawer) {
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}

:deep(.v-list-item--active)::before {
  opacity: 0 !important;
}
</style>
