<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import Table from "@/components/Table.vue";
import type { Modal as ModalType } from "@/components/Modal.d";
import type { DataTable } from "@/components/Table";
import { reactive, ref, computed } from "vue";
import dayjs from "dayjs";
import { useToast } from "vue-toastification";

const toast = useToast();

const modalGastoRecorrente = ref(false);
const form = ref<any>(null);

const formGastoRecorrente = reactive({
  id: null as number | null,
  descricao: "",
  valor: null as number | null,
  diaVencimento: null as number | null,
  categoria: "",
  observacao: "",
  ativo: true,
});

const categorias = [
  "Moradia (Aluguel/Financiamento)",
  "Contas (Água, Luz, Gás)",
  "Telefonia/Internet",
  "Streaming (Netflix, Spotify, etc)",
  "Academia/Esportes",
  "Seguros",
  "Transporte (Combustível, Transporte)",
  "Educação (Cursos, Mensalidade)",
  "Assinaturas",
  "Outros",
];

const gastosRecorrentes = ref<any[]>([
  {
    id: 1,
    descricao: "Aluguel",
    valor: 1500.00,
    diaVencimento: 5,
    categoria: "Moradia (Aluguel/Financiamento)",
    ativo: true,
    observacao: "Aluguel apartamento",
  },
  {
    id: 2,
    descricao: "Netflix",
    valor: 55.90,
    diaVencimento: 15,
    categoria: "Streaming (Netflix, Spotify, etc)",
    ativo: true,
    observacao: "Plano Premium",
  },
  {
    id: 3,
    descricao: "Academia",
    valor: 89.90,
    diaVencimento: 10,
    categoria: "Academia/Esportes",
    ativo: false,
    observacao: "Pausado temporariamente",
  },
]);

const gastosAtivos = computed(() => {
  return gastosRecorrentes.value.filter((g) => g.ativo);
});

const gastosInativos = computed(() => {
  return gastosRecorrentes.value.filter((g) => !g.ativo);
});

const totalMensal = computed(() => {
  return gastosAtivos.value.reduce((sum, g) => sum + g.valor, 0);
});

