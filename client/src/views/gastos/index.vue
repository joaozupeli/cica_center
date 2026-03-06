<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import Table from "@/components/Table.vue";
import DatePicker from "@/components/DatePicker.vue";
import type { Modal as ModalType } from "@/components/Modal.d";
import { reactive, ref, computed } from "vue";
import dayjs from "@/plugins/dayjs";
import { useToast } from "vue-toastification";

const toast = useToast();

const modalGasto = ref(false);
const modalFiltros = ref(false);
const form = ref<any>(null);

const formGasto = reactive({
  id: null as number | null,
  descricao: "",
  valor: null as number | null,
  data: dayjs().format("YYYY-MM-DD"),
  categoria: "",
  tipo: "despesa" as "despesa" | "receita",
  observacao: "",
});

const filtros = reactive({
  dataInicio: dayjs().startOf("month").format("YYYY-MM-DD"),
  dataFim: dayjs().endOf("month").format("YYYY-MM-DD"),
  categoria: "",
  tipo: "" as "" | "despesa" | "receita",
});

const categorias = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Investimentos",
  "Outros",
];

const gastos = ref<any[]>([
  {
    id: 1,
    descricao: "Supermercado",
    valor: 350.50,
    data: "2026-03-01",
    categoria: "Alimentação",
    tipo: "despesa",
    observacao: "Compras do mês",
  },
  {
    id: 2,
    descricao: "Salário",
    valor: 5000.00,
    data: "2026-03-05",
    categoria: "Outros",
    tipo: "receita",
    observacao: "Salário mensal",
  },
]);

const gastosFiltrados = computed(() => {
  return gastos.value.filter((gasto) => {
    const dentroData = dayjs(gasto.data).isBetween(
      filtros.dataInicio,
      filtros.dataFim,
      null,
      "[]"
    );
    const categoriaMatch = !filtros.categoria || gasto.categoria === filtros.categoria;
    const tipoMatch = !filtros.tipo || gasto.tipo === filtros.tipo;
    return dentroData && categoriaMatch && tipoMatch;
  });
});

const totalReceitas = computed(() => {
  return gastosFiltrados.value
    .filter((g) => g.tipo === "receita")
    .reduce((sum, g) => sum + g.valor, 0);
});

const totalDespesas = computed(() => {
  return gastosFiltrados.value
    .filter((g) => g.tipo === "despesa")
    .reduce((sum, g) => sum + g.valor, 0);
});

const saldo = computed(() => totalReceitas.value - totalDespesas.value);

