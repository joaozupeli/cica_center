<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { useDateFormat, useNow } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import { version } from "../../package.json";
import g4_branco from "@/assets/g4_branco.svg";
import Loading from "@/components/Loading.vue";

const router = useRouter();
const appStore = useAppStore();
const { mobile } = useDisplay();
const theme = useTheme();
const isDark = theme.themes.value.light.dark;
const dataAtual = useDateFormat(useNow(), "dddd - DD/MM/YYYY - HH:mm:ss");
const drawer = ref(!mobile.value);
const miniVariant = ref(false);

const login = localStorage.getItem("igcampanhas:login")
  ? window.atob(localStorage.getItem("igcampanhas:login") || "")
  : "Usuário";

const nome = localStorage.getItem("igcampanhas:nome")
  ? window.atob(localStorage.getItem("igcampanhas:nome") || "")
  : "";

// Mapeamento de rotas e perfis permitidos
const menuItemsConfig = [
  { title: "Início", icon: "mdi-home", to: "/home", perfis: [] },
  { title: "Histórico", icon: "mdi-history", to: "/historico", perfis: [] },
  { title: "Clientes", icon: "mdi-account", to: "/clientes", perfis: [] },
  { title: "Ganhadores", icon: "mdi-trophy", to: "/ganhadores", perfis: [] },
  { title: "Relatório", icon: "mdi-chart-bar", to: "/relatorio", perfis: [] },
];

const cadastrosItemsConfig = [
  { title: "Campanhas", icon: "mdi-bullhorn", to: "/campanhas", perfis: [1] },
  { title: "Usuários", icon: "mdi-account-group", to: "/cadastro/usuario", perfis: [1] },
];

// Filtrar itens do menu baseado no perfil do usuário
const menuItems = computed(() => {
  return menuItemsConfig.filter((item) => {
    if (!item.perfis || item.perfis.length === 0) return true;
    return appStore.hasAccess(item.perfis);
  });
});