const proximosVencimentos = computed(() => {
  const hoje = dayjs();
  const diaAtual = hoje.date();
  
  return gastosAtivos.value
    .map((gasto) => {
      let dataVencimento = hoje.date(gasto.diaVencimento);
      
      if (gasto.diaVencimento < diaAtual) {
        dataVencimento = dataVencimento.add(1, "month");
      }
      
      const diasRestantes = dataVencimento.diff(hoje, "day");
      
      return {
        ...gasto,
        dataVencimento: dataVencimento.format("YYYY-MM-DD"),
        diasRestantes,
      };
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 5);
});

const optionsModal: ModalType = reactive({
  title: "Novo Gasto Recorrente",
  height: "auto",
  width: 600,
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
      action: salvarGastoRecorrente,
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

const tableOptions: any = reactive({
  headers: [
    { key: "descricao", title: "Descrição", sortable: true },
    { key: "categoria", title: "Categoria", sortable: true, width: 200 },
    { key: "diaVencimento", title: "Dia Venc.", sortable: true, width: 100, align: "center" },
    { key: "valor", title: "Valor", sortable: true, width: 130, align: "end" },
    { key: "ativo", title: "Status", sortable: true, width: 100, align: "center" },
    { key: "actions", title: "Ações", sortable: false, width: 100, align: "center" },
  ],
  items: gastosRecorrentes,
  selecionados: [],
  search: "",
  registrosPorPagina: 20,
});

function abrirModalNovo() {
  Object.assign(formGastoRecorrente, {
    id: null,
    descricao: "",
    valor: null,
    diaVencimento: null,
    categoria: "",
    observacao: "",
    ativo: true,
  });
  optionsModal.title = "Novo Gasto Recorrente";
  modalGastoRecorrente.value = true;
}

function editarGastoRecorrente(item: any) {
  Object.assign(formGastoRecorrente, { ...item });
  optionsModal.title = "Editar Gasto Recorrente";
  modalGastoRecorrente.value = true;
}

function toggleStatus(item: any) {
  const index = gastosRecorrentes.value.findIndex((g) => g.id === item.id);
  if (index !== -1) {
    gastosRecorrentes.value[index].ativo = !gastosRecorrentes.value[index].ativo;
    const status = gastosRecorrentes.value[index].ativo ? "ativado" : "desativado";
    toast.success(`Gasto ${status} com sucesso!`);
  }
}

function excluirGastoRecorrente(item: any) {
  if (confirm(`Deseja realmente excluir "${item.descricao}"?`)) {
    const index = gastosRecorrentes.value.findIndex((g) => g.id === item.id);
    if (index !== -1) {
      gastosRecorrentes.value.splice(index, 1);
      toast.success("Gasto recorrente excluído com sucesso!");
    }
  }
}

async function salvarGastoRecorrente() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  if (formGastoRecorrente.id) {
    const index = gastosRecorrentes.value.findIndex(
      (g) => g.id === formGastoRecorrente.id
    );
    if (index !== -1) {
      gastosRecorrentes.value[index] = { ...formGastoRecorrente };
      toast.success("Gasto recorrente atualizado com sucesso!");
    }
  } else {
    const novoId = Math.max(...gastosRecorrentes.value.map((g) => g.id), 0) + 1;
    gastosRecorrentes.value.push({ ...formGastoRecorrente, id: novoId });
    toast.success("Gasto recorrente cadastrado com sucesso!");
  }

  fecharModal();
}

function fecharModal() {
  modalGastoRecorrente.value = false;
  form.value?.reset();
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(data: string) {
  return dayjs(data).format("DD/MM/YYYY");
}

function getCorStatus(diasRestantes: number) {
  if (diasRestantes <= 3) return "error";
  if (diasRestantes <= 7) return "warning";
  return "success";
}
</script>

<template>
  <v-container fluid class="pa-6">
    <Modal v-model="modalGastoRecorrente" :options="optionsModal">
      <template #content>
        <v-form ref="form" class="pa-4">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formGastoRecorrente.descricao"
                label="Descrição *"
                density="compact"
                variant="outlined"
                :rules="[(v: any) => !!v || 'Descrição é obrigatória']"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formGastoRecorrente.valor"
                label="Valor Mensal *"
                density="compact"
                variant="outlined"
                type="number"
                prefix="R$"
                step="0.01"
                :rules="[(v: any) => !!v || 'Valor é obrigatório']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formGastoRecorrente.diaVencimento"
                label="Dia do Vencimento *"
                density="compact"
                variant="outlined"
                type="number"
                hint="Digite um dia entre 1 e 31"
                persistent-hint
                :rules="[
                  (v: any) => !!v || 'Dia do vencimento é obrigatório',
                  (v: any) => (v >= 1 && v <= 31) || 'Digite um dia entre 1 e 31',
                ]"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="formGastoRecorrente.categoria"
                label="Categoria *"
                density="compact"
                variant="outlined"
                :items="categorias"
                :rules="[(v: any) => !!v || 'Categoria é obrigatória']"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formGastoRecorrente.observacao"
                label="Observação"
                density="compact"
                variant="outlined"
                rows="2"
              />
            </v-col>

            <v-col cols="12">
              <v-switch
                v-model="formGastoRecorrente.ativo"
                label="Ativo"
                color="success"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </Modal>

    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h1 class="text-h5 text-white">Gastos Recorrentes</h1>
          <v-btn
            color="white"
            size="small"
            prepend-icon="mdi-plus"
            @click="abrirModalNovo"
          >
            Novo Gasto Recorrente
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Total Mensal</div>
                <div class="text-h6 text-error">{{ formatarMoeda(totalMensal) }}</div>
              </div>
              <v-icon color="error" size="32">mdi-calendar-month</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Gastos Ativos</div>
                <div class="text-h6 text-white">{{ gastosAtivos.length }}</div>
              </div>
              <v-icon color="success" size="32">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Gastos Inativos</div>
                <div class="text-h6 text-grey">{{ gastosInativos.length }}</div>
              </div>
              <v-icon color="grey" size="32">mdi-pause-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-clock-alert-outline</v-icon>
            Próximos Vencimentos
          </v-card-title>
          <v-card-text>
            <v-list bg-color="transparent" density="compact">
              <v-list-item
                v-for="item in proximosVencimentos"
                :key="item.id"
                class="mb-2"
              >
                <template #prepend>
                  <v-chip
                    :color="getCorStatus(item.diasRestantes)"
                    size="small"
                    variant="flat"
                  >
                    {{ item.diasRestantes }}d
                  </v-chip>
                </template>
                <v-list-item-title class="text-white">
                  {{ item.descricao }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-grey">
                  {{ formatarData(item.dataVencimento) }} - {{ formatarMoeda(item.valor) }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="proximosVencimentos.length === 0">
                <v-list-item-title class="text-grey text-center">
                  Nenhum vencimento próximo
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <Table :options="tableOptions">
              <template #item.diaVencimento="{ item }">
                <v-chip size="small" color="grey-darken-3">
                  Dia {{ item.diaVencimento }}
                </v-chip>
              </template>

              <template #item.valor="{ item }">
                <span class="font-weight-medium text-error">
                  {{ formatarMoeda(item.valor) }}
                </span>
              </template>

              <template #item.ativo="{ item }">
                <v-chip
                  :color="item.ativo ? 'success' : 'grey'"
                  size="small"
                  variant="flat"
                >
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex gap-1 justify-center">
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    :color="item.ativo ? 'warning' : 'success'"
                    @click="toggleStatus(item)"
                  >
                    <v-icon size="18">
                      {{ item.ativo ? 'mdi-pause' : 'mdi-play' }}
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="grey-lighten-1"
                    @click="editarGastoRecorrente(item)"
                  >
                    <v-icon size="18">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="excluirGastoRecorrente(item)"
                  >
                    <v-icon size="18">mdi-delete</v-icon>
                  </v-btn>
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

.dark-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>