const optionsModal: ModalType = reactive({
  title: "Novo Gasto",
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
      action: salvarGasto,
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

const optionsModalFiltros: ModalType = reactive({
  title: "Filtros",
  height: "auto",
  width: 500,
  fullScreen: false,
  camposObrigatorios: false,
  idsVisibleActions: ["aplicar", "limpar", "cancelar"],
  actions: [
    {
      id: "aplicar",
      color: "white",
      size: "small",
      icon: "mdi-check",
      text: "Aplicar",
      disabled: false,
      action: () => { modalFiltros.value = false; },
    },
    {
      id: "limpar",
      color: "grey",
      size: "small",
      icon: "mdi-broom",
      text: "Limpar",
      disabled: false,
      action: limparFiltros,
    },
    {
      id: "cancelar",
      color: "grey",
      size: "small",
      icon: "mdi-cancel",
      text: "Cancelar",
      disabled: false,
      action: () => { modalFiltros.value = false; },
    },
  ],
  moreOptions: { visible: false },
});

const tableOptions: any = reactive({
  headers: [
    { key: "data", title: "Data", sortable: true, width: 120 },
    { key: "descricao", title: "Descrição", sortable: true },
    { key: "categoria", title: "Categoria", sortable: true, width: 150 },
    { key: "tipo", title: "Tipo", sortable: true, width: 100 },
    { key: "valor", title: "Valor", sortable: true, width: 130, align: "end" },
    { key: "actions", title: "Ações", sortable: false, width: 100, align: "center" },
  ],
  items: gastosFiltrados,
  selecionados: [],
  search: "",
  registrosPorPagina: 20,
});

function abrirModalNovo() {
  Object.assign(formGasto, {
    id: null,
    descricao: "",
    valor: null,
    data: dayjs().format("YYYY-MM-DD"),
    categoria: "",
    tipo: "despesa",
    observacao: "",
  });
  optionsModal.title = "Novo Gasto";
  modalGasto.value = true;
}

function editarGasto(item: any) {
  Object.assign(formGasto, { ...item });
  optionsModal.title = "Editar Gasto";
  modalGasto.value = true;
}

function excluirGasto(item: any) {
  if (confirm(`Deseja realmente excluir "${item.descricao}"?`)) {
    const index = gastos.value.findIndex((g) => g.id === item.id);
    if (index !== -1) {
      gastos.value.splice(index, 1);
      toast.success("Gasto excluído com sucesso!");
    }
  }
}

async function salvarGasto() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  if (formGasto.id) {
    const index = gastos.value.findIndex((g) => g.id === formGasto.id);
    if (index !== -1) {
      gastos.value[index] = { ...formGasto };
      toast.success("Gasto atualizado com sucesso!");
    }
  } else {
    const novoId = Math.max(...gastos.value.map((g) => g.id), 0) + 1;
    gastos.value.push({ ...formGasto, id: novoId });
    toast.success("Gasto cadastrado com sucesso!");
  }

  fecharModal();
}

function fecharModal() {
  modalGasto.value = false;
  form.value?.reset();
}

function limparFiltros() {
  filtros.dataInicio = dayjs().startOf("month").format("YYYY-MM-DD");
  filtros.dataFim = dayjs().endOf("month").format("YYYY-MM-DD");
  filtros.categoria = "";
  filtros.tipo = "";
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
</script>

<template>
  <v-container fluid class="pa-6">
    <Modal v-model="modalGasto" :options="optionsModal">
      <template #content>
        <v-form ref="form" class="pa-4">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formGasto.descricao"
                label="Descrição *"
                density="compact"
                variant="outlined"
                :rules="[(v: any) => !!v || 'Descrição é obrigatória']"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formGasto.valor"
                label="Valor *"
                density="compact"
                variant="outlined"
                type="number"
                prefix="R$"
                step="0.01"
                :rules="[(v: any) => !!v || 'Valor é obrigatório']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <DatePicker
                v-model="formGasto.data"
                :options="{
                  label: 'Data *',
                  hideDetails: false,
                  id: 'data',
                  variant: 'outlined',
                  density: 'compact',
                  class: 'input-edit',
                  type: 'date',
                  rules: [(v: any) => !!v || 'Data é obrigatória'],
                }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formGasto.categoria"
                label="Categoria *"
                density="compact"
                variant="outlined"
                :items="categorias"
                :rules="[(v: any) => !!v || 'Categoria é obrigatória']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formGasto.tipo"
                label="Tipo *"
                density="compact"
                variant="outlined"
                :items="[
                  { title: 'Despesa', value: 'despesa' },
                  { title: 'Receita', value: 'receita' },
                ]"
                :rules="[(v: any) => !!v || 'Tipo é obrigatório']"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formGasto.observacao"
                label="Observação"
                density="compact"
                variant="outlined"
                rows="2"
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </Modal>

    <Modal v-model="modalFiltros" :options="optionsModalFiltros">
      <template #content>
        <v-form class="pa-4">
          <v-row dense>
            <v-col cols="12" md="6">
              <DatePicker
                v-model="filtros.dataInicio"
                :options="{
                  label: 'Data Início',
                  hideDetails: true,
                  id: 'dataInicio',
                  variant: 'outlined',
                  density: 'compact',
                  class: 'input-edit',
                  type: 'date',
                }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <DatePicker
                v-model="filtros.dataFim"
                :options="{
                  label: 'Data Fim',
                  hideDetails: true,
                  id: 'dataFim',
                  variant: 'outlined',
                  density: 'compact',
                  class: 'input-edit',
                  type: 'date',
                }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="filtros.categoria"
                label="Categoria"
                density="compact"
                variant="outlined"
                :items="categorias"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="filtros.tipo"
                label="Tipo"
                density="compact"
                variant="outlined"
                :items="[
                  { title: 'Todos', value: '' },
                  { title: 'Despesa', value: 'despesa' },
                  { title: 'Receita', value: 'receita' },
                ]"
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </Modal>

    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h1 class="text-h5 text-white">Meus Gastos</h1>
          <div class="d-flex gap-2">
            <v-btn
              color="grey-darken-3"
              size="small"
              prepend-icon="mdi-filter"
              @click="modalFiltros = true"
            >
              Filtros
            </v-btn>
            <v-btn
              color="white"
              size="small"
              prepend-icon="mdi-plus"
              @click="abrirModalNovo"
            >
              Novo Gasto
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Receitas</div>
                <div class="text-h6 text-success">{{ formatarMoeda(totalReceitas) }}</div>
              </div>
              <v-icon color="success" size="32">mdi-trending-up</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Despesas</div>
                <div class="text-h6 text-error">{{ formatarMoeda(totalDespesas) }}</div>
              </div>
              <v-icon color="error" size="32">mdi-trending-down</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Saldo</div>
                <div
                  class="text-h6"
                  :class="saldo >= 0 ? 'text-success' : 'text-error'"
                >
                  {{ formatarMoeda(saldo) }}
                </div>
              </div>
              <v-icon
                :color="saldo >= 0 ? 'success' : 'error'"
                size="32"
              >
                {{ saldo >= 0 ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card color="grey-darken-4" variant="flat" class="dark-card">
          <v-card-text>
            <Table :options="tableOptions">
              <template #item.data="{ item }">
                <span class="text-grey-lighten-1">{{ formatarData(item.data) }}</span>
              </template>

              <template #item.tipo="{ item }">
                <v-chip
                  :color="item.tipo === 'receita' ? 'success' : 'error'"
                  size="small"
                  variant="flat"
                >
                  {{ item.tipo === 'receita' ? 'Receita' : 'Despesa' }}
                </v-chip>
              </template>

              <template #item.valor="{ item }">
                <span
                  class="font-weight-medium"
                  :class="item.tipo === 'receita' ? 'text-success' : 'text-error'"
                >
                  {{ formatarMoeda(item.valor) }}
                </span>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex gap-1 justify-center">
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="grey-lighten-1"
                    @click="editarGasto(item)"
                  >
                    <v-icon size="18">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="excluirGasto(item)"
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
.gap-2 {
  gap: 8px;
}

.dark-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px !important;
}
</style>