const cadastrosItems = computed(() => {
  return cadastrosItemsConfig.filter((item) => {
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
  return router.currentRoute.value.path === path;
}

onMounted(async () => {
  if (localStorage.getItem("igcampanhas:token")) {
    // Carregar dados iniciais se necessário
  }
});
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" elevation="2" density="comfortable">
      <template #prepend>
        <v-app-bar-nav-icon color="white" @click="drawer = !drawer" />
      </template>

      <div class="d-flex align-center">
        <img
          :src="g4_branco"
          alt="Logo"
          height="36"
          class="mr-2 cursor-pointer"
          style="filter: brightness(0) invert(1)"
          @click="goToRoute('/home')"
        />
        <span
          class="text-h6 text-white font-weight-bold cursor-pointer d-none d-sm-block"
          @click="goToRoute('/home')"
        >
          CAMPANHAS
        </span>
      </div>

      <v-spacer />

      <!-- Menu do usuário -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="text-white">
            <v-icon class="mr-2">mdi-account-circle</v-icon>
            <span class="d-none d-sm-block">{{ login }}</span>
            <v-icon class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-card min-width="280" class="user-menu-card">
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-3">
              <v-avatar color="primary" size="48">
                <v-icon color="white" size="28">mdi-account</v-icon>
              </v-avatar>
              <div class="ml-3">
                <div class="font-weight-bold">{{ login }}</div>
                <div class="text-caption text-grey">{{ nome }}</div>
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-2">
            <v-btn
              block
              color="error"
              variant="tonal"
              prepend-icon="mdi-logout"
              @click="handleLogout"
            >
              Sair
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <!-- Menu vertical (3 pontinhos) -->
      <!-- <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="white"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item @click="handleLogout">
              <template #prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
              <v-list-item-title>Sair do Sistema</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
    </v-app-bar>

    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="miniVariant && !mobile"
      :temporary="mobile"
      color="grey-darken-4"
      width="256"
      class="sidebar"
    >
      <!-- Logo no drawer -->
      <!-- <div class="sidebar-header pa-4">
          <div class="d-flex align-center">
            <img
              :src="g4_branco"
              alt="Logo"
              height="32"
              style="filter: brightness(0) invert(1);"
            />
            <span v-if="!miniVariant" class="text-white font-weight-bold ml-2">
            CAMPANHAS
            </span>
          </div>
        </div> -->

      <v-divider color="grey-darken-3" />

      <!-- Menu Items -->
      <v-list density="compact" nav class="sidebar-list">
        <!-- Items principais -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :active="isActiveRoute(item.to)"
          :class="{ 'sidebar-item-active': isActiveRoute(item.to) }"
          class="sidebar-item"
          rounded="lg"
        >
          <template #prepend>
            <v-icon :color="isActiveRoute(item.to) ? 'primary' : 'white'">
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            :class="
              isActiveRoute(item.to)
                ? 'text-primary font-weight-bold'
                : 'text-white'
            "
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-divider color="grey-darken-3" class="my-2" />

        <!-- Cadastros (grupo expansível) -->
        <v-list-group v-if="appStore.hasAccess([1])" value="Cadastros" class="sidebar-group">
          <template #activator="{ props }">
            <v-list-item v-bind="props" class="sidebar-item" rounded="lg">
              <template #prepend>
                <v-icon color="primary">mdi-plus</v-icon>
              </template>
              <v-list-item-title class="text-primary font-weight-medium">
                Cadastros
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="subItem in cadastrosItems"
            :key="subItem.to"
            :to="subItem.to"
            :active="isActiveRoute(subItem.to)"
            :class="{ 'sidebar-item-active': isActiveRoute(subItem.to) }"
            class="sidebar-item sidebar-subitem"
            rounded="lg"
          >
            <template #prepend>
              <v-icon
                :color="
                  isActiveRoute(subItem.to) ? 'primary' : 'grey-lighten-1'
                "
                size="20"
              >
                {{ subItem.icon }}
              </v-icon>
            </template>
            <v-list-item-title
              :class="
                isActiveRoute(subItem.to)
                  ? 'text-primary font-weight-bold'
                  : 'text-grey-lighten-1'
              "
              class="text-body-2"
            >
              {{ subItem.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>

      <!-- Footer do drawer -->
      <template #append>
        <v-divider color="grey-darken-3" />
        <div class="pa-3 text-center">
          <span class="text-caption text-grey-darken-1"> {{ version }} </span>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <RouterView />
    </v-main>

    <!-- Footer -->
    <v-footer app color="primary" height="24" class="footer">
      <div class="d-flex align-center justify-center w-100">
        <span class="text-caption text-white">
          {{ dataAtual }}
          <span class="mx-4">|</span>
          <strong>Sistema de Campanhas Promocionais</strong>
          <span class="mx-4">|</span>
          <strong>Versão {{ version }}</strong>
        </span>
      </div>
    </v-footer>

    <!-- Loading overlay -->
    <Loading v-model="appStore.loading" />

    <!-- Snackbar para notificações -->
    <v-snackbar
      :model-value="false"
      color="primary"
      timeout="3000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-information</v-icon>
        Teste
      </div>
      <template #actions>
        <v-btn variant="text" @click="false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

.sidebar {
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%) !important;
}

.sidebar-header {
  background: rgba(8, 96, 53, 0.2);
}

.sidebar-list {
  padding: 8px;
}

.sidebar-item {
  margin-bottom: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }
}

.sidebar-item-active {
  background: rgba(8, 96, 53, 0.3) !important;
  border-left: 3px solid #086035;
}

.sidebar-subitem {
  margin-left: 12px;
}

.sidebar-group :deep(.v-list-group__items) {
  padding-left: 0;
}

.main-content {
  background: linear-gradient(180deg, #f8faf9 0%, #f0f4f2 100%);
}

.footer {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.user-menu-card {
  border-radius: 12px !important;
}

// Ajustes para o tema escuro da sidebar
:deep(.v-navigation-drawer) {
  .v-list-item--active {
    &::before {
      opacity: 0 !important;
    }
  }
}
</style>
