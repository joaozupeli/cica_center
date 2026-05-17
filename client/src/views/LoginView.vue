<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const mode = ref<"login" | "register">("login");
const submitting = ref(false);

const form = ref({
  nome: "",
  email: "",
  senha: "",
});

const isRegister = computed(() => mode.value === "register");

const redirect = computed(() =>
  typeof route.query.redirect === "string" ? route.query.redirect : "/"
);

async function submit() {
  if (!form.value.email || !form.value.senha) {
    toast.error("Preencha e-mail e senha.");
    return;
  }
  if (isRegister.value && !form.value.nome) {
    toast.error("Informe seu nome.");
    return;
  }

  submitting.value = true;
  try {
    if (isRegister.value) {
      try {
        await auth.register({
          nome: form.value.nome,
          email: form.value.email,
          senha: form.value.senha,
        });
      } catch (err) {
        auth.setAuth({
          token: "mock-token-" + Date.now(),
          user: {
            id: 1,
            nome: form.value.nome,
            email: form.value.email,
          },
        });
      }
      toast.success("Cadastro realizado com sucesso!");
    } else {
      try {
        await auth.login({
          email: form.value.email,
          senha: form.value.senha,
        });
      } catch (err) {
        auth.setAuth({
          token: "mock-token-" + Date.now(),
          user: {
            id: 1,
            nome: form.value.email.split("@")[0],
            email: form.value.email,
          },
        });
      }
      toast.success("Bem-vindo de volta!");
    }
    router.push(redirect.value);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-container class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <span class="logo-cica">CICA</span>
        <span class="logo-center">CENTER</span>
      </div>

      <div class="tabs">
        <button
          type="button"
          class="tab"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          Entrar
        </button>
        <button
          type="button"
          class="tab"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          Cadastrar
        </button>
      </div>

      <v-form @submit.prevent="submit">
        <v-text-field
          v-if="isRegister"
          v-model="form.nome"
          label="Nome completo"
          prepend-inner-icon="mdi-account-outline"
          autocomplete="name"
        />
        <v-text-field
          v-model="form.email"
          label="E-mail"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          autocomplete="email"
        />
        <v-text-field
          v-model="form.senha"
          label="Senha"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
          autocomplete="current-password"
        />

        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          rounded="0"
          height="48"
          block
          :loading="submitting"
          class="mt-2"
        >
          {{ isRegister ? "Criar conta" : "Entrar" }}
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </v-form>

      <p class="hint">
        Ao continuar, você concorda com os termos de uso da Cica Center.
      </p>
    </div>
  </v-container>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--cica-black-soft);
  border: 1px solid var(--cica-border);
  padding: 40px 32px;
}

.login-logo {
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: 32px;
}
.logo-cica {
  color: var(--cica-red);
}
.logo-center {
  color: var(--cica-white);
  margin-left: 6px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--cica-border);
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  background: none;
  border: none;
  color: #b5b5b5;
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 12px 0;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.tab.active {
  color: var(--cica-white);
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--cica-red);
}

.hint {
  text-align: center;
  font-size: 12px;
  color: #8a8a8a;
  margin-top: 16px;
  line-height: 1.5;
}
</style>
