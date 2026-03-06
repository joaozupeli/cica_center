<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import Table from "@/components/Table.vue";
import type { Modal as ModalType } from "@/components/Modal.d";
import { reactive, ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import axios from "@/plugins/axios";

const toast = useToast();

const modalUsuario = ref(false);
const modalResetSenha = ref(false);
const form = ref<any>(null);

const formUsuario = reactive({
  id: null as number | null,
  nome: "",
  login: "",
  perfilId: null as number | null,
});

const usuarioResetSenha = ref<any>(null);
const usuarios = ref<any[]>([]);
const perfis = ref<any[]>([]);

const optionsModal: ModalType = reactive({
  title: "Novo Usuário",
  height: "auto",
  width: 500,
  fullScreen: false,
  camposObrigatorios: true,
  idsVisibleActions: ["salvar", "cancelar"],
  actions: [
    {
      id: "salvar",
      color: "white",
      size: "small",
      icon: "mdi-content-save",
      text: "Salvar",
      disabled: false,
      action: salvarUsuario,
    },
    {
      id: "cancelar",
      color: "grey",
      size: "small",
      icon: "mdi-cancel",
      text: "Cancelar",
      disabled: false,
      action: fecharModal,
    },
  ],
  moreOptions: { visible: false },
});

const optionsModalReset: ModalType = reactive({
  title: "Resetar Senha",
  height: "auto",
  width: 400,
  fullScreen: false,
  camposObrigatorios: false,
  idsVisibleActions: ["confirmar", "cancelar"],
  actions: [
    {
      id: "confirmar",
      color: "error",
      size: "small",
      icon: "mdi-lock-reset",
      text: "Resetar",
      disabled: false,
      action: confirmarResetSenha,
    },
    {
      id: "cancelar",
      color: "grey",
      size: "small",
      icon: "mdi-cancel",
      text: "Cancelar",
      disabled: false,
      action: () => (modalResetSenha.value = false),
    },
  ],
  moreOptions: { visible: false },
});

const tableOptions: any = reactive({
  headers: [
    { key: "nome", title: "Nome", sortable: true },
    { key: "login", title: "Login", sortable: true, width: 180 },
    { key: "perfil.descricao", title: "Perfil", sortable: true, width: 180 },
    { key: "actions", title: "Ações", sortable: false, width: 140, align: "center" },
  ],
  items: usuarios,
  selecionados: [],
  search: "",
  registrosPorPagina: 20,
});

async function buscarUsuarios() {
  try {
    const { data } = await axios.get("usuarios");
    usuarios.value = data;
  } catch {
    //
  }
}

async function buscarPerfis() {
  try {
    const { data } = await axios.get("perfis");
    perfis.value = data;
  } catch {
    //
  }
}

function abrirModalNovo() {
  Object.assign(formUsuario, {
    id: null,
    nome: "",
    login: "",
    perfilId: null,
  });
  optionsModal.title = "Novo Usuário";
  modalUsuario.value = true;
}

function editarUsuario(item: any) {
  Object.assign(formUsuario, {
    id: item.id,
    nome: item.nome,
    login: item.login,
    perfilId: item.perfilId,
  });
  optionsModal.title = "Editar Usuário";
  modalUsuario.value = true;
}

function abrirModalResetSenha(item: any) {
  usuarioResetSenha.value = item;
  modalResetSenha.value = true;
}

async function confirmarResetSenha() {
  try {
    await axios.patch(`usuarios/${usuarioResetSenha.value.id}/resetar-senha`);
    modalResetSenha.value = false;
  } catch {
    //
  }
}

async function salvarUsuario() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    if (formUsuario.id) {
      await axios.put(`usuarios/${formUsuario.id}`, {
        nome: formUsuario.nome,
        login: formUsuario.login,
        perfilId: formUsuario.perfilId,
      });
    } else {
      await axios.post("usuarios", {
        nome: formUsuario.nome,
        login: formUsuario.login,
        perfilId: formUsuario.perfilId,
      });
    }

    fecharModal();
    await buscarUsuarios();
  } catch {
    //
  }
}

async function excluirUsuario(item: any) {
  if (!confirm(`Deseja realmente excluir o usuário "${item.nome}"?`)) return;

  try {
    await axios.delete(`usuarios/${item.id}`);
    await buscarUsuarios();
  } catch {
    //
  }
}

function fecharModal() {
  modalUsuario.value = false;
  form.value?.reset();
}

onMounted(async () => {
  await Promise.all([buscarUsuarios(), buscarPerfis()]);
});
</script>

<template>
  <v-container fluid class="pa-6">
    <Modal v-model="modalUsuario" :options="optionsModal">
      <template #content>
        <v-form ref="form" class="pa-4">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formUsuario.nome"
                label="Nome *"
                density="compact"
                variant="outlined"
                :rules="[(v: any) => !!v || 'Nome é obrigatório']"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formUsuario.login"
                label="Login *"
                density="compact"
                variant="outlined"
                :rules="[(v: any) => !!v || 'Login é obrigatório']"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="formUsuario.perfilId"
                label="Perfil *"
                density="compact"
                variant="outlined"
                :items="perfis"
                item-title="descricao"
                item-value="id"
                :rules="[(v: any) => !!v || 'Perfil é obrigatório']"
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </Modal>

    <Modal v-model="modalResetSenha" :options="optionsModalReset">
      <template #content>
        <div class="pa-4 text-center">
          <v-icon size="48" color="warning" class="mb-3">mdi-alert-circle-outline</v-icon>
          <p class="text-body-2 text-white mb-2">
            Tem certeza que deseja resetar a senha do usuário
            <strong>{{ usuarioResetSenha?.nome }}</strong>?
          </p>
          <p class="text-caption text-grey">
            A senha será redefinida para o padrão do sistema.
          </p>
        </div>
      </template>
    </Modal>

    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <h1 class="text-h5 text-white">Usuários</h1>
            <p class="text-caption text-grey">Gerenciamento de usuários do sistema</p>
          </div>
          <v-btn
            color="white"
            size="small"
            prepend-icon="mdi-plus"
            @click="abrirModalNovo"
          >
            Novo Usuário
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card color="grey-darken-4" elevation="0">
          <v-card-text>
            <Table :options="tableOptions">
              <template #item.perfil.descricao="{ item }">
                <v-chip size="small" color="grey-darken-3">
                  {{ item.perfil?.descricao || '-' }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex gap-1 justify-center">
                  <v-tooltip text="Resetar Senha" location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="x-small"
                        variant="text"
                        color="warning"
                        @click="abrirModalResetSenha(item)"
                      >
                        <v-icon size="18">mdi-lock-reset</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Editar" location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="x-small"
                        variant="text"
                        color="grey-lighten-1"
                        @click="editarUsuario(item)"
                      >
                        <v-icon size="18">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Excluir" location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="x-small"
                        variant="text"
                        color="error"
                        @click="excluirUsuario(item)"
                      >
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>
            </Table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>
