<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const open = computed({
  get: () => auth.authGuard.open,
  set: (v: boolean) => {
    if (!v) auth.closeAuthGuard();
  },
});

function goLogin() {
  const redirectTo = auth.authGuard.redirectTo;
  auth.closeAuthGuard();
  router.push({
    path: "/login",
    query: redirectTo ? { redirect: redirectTo } : {},
  });
}

function cancel() {
  auth.closeAuthGuard();
}
</script>

<template>
  <v-dialog v-model="open" max-width="420" persistent>
    <v-card color="surface" class="auth-card">
      <v-card-text class="pa-6 text-center">
        <v-icon size="56" color="primary" class="mb-3">
          mdi-account-lock-outline
        </v-icon>
        <h3 class="auth-title">Faça login para continuar</h3>
        <p class="auth-message">
          {{
            auth.authGuard.message ||
            "Você precisa estar logado para realizar esta ação."
          }}
        </p>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0 d-flex flex-column ga-2">
        <v-btn
          color="primary"
          variant="flat"
          block
          rounded="0"
          height="44"
          @click="goLogin"
        >
          Entrar / Cadastrar
        </v-btn>
        <v-btn variant="text" block @click="cancel">
          Continuar navegando
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.auth-card {
  border: 1px solid var(--cica-border);
}

.auth-title {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.06em;
  color: var(--cica-white);
  margin: 0 0 8px;
}

.auth-message {
  color: #b5b5b5;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}
</style>
