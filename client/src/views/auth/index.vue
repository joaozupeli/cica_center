<script lang="ts" setup>
// #region Import libs

import type { Modal as modalType } from "@/components/Modal.d.ts";
import Modal from "@/components/Modal.vue";
import hashByCrypto from "@/plugins/crypto";
import { mascara } from "@/plugins/maska";
import { useAppStore } from "@/stores/app";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import logoGeral from "@/assets/logogeral.png";
// #endregion

// #region Declare variables
const appStore = useAppStore();
const router = useRouter();
const passwordVisible = ref(false);
const isLoading = ref(false);
const passwordVisibleModal = ref(false);
const newPasswordVisibleModal = ref(false);
const ConfirmNewPasswordVisibleModal = ref(false);
let modalAlterarSenha = ref(false);
const form: any = ref(null);
// #endregion

// #region list | form
const formModal: any = ref(null);
const formLogin: any = reactive({
  login: "",
  password: null,
});
const formLoginModal: any = reactive({
  login: "",
  password: null,
  newPassword: null,
  confirmNewPassword: null,
});

const optionsModal: modalType = reactive({
  title: "Alterar senha de acesso",
  height: "auto",
  width: 500,
  fullScreen: false,
  camposObrigatorios: true,
  idsVisibleActions: ["confirmar", "cancelar"],
  actions: [
    {
      id: "confirmar",
      color: "primary",
      size: "small",
      class: "mr-2",
      icon: "mdi-check-all",
      text: "Confirmar",
      disabled: false,
      action: handleAlterPassword,
    },
    {
      id: "cancelar",
      color: "error",
      size: "small",
      class: "mr-2",
      icon: "mdi-cancel",
      text: "Cancelar",
      disabled: false,
      action: fecharModal,
    },
  ],
  moreOptions: {
    visible: false,
  },
});
// #endregion

// #region Declare functions
async function handleLogin() {
  const { valid } = await form.value.validate();
  if (valid) {
    await appStore.setLoading(true);
    const res = await appStore.login({
      login: formLogin.login ? formLogin.login.toUpperCase() : undefined,
      senha: formLogin.password ? hashByCrypto(formLogin.password) : undefined,
    });
    if (res && !res.erro && res.senhaVencida) {
      modalAlterarSenha.value = true;
      formLoginModal.login = formLogin.login;
    } else if (res && !res.erro && !res.senhaVencida && res.status !== 500) {
      router.push("/");
    } else if (res?.erro) {
      formLogin.password = null;
    }
    await appStore.setLoading(false);
  }
}

async function handleAlterPassword() {
  const { valid } = await form.value.validate();
  if (valid) {
    await appStore.setLoading(true);

    await appStore.setLoading(false);
  }
}

async function handleReplaceLoginUser() {
  if (/^[0-9]+/gm.test(formLogin.login) && formLogin.login.indexOf("-") < 0) {
    formLogin.login =
      formLogin.login && formLogin.login.length
        ? formLogin.login.replace(
            /[a-zA-Z]+/gm,
            `-${formLogin.login.replace(/[^a-zA-Z]+/gm, "").toUpperCase()}`
          )
        : "";
  } else {
    if (formLogin.login && formLogin.login.length) {
      formLogin.login = formLogin.login.toUpperCase();
    }
  }
}

