<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const router = useRouter();
const auth = useAuthStore();
const cart = useCartStore();

const mobileMenu = ref(false);
const searchQuery = ref("");

const totalItems = computed(() => cart.totalItems);
const isAuthenticated = computed(() => auth.isAuthenticated);

function submitSearch() {
  const term = searchQuery.value.trim();
  router.push({
    path: "/produtos",
    query: term ? { carro: term, page: "1" } : { page: "1" },
  });
  searchQuery.value = "";
  mobileMenu.value = false;
}

function goAccount() {
  if (auth.isAuthenticated) {
    router.push("/conta");
  } else {
    router.push("/login");
  }
}
</script>

<template>
  <v-app-bar
    color="background"
    flat
    height="72"
    class="cica-header"
    :elevation="0"
  >
    <v-container class="d-flex align-center pa-0" max-width="1440">
      <router-link to="/" class="logo">
        <img
          src="/cica_center_logo.png"
          alt="Cica Center"
          class="logo-img"
        />
      </router-link>

      <nav class="header-nav d-none d-md-flex">
        <router-link to="/" class="nav-link">Início</router-link>
        <router-link to="/produtos" class="nav-link">Rodas</router-link>
        <router-link to="/carrinho" class="nav-link">Carrinho</router-link>
      </nav>

      <v-spacer />

      <v-form
        class="search-form d-none d-sm-flex"
        @submit.prevent="submitSearch"
      >
        <v-text-field
          v-model="searchQuery"
          placeholder="Buscar rodas, carros, modelos..."
          variant="solo-filled"
          density="compact"
          hide-details
          single-line
          flat
          bg-color="surface"
          prepend-inner-icon="mdi-magnify"
          class="search-input"
        />
      </v-form>

      <v-btn
        icon="mdi-account-circle-outline"
        variant="text"
        color="white"
        class="ml-2"
        @click="goAccount"
      >
        <v-icon size="28" />
        <v-tooltip activator="parent" location="bottom">
          {{ isAuthenticated ? "Minha conta" : "Entrar" }}
        </v-tooltip>
      </v-btn>

      <v-btn
        icon
        variant="text"
        color="white"
        class="cart-btn"
        :to="'/carrinho'"
      >
        <v-badge
          :model-value="totalItems > 0"
          :content="totalItems"
          color="primary"
          offset-x="-2"
          offset-y="-2"
        >
          <v-icon size="28">mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-app-bar-nav-icon
        class="d-md-none"
        color="white"
        @click="mobileMenu = !mobileMenu"
      />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer
    v-model="mobileMenu"
    location="right"
    temporary
    color="surface"
    width="280"
  >
    <v-list density="comfortable" bg-color="surface">
      <v-list-item
        prepend-icon="mdi-home-outline"
        title="Início"
        to="/"
        @click="mobileMenu = false"
      />
      <v-list-item
        prepend-icon="mdi-car-tire-alert"
        title="Rodas"
        to="/produtos"
        @click="mobileMenu = false"
      />
      <v-list-item
        prepend-icon="mdi-cart-outline"
        title="Carrinho"
        to="/carrinho"
        @click="mobileMenu = false"
      />
      <v-divider class="my-2" />
      <v-list-item
        prepend-icon="mdi-account-circle-outline"
        :title="isAuthenticated ? 'Minha conta' : 'Entrar'"
        @click="
          goAccount();
          mobileMenu = false;
        "
      />
    </v-list>

    <template #append>
      <div class="pa-3">
        <v-form @submit.prevent="submitSearch">
          <v-text-field
            v-model="searchQuery"
            placeholder="Buscar carro..."
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-magnify"
          />
        </v-form>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.cica-header {
  border-bottom: 1px solid var(--cica-border);
}

.logo {
  display: inline-flex;
  align-items: center;
  margin-right: 32px;
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.logo:hover .logo-img {
  opacity: 0.85;
}

.header-nav {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cica-white);
  padding: 6px 0;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: var(--cica-red);
  transform: scaleX(0);
  transition: transform 0.2s ease;
  transform-origin: left;
}

.nav-link:hover {
  color: var(--cica-red);
}

.nav-link.router-link-active::after {
  transform: scaleX(1);
}

.search-form {
  width: 280px;
  max-width: 320px;
}

.search-input :deep(.v-field__field) {
  background-color: var(--cica-black-soft) !important;
}

.cart-btn {
  margin-left: 4px;
}
</style>
