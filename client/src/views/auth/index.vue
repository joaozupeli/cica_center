<script lang="ts" setup>
import type { Modal as modalType } from "@/components/Modal.d.ts";
import Modal from "@/components/Modal.vue";
import hashByCrypto from "@/plugins/crypto";
import { mascara } from "@/plugins/maska";
import { useAppStore } from "@/stores/app";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const appStore = useAppStore();
const router = useRouter();
const passwordVisible = ref(false);
const isLoading = ref(false);
const passwordVisibleModal = ref(false);
const newPasswordVisibleModal = ref(false);
const ConfirmNewPasswordVisibleModal = ref(false);
let modalAlterarSenha = ref(false);
const form: any = ref(null);

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
  width: 450,
  fullScreen: false,
  camposObrigatorios: true,
  idsVisibleActions: ["confirmar", "cancelar"],
  actions: [
    {
      id: "confirmar",
      color: "white",
      size: "small",
      class: "mr-2",
      icon: "mdi-check-all",
      text: "Confirmar",
      disabled: false,
      action: handleAlterPassword,
    },
    {
      id: "cancelar",
      color: "grey",
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
              density="compact"
              :rules="[(v: any) => !!v || 'Login é obrigatório']"
              :hide-details="!formModal?.errors?.find((el: any) => el.id == 'loginModal')"
              placeholder="00000-USUARIO"
              variant="outlined"
              @input="handleReplaceLoginUser()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="passwordModal"
              v-model="formLoginModal.password"
              :append-inner-icon="!passwordVisibleModal ? 'mdi-lock' : 'mdi-lock-open-variant-outline'"
              label="Senha Antiga"
              density="compact"
              :rules="[(v: any) => !!v || 'Senha Antiga é obrigatória']"
              :hide-details="!formModal?.errors?.find((el: any) => el.id == 'passwordModal')"
              :type="!passwordVisibleModal ? 'password' : 'text'"
              variant="outlined"
              @click:append-inner="passwordVisibleModal = !passwordVisibleModal"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="newPasswordModal"
              v-model="formLoginModal.newPassword"
              :append-inner-icon="!newPasswordVisibleModal ? 'mdi-lock' : 'mdi-lock-open-variant-outline'"
              label="Nova Senha"
              density="compact"
              :rules="[(v: any) => !!v || 'Nova Senha é obrigatória']"
              :hide-details="!formModal?.errors?.find((el: any) => el.id == 'newPasswordModal')"
              :type="!newPasswordVisibleModal ? 'password' : 'text'"
              variant="outlined"
              @click:append-inner="newPasswordVisibleModal = !newPasswordVisibleModal"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="confirmNewPasswordModal"
              v-model="formLoginModal.confirmNewPassword"
              :append-inner-icon="!ConfirmNewPasswordVisibleModal ? 'mdi-lock' : 'mdi-lock-open-variant-outline'"
              label="Confirme sua Senha"
              density="compact"
              :rules="[(v: any) => !!v || 'Confirmação de Senha é obrigatória']"
              :hide-details="!formModal?.errors?.find((el: any) => el.id == 'confirmNewPasswordModal')"
              :type="!ConfirmNewPasswordVisibleModal ? 'password' : 'text'"
              variant="outlined"
              @click:append-inner="ConfirmNewPasswordVisibleModal = !ConfirmNewPasswordVisibleModal"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </Modal>

  <v-container class="fill-height pa-0 ma-0 login-background" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="11" sm="5" md="4" lg="3" xl="2">
        <div class="login-card">
          <div class="login-header">
            <v-icon size="40" color="white">mdi-cogs</v-icon>
            <h1 class="login-title">zpErp</h1>
            <p class="login-subtitle">Sistema de Gestão</p>
          </div>

          <v-form ref="form" class="login-form" @submit.prevent="handleLogin">
            <div class="input-group">
              <v-text-field
                id="login"
                v-model="formLogin.login"
                v-maska="mascara('T', 250)"
                prepend-inner-icon="mdi-account"
                placeholder="Login"
                variant="outlined"
                density="compact"
                :rules="[(v: any) => !!v || 'Login é obrigatório']"
                hide-details="auto"
                bg-color="grey-darken-4"
              />
            </div>

            <div class="input-group">
              <v-text-field
                id="password"
                v-model="formLogin.password"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                prepend-inner-icon="mdi-lock"
                placeholder="Senha"
                :type="passwordVisible ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                :rules="[(v: any) => !!v || 'Senha é obrigatório']"
                hide-details="auto"
                bg-color="grey-darken-4"
                @click:append-inner="passwordVisible = !passwordVisible"
              />
            </div>

            <v-btn
              :loading="isLoading"
              :disabled="isLoading"
              block
              size="default"
              type="submit"
              class="login-button mt-4"
              elevation="0"
            >
              <v-icon left size="18" class="mr-2">mdi-login-variant</v-icon>
              Entrar
            </v-btn>
          </v-form>

          <div class="login-footer">
            <p class="footer-text">Gestão empresarial</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-background {
  background: #0a0a0a;
  min-height: 100vh;
}

.login-card {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 28px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-top: 12px;
  margin-bottom: 4px;
}

.login-subtitle {
  font-size: 0.75rem;
  color: #666;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-field__input) {
  color: #ffffff !important;
  font-size: 0.875rem;
}

:deep(.v-icon) {
  color: #666 !important;
}

.login-button {
  background: #ffffff !important;
  color: #0a0a0a !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  text-transform: none !important;
  height: 40px !important;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-text {
  font-size: 0.7rem;
  color: #444;
}
</style>