function fecharModal() {
  modalAlterarSenha.value = false;
  formLogin.password = null;
  formLoginModal.password = null;
  formLoginModal.newPassword = null;
  formLoginModal.confirmNewPassword = null;
}
// #endregion
</script>
<template>
  <Modal v-model="modalAlterarSenha" :options="optionsModal">
    <template #content>
      <v-form ref="formModal" class="mt-2 pa-2">
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              id="loginModal"
              v-model="formLogin.login"
              v-maska="mascara('T', 250)"
              append-inner-icon="mdi-account"
              label="Login"
              disabled
              :rules="[(v: any) => !!v || 'Login é obrigatório']"
              :hide-details="
                !formModal?.errors?.find((el: any) => el.id == 'loginModal')
              "
              placeholder="00000-USUARIO"
              variant="outlined"
              @input="handleReplaceLoginUser()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="passwordModal"
              v-model="formLoginModal.password"
              :append-inner-icon="
                !passwordVisibleModal
                  ? 'mdi-lock'
                  : 'mdi-lock-open-variant-outline'
              "
              label="Senha Antiga"
              :rules="[(v: any) => !!v || 'Senha Antiga é obrigatória']"
              :hide-details="
                !formModal?.errors?.find((el: any) => el.id == 'passwordModal')
              "
              :type="!passwordVisibleModal ? 'password' : 'text'"
              variant="outlined"
              @click:append-inner="passwordVisibleModal = !passwordVisibleModal"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="newPasswordModal"
              v-model="formLoginModal.newPassword"
              :append-inner-icon="
                !newPasswordVisibleModal
                  ? 'mdi-lock'
                  : 'mdi-lock-open-variant-outline'
              "
              label="Nova Senha"
              :rules="[(v: any) => !!v || 'Nova Senha é obrigatória']"
              :hide-details="
                !formModal?.errors?.find(
                  (el: any) => el.id == 'newPasswordModal'
                )
              "
              :type="!newPasswordVisibleModal ? 'password' : 'text'"
              variant="outlined"
              @click:append-inner="
                newPasswordVisibleModal = !newPasswordVisibleModal
              "
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="confirmNewPasswordModal"
              v-model="formLoginModal.confirmNewPassword"
              :append-inner-icon="
                !ConfirmNewPasswordVisibleModal
                  ? 'mdi-lock'
                  : 'mdi-lock-open-variant-outline'
              "
              label="Confirme sua Senha"
              :rules="[(v: any) => !!v || 'Confirmação de Senha é obrigatória']"
              :hide-details="
                !formModal?.errors?.find(
                  (el: any) => el.id == 'confirmNewPasswordModal'
                )
              "
              :type="!ConfirmNewPasswordVisibleModal ? 'password' : 'text'"
              variant="outlined"
              @click:append-inner="
                ConfirmNewPasswordVisibleModal = !ConfirmNewPasswordVisibleModal
              "
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </Modal>

  <v-container class="fill-height pa-0 ma-0 light-theme-background" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="10" sm="5" md="4" lg="3" xl="2">
        <v-card class="login-card-light pa-5" elevation="0">
          <div class="text-center mb-4">
            <div class="logo-container mb-2">
              <v-img
                contain
                :src="logoGeral"
                max-width="200"
                height="100"
                class="logo-image mx-auto"
              />
            </div>
            <h1 class="login-title">IG CAMPANHAS</h1>
          </div>

          <v-form ref="form" @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="field-label">Login</label>
              <v-text-field
                id="login"
                v-model="formLogin.login"
                v-maska="mascara('T', 250)"
                prepend-inner-icon="mdi-account-outline"
                placeholder="Digite seu login"
                variant="outlined"
                color="primary"
                density="comfortable"
                :rules="[(v: any) => !!v || 'Login é obrigatório']"
                class="modern-input"
                hide-details="auto"
              />
            </div>

            <div class="mb-4">
              <label class="field-label">Senha</label>
              <v-text-field
                id="password"
                v-model="formLogin.password"
                :append-inner-icon="
                  passwordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                prepend-inner-icon="mdi-lock-outline"
                placeholder="Digite sua senha"
                :type="passwordVisible ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                density="comfortable"
                :rules="[(v: any) => !!v || 'Senha é obrigatório']"
                class="modern-input"
                hide-details="auto"
                @click:append-inner="passwordVisible = !passwordVisible"
              />
            </div>

            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              block
              color="primary"
              size="large"
              type="submit"
              class="login-button"
              elevation="0"
            >
              <v-icon left class="mr-2">mdi-login</v-icon>
              Entrar no Sistema
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.light-theme-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  background-image:
    linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23086035' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  min-height: 100vh;
}

.login-card-light {
  border-radius: 16px !important;
  border: 1px solid rgba(8, 96, 53, 0.08);
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  box-shadow:
    0 20px 60px -10px rgba(8, 96, 53, 0.15),
    0 0 0 1px rgba(8, 96, 53, 0.05) !important;
  animation: fade-in-scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

@keyframes fade-in-scale {
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.logo-image {
  filter: drop-shadow(0 4px 8px rgba(8, 96, 53, 0.15));
}

.login-title {
  font-size: 1.75rem !important;
  font-weight: 700 !important;
  color: rgb(var(--v-theme-primary)) !important;
  font-family: "Montserrat", "Segoe UI", Arial, sans-serif;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(8, 96, 53, 0.1);
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #424242;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

:deep(.modern-input .v-field) {
  border-radius: 10px !important;
  transition: all 0.3s ease;
}

:deep(.modern-input .v-field:hover) {
  box-shadow: 0 2px 8px rgba(8, 96, 53, 0.08);
}

:deep(.modern-input .v-field--focused) {
  box-shadow: 0 4px 12px rgba(8, 96, 53, 0.12);
}

.login-button {
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  letter-spacing: 0.3px;
  text-transform: none !important;
  height: 42px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(8, 96, 53, 0.25) !important;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(8, 96, 53, 0.35) !important;
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(8, 96, 53, 0.2) !important;
}

@media (max-width: 600px) {
  .login-title {
    font-size: 1.5rem !important;
    letter-spacing: 1px;
  }

  .logo-image {
    height: 45px !important;
  }
}
</style>
