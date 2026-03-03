<script setup lang="ts">
// #region Import libs
import { validMask } from "@/plugins/maska";
import router from "@/router";
import dayjs from "@/plugins/dayjs";
import * as ExcelJS from "exceljs";
import { computed, onMounted, ref, watch } from "vue";
import { useTheme } from "vuetify";
import DatePicker from "./DatePicker.vue";
import type { DataTable, FilterFunction, HeadersTable } from "./Table";
import { saveAs } from "file-saver";
// #endregion

// #region Declare variables
const propsTable = defineProps<{
  options: DataTable;
}>();

const emit = defineEmits<{
  (e: "campoInputEdit", value: any): void;
  (e: "campoInputEdit:enter", value: any): void;
  (e: "campoInputEdit:input"): void;
}>();

const theme = useTheme();
const isDark = theme.themes.value.light.dark;
const tabela = ref<any>(null);
let tableHeight = ref(0);
const rowsPaginate = ref([10, 15, 20, 50, 100, 500, 1000]);
const selectedExpand: any = ref([]);
const itemsPerPage = ref(propsTable.options?.registrosPorPagina || 100);
let page = ref(1);
let selected = computed({
  get() {
    return propsTable.options.selecionados;
  },
  set(val) {
    propsTable.options.selecionados = val;
  },
});
let search = computed({
  get() {
    return propsTable.options.search?.toUpperCase();
  },
  set(val) {
    propsTable.options.search = val?.toUpperCase();
  },
});
let actions = computed(() => {
  return propsTable.options?.headers?.map((el: any) => el.actions)[0];
});
let headersWithActions = computed(() => {
  return (
    propsTable.options?.headers?.filter(
      (el: any) => el.actions && el.actions.length > 0 && el.key !== "acao"
    ) || []
  );
});
let inputs = computed<HeadersTable[] | undefined>(() => {
  return propsTable.options?.headers?.filter((el: any) => el.input);
});
let origem = computed<HeadersTable[] | undefined>(() => {
  return propsTable.options?.headers?.filter((el: any) => el.origem);
});
let selecionar = computed(() => propsTable.options?.selecionar);
let campoInputEditModoEdicao = computed(
  () => propsTable.options?.campoInputEditModoEdicao
);
let campoInputEditReverse = computed(
  () => propsTable.options?.campoInputEditReverse
);
let campoInputInteiro = computed(() => propsTable.options?.campoInputInteiro);
let casasDecimaisCampoEditInput = computed(
  () => propsTable.options?.casasDecimaisCampoEditInput ?? 3
);
let btnExpandTable = computed(() => propsTable.options.btnExpandTable?.visivel);
let sortable = computed(() => propsTable.options.sortable);
let acaoTable = computed(() => {
  if (btnExpandTable.value) {
    return true;
  } else {
    return false;
  }
});
let semRodape: any = computed(() => propsTable.options.semRodape);
let selecionadosMostrar: any = computed(
  () => propsTable.options.selecionadosMostrar
);
// const fnSearchDefault2: FilterFunction = (value: string, search: string) => {
//   return (
//     value != null && search != null && value.toString().toLocaleUpperCase().indexOf(search) !== -1
//   );
// };
const fnSearchDefault: FilterFunction = (value: string, search: string) => {
  if (!value || !search) return false;

  const escapeRegex = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  // Divide o termo de busca em palavras, remove espaços extras
  const searchWords = search.split(/\s+/).filter(Boolean).map(escapeRegex);

  // Verifica se todas as palavras existem no valor, em qualquer ordem
  return searchWords.every((word) => {
    const regex = new RegExp(word, "i"); // case-insensitive
    return regex.test(value);
  });
};
const moreOptions = ref({ ...propsTable.options?.moreOptions });
const botoesToolbar = ref({ ...propsTable.options?.botoesToolbar });
let moreOptionsVisible = computed(
  () => propsTable.options?.moreOptions?.visible
);
let botoesToolbarVisible = computed(
  () => propsTable.options?.botoesToolbar?.visible
);
const exportarExcelConfig = computed(
  () => propsTable.options?.exportarExcelConfig
);
const filteredItems = computed(() => {
  const items = selectedExpand.value.length
    ? selectedExpand.value
    : propsTable?.options?.items || [];
  if (!search.value) {
    return items;
  }
  const s = search.value.toLowerCase();
  return items.filter((item: any) => {
    return Object.values(item).some((value) => {
      if (value !== null && value !== undefined) {
        return String(value).toLowerCase().includes(s);
      }
      return false;
    });
  });
});
const persistentSortBy = ref([]);
const currentSortBy = computed(() => {
  return persistentSortBy.value.length > 0
    ? persistentSortBy.value
    : propsTable.options?.sortBy;
});
const fnSort = (a: any, b: any) => {
  const isEmpty = (v: any) => v === null || v === undefined || v === "";

  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);

  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;

  const dateA = dayjs(a, detectDateFormat(a));
  const dateB = dayjs(b, detectDateFormat(b));

  if (dateA.isAfter(dateB)) return -1;
  if (dateA.isBefore(dateB)) return 1;

  return 0;
};

const fnSortStatus = (a: any, b: any) => {
  const isEmpty = (v: any) => v === null || v === undefined || v === "";

  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);

  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;

  if (a.text < b.text) return -1;
  if (a.text > b.text) return 1;
  return 0;
};

const fnSortVazio = (a: any, b: any) => {
  const isEmpty = (v: any) => v === null || v === undefined || v === "";

  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);

  // Vazio sempre vai para o final
  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;

  // Se ambos forem strings, compara ignorando maiúsculas/minúsculas
  if (typeof a === "string" && typeof b === "string") {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (aLower < bLower) return -1;
    if (aLower > bLower) return 1;
    return 0; // strings iguais
  }

  // Se ambos forem números, ordena numericamente
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // Para outros tipos ou iguais, mantém a posição relativa
  return 0;
};
// #endregion

// #region Declare functions
async function exportarExcel() {
  if (!exportarExcelConfig.value?.exibir) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    exportarExcelConfig.value.titulo || "Relatório"
  );

  const headers = propsTable.options.headers.filter(
    (h) =>
      h.key !== "acao" &&
      h.key !== "data-table-select" &&
      h.key !== "data-table-expand" &&
      !h.naoExibirExcel
  );

  if (exportarExcelConfig.value.descricao) {
    const descricao =
      typeof exportarExcelConfig.value.descricao === "function"
        ? exportarExcelConfig.value.descricao()
        : exportarExcelConfig.value.descricao;
    const headerRow = sheet.addRow([descricao]);
    const colCount = headers.length;
    sheet.mergeCells(1, 1, 1, colCount);
    headerRow.font = { bold: true, size: 14 };
    headerRow.alignment = { horizontal: "center" };
    sheet.addRow([]);
  }

  sheet.getRow(sheet.actualRowCount + 1).values = headers.map((h) => h.title);
  sheet.getRow(sheet.actualRowCount).font = { bold: true };

  propsTable.options.items.forEach((item) => {
    const itemParaExcel = { ...item };

    if (itemParaExcel.status) {
      itemParaExcel.status = itemParaExcel.status.text;
    }

    const row = [];
    for (const header of headers) {
      row.push(itemParaExcel[header.key]);
    }
    sheet.addRow(row);
  });

  sheet.columns.forEach((column, index) => {
    let maxColumnLength = 0;
    const key = headers[index]?.key;
    if (column.eachCell && key) {
      maxColumnLength = Math.max(
        maxColumnLength,
        headers[index]?.title?.length || 0,
        ...propsTable.options.items.map((item) =>
          item[key] ? String(item[key]).length : 0
        )
      );
    }
    column.width = Math.max(15, Math.min(50, maxColumnLength + 2));
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `${exportarExcelConfig.value.titulo || "relatorio"}-${dayjs().format(
    "YYYY-MM-DD"
  )}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
}

function desabilitarPaginaAnterior() {
  return page.value === 1;
}

function ajustarSortVazio() {
  if (!propsTable?.options?.headers) return;

  propsTable.options.headers.forEach((header: any) => {
    if (header.key === "status") {
      header.sort = fnSortStatus;
    } else if (header.sortable && header.sortableString === "vazio") {
      header.sort = fnSortVazio;
    }
  });
}

function ajustarSort() {
  propsTable?.options?.headers?.forEach((header: any) => {
    if (header.sortable && header.sortableType === "date") {
      header.sort = fnSort;
    }
  });
}

function getBadgeNotifyQuantidade(ac: any, item: any): number {
  if (typeof ac?.badgeNotifyQuantidade === "function") {
    const result = ac.badgeNotifyQuantidade(item);
    // Se retornar uma Promise, retorna 0 temporariamente
    // (a Promise será resolvida em um próximo ciclo de renderização se necessário)
    return typeof result === "number" ? result : 0;
  }
  return ac?.badgeNotifyQuantidade ?? 0;
}

function expandTable(item: any) {
  // semRodape.value = true;
  // noCloneItem usado para não cortar a referencia do objeto do array principal e pode editar quando expandido
  if (propsTable?.options?.btnExpandTable?.noCloneItem) {
    selectedExpand.value = [item];
    propsTable?.options?.btnExpandTable?.actionExpanded
      ? propsTable?.options?.btnExpandTable.actionExpanded(item)
      : "";
  } else {
    const cloneItem = Object.assign({}, item);
    selectedExpand.value = [cloneItem];
    propsTable?.options?.btnExpandTable?.actionExpanded
      ? propsTable?.options?.btnExpandTable.actionExpanded(item)
      : "";
  }
}

function expandUndoTable(item?: any) {
  selectedExpand.value = [];
  // semRodape.value = false;
  propsTable?.options?.btnExpandTable?.actionExpandedUndo
    ? propsTable.options.btnExpandTable.actionExpandedUndo(item)
    : "";
}

function desabilitarPaginaPosterior() {
  return (
    page.value ===
      Math.ceil(
        Number(propsTable?.options?.items.length || 1) / itemsPerPage.value
      ) ||
    Math.ceil(
      Number(propsTable?.options?.items.length || 1) / itemsPerPage.value
    ) === 0
  );
}

function newCalculaTableHeigth() {
  const table: any = tabela.value?.$el;
  if (!table) return;
  let tableHeaderFooterHeight = 0;
  [...table.children].forEach((node) => {
    const nodeRect = node.getBoundingClientRect();

    if (!node.classList.contains("v-table__wrapper")) {
      tableHeaderFooterHeight += nodeRect.height;
    }
  });
  const tableRect = table.getBoundingClientRect();
  const windowHeigh = window.innerHeight;
  tableHeight.value =
    windowHeigh - tableRect.top - 45 - tableHeaderFooterHeight;
}

function formatarMensagem(mensagem: any) {
  if (!mensagem) return "";
  const linhas = mensagem.split("\n");
  const mensagemFormatada = linhas.slice(0, 2);
  if (
    linhas.length > 1 &&
    mensagemFormatada[0].length <= 140 &&
    mensagemFormatada[1].length <= 140 &&
    !mensagem.includes(",")
  ) {
    mensagemFormatada[0] = `${mensagemFormatada[0]}`;
    return (
      mensagemFormatada
        .map((linha: any) => linha.replace(/,/g, "<br>"))
        .join("  ") + " [...]"
    );
  } else if (mensagemFormatada[0].length <= 140 && linhas.length === 1) {
    return `${mensagemFormatada[0].slice(0, 145)}`;
  } else {
    return `${mensagemFormatada[0].slice(0, 145)} [...]`;
  }
}

function abrirLink(obj: any, item: any) {
  const route = router.resolve({
    name: obj.origem.name,
    query: {
      listaSelecaoId: item.listaSelecaoId ? item.listaSelecaoId : undefined,
      ordemCompraId: item.ordemCompraId ? item.ordemCompraId : undefined,
      ordemServicoId: item.ordemServicoId ? item.ordemServicoId : undefined,
      emissaoDevolucaoId: item.emissaoDevolucaoId
        ? item.emissaoDevolucaoId
        : undefined,
      requisicaoId: item.requisicaoId ? item.requisicaoId : undefined,
      requisicaoInternaId: item.requisicaoInternaId
        ? item.requisicaoInternaId
        : undefined,
      preRequisicaoId: item.preRequisicaoId ? item.preRequisicaoId : undefined,
      geracaoEquipamentoId: item.geracaoEquipamentoId
        ? item.geracaoEquipamentoId
        : undefined,
      solicitacaoReparoId: item.solicitacaoReparoId
        ? item.solicitacaoReparoId
        : undefined,
      notaFiscalId: item.notaFiscalId ? item.notaFiscalId : undefined,
      equipamentoCodigo: item.equipamentoCodigo
        ? item.equipamentoCodigo
        : undefined,
    },
  });
  window.open(route.href, "_blank");
}

function loadSortFromStorage() {
  try {
    const savedSort = sessionStorage.getItem(`table-sort-default-table`);
    if (savedSort) {
      persistentSortBy.value = JSON.parse(savedSort);
    }
  } catch (error) {
    console.warn("Erro ao carregar ordenação do sessionStorage:", error);
  }
}

function saveSortToStorage(sortBy: any[]) {
  try {
    sessionStorage.setItem(`table-sort-default-table`, JSON.stringify(sortBy));
  } catch (error) {
    console.warn("Erro ao salvar ordenação no sessionStorage:", error);
  }
}

function handleSortChange(sortBy: any[]) {
  persistentSortBy.value = sortBy as never[];
  saveSortToStorage(sortBy);
}

function detectDateFormat(dateStr: string): string {
  const str = dateStr.trim();

  // ---------- ISO (completo ou parcial) ----------
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?$/.test(str)) {
    return "YYYY-MM-DDTHH:mm:ss.SSSZ";
  }

  // ---------- YYYY-MM-DD ----------
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return "YYYY-MM-DD";
  }

  // ---------- YYYY-MM-DD HH:mm ----------
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(str)) {
    return "YYYY-MM-DD HH:mm";
  }

  // ---------- YYYY-MM-DD HH:mm:ss ----------
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
    return "YYYY-MM-DD HH:mm:ss";
  }

  // ---------- DD/MM/YYYY ----------
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return "DD/MM/YYYY";
  }

  // ---------- DD/MM/YYYY HH:mm ----------
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(str)) {
    return "DD/MM/YYYY HH:mm";
  }

  // ---------- DD/MM/YYYY HH:mm:ss ----------
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(str)) {
    return "DD/MM/YYYY HH:mm:ss";
  }

  // ---------- MM/DD/YYYY (formato americano) ----------
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return "MM/DD/YYYY";
  }

  // ---------- Strings numéricas YYYYMMDD ----------
  if (/^\d{8}$/.test(str)) {
    return "YYYYMMDD";
  }

  // ---------- Último fallback ----------
  return "DD/MM/YYYY";
}

// #endregion

// #region Watch
watch(
  btnExpandTable,
  () => {
    expandUndoTable();
  },
  { deep: true }
);

watch(
  () => propsTable?.options?.items,
  (newItems) => {
    const [selectedExpandItem] = selectedExpand.value;
    if (selectedExpandItem) {
      const atualizado = newItems.find(
        (el) =>
          el[`${propsTable?.options?.itemValue ?? "id"}`] ===
          selectedExpandItem[`${propsTable?.options?.itemValue ?? "id"}`]
      );
      if (atualizado) {
        selectedExpand.value = [atualizado];
        // expandTable(atualizado);
      } else {
        expandUndoTable();
      }
    }
  },
  { immediate: true, deep: true }
);

watch(
  propsTable?.options?.items,
  () => {
    setTimeout(() => {
      newCalculaTableHeigth();
    }, 200);
  },
  { deep: true }
);
// #endregion

// #region Lifecycle hooks
onMounted(() => {
  setTimeout(() => {
    newCalculaTableHeigth();
  }, 100);
});

onMounted(() => {
  if (propsTable.options?.fixOrderBy === true) {
    loadSortFromStorage();
  }
});
ajustarSort();
ajustarSortVazio();
// #endregion
</script>

<template>
  <v-card dense>
    <div v-resize="newCalculaTableHeigth">
      <v-data-table
        ref="tabela"
        v-model="selected"
        v-sortable-table="sortable"
        color="grey"
        density="compact"
        fixed-footer
        fixed-header
        :custom-filter="options?.fnSearch ? options?.fnSearch : fnSearchDefault"
        :search="search"
        :item-value="options?.itemValue ?? 'id'"
        :return-object="options?.returnObject"
        :show-select="selecionar"
        :select-strategy="options?.selectStrategy || 'page'"
        :headers="propsTable?.options?.headers as any"
        :height="
          options?.heightAuto
            ? (selectedExpand.length || propsTable?.options?.items?.length) *
                32 >=
              tableHeight
              ? itemsPerPage * 32 >= tableHeight
                ? tableHeight
                : 'auto'
              : 'auto'
            : options?.height
              ? options?.height
              : 'auto'
        "
        hide-default-footer
        :items="
          selectedExpand.length
            ? selectedExpand
            : propsTable?.options?.items || []
        "
        :items-per-page="itemsPerPage"
        :page="page"
        :sort-by="currentSortBy"
        @update:sort-by="handleSortChange"
        @sorted="sortable?.action($event)"
      >
        <template #item.acao="{ item }">
          <div
            v-if="actions?.length || acaoTable"
            class="text-center mx-2 d-flex justify-center"
          >
            <div v-for="(ac, i) in actions" :key="i">
              <v-btn
                v-if="ac?.visibleAction ? ac?.visibleAction(item) : true"
                :class="ac?.class"
                class="botao-acao-tabela"
                density="comfortable"
                :title="ac?.title"
                :style="ac?.style"
                :disabled="
                  typeof ac?.disabled === 'function'
                    ? ac?.disabled(item)
                    : ac?.disabled
                "
                icon
                :size="ac?.size"
                variant="text"
                @click="ac?.action(item)"
              >
                <v-badge
                  v-if="typeof ac?.badge === 'function' && ac?.badge(item)"
                  :color="ac?.badge(item)"
                  dot
                  location="top end"
                  :model-value="true"
                >
                  <v-icon :color="ac?.color">
                    {{ ac?.icon }}
                  </v-icon>
                </v-badge>
                <template v-else-if="ac?.badgeNotify">
                  <v-badge
                    :color="ac?.badgeNotifyColor"
                    location="top right"
                    offset-x="-3"
                    offset-y="3"
                    base-color="transparent"
                    base-size="x-small"
                    :content="getBadgeNotifyQuantidade(ac, item)"
                    :model-value="getBadgeNotifyQuantidade(ac, item) > 0"
                  >
                    <v-icon :size="ac.size" :color="ac?.color">{{
                      ac?.icon
                    }}</v-icon>
                  </v-badge>
                </template>
                <v-icon v-else :color="ac?.color">
                  {{ ac?.icon }}
                </v-icon>
              </v-btn>
            </div>
            <v-btn
              v-if="btnExpandTable"
              :disabled="
                typeof options?.btnExpandTable?.btnDisabled === 'function'
                  ? options?.btnExpandTable?.btnDisabled(item)
                  : options?.btnExpandTable?.btnDisabled
              "
              density="comfortable"
              :title="
                !selectedExpand.length
                  ? 'Expandir registro'
                  : 'Recolher registro'
              "
              class="botao-acao-tabela"
              icon
              variant="text"
              @click="
                !selectedExpand.length
                  ? expandTable(item)
                  : expandUndoTable(item)
              "
            >
              <v-icon size="20">
                {{
                  !selectedExpand.length ? "mdi-chevron-down" : "mdi-chevron-up"
                }}
              </v-icon>
              <v-badge
                v-if="
                  typeof options?.btnExpandTable?.badge === 'function' &&
                  options?.btnExpandTable?.badge(item)
                "
                :color="options?.btnExpandTable?.badge(item)?.color"
                dot
                location="top right"
                offset-x="-5"
                offset-y="-10"
                :model-value="true"
              />
            </v-btn>
            <v-btn
              v-if="sortable"
              :disabled="sortable?.disabled"
              density="comfortable"
              title="Mover"
              class="botao-acao-tabela sortHandle"
              icon
              style="cursor: move !important"
              variant="text"
            >
              <v-icon :color="sortable?.color || 'primary'" size="20">
                mdi-drag-variant
              </v-icon>
            </v-btn>
          </div>
        </template>
        <template
          v-for="header in headersWithActions"
          :key="`action-${header.key}`"
          #[`item.${header.key}`]="{ item, value }"
        >
          <div class="text-center mx-2 d-flex align-center justify-center">
            <span v-if="value" class="mr-2">{{ value }}</span>
            <div v-for="(ac, i) in header.actions" :key="i">
              <v-btn
                v-if="ac?.visibleAction ? ac?.visibleAction(item) : true"
                :class="ac?.class"
                class="botao-acao-tabela"
                density="comfortable"
                :title="ac?.title"
                :style="ac?.style"
                :disabled="
                  typeof ac?.disabled === 'function'
                    ? ac?.disabled(item)
                    : ac?.disabled
                "
                icon
                :size="ac?.size"
                variant="text"
                @click="ac?.action ? ac.action(item) : undefined"
              >
                <v-badge
                  v-if="typeof ac?.badge === 'function' && ac?.badge(item)"
                  :color="ac?.badge(item)"
                  dot
                  location="top end"
                  :model-value="true"
                >
                  <v-icon :color="ac?.color">
                    {{ ac?.icon }}
                  </v-icon>
                </v-badge>
                <template v-else-if="ac?.badgeNotify">
                  <v-badge
                    :color="ac?.badgeNotifyColor"
                    location="top right"
                    offset-x="-3"
                    offset-y="3"
                    base-color="transparent"
                    base-size="x-small"
                    :content="getBadgeNotifyQuantidade(ac, item)"
                    :model-value="getBadgeNotifyQuantidade(ac, item) > 0"
                  >
                    <v-icon :size="ac.size" :color="ac?.color">{{
                      ac?.icon
                    }}</v-icon>
                  </v-badge>
                </template>
                <v-icon v-else :color="ac?.color">
                  {{ ac?.icon }}
                </v-icon>
              </v-btn>
            </div>
          </div>
        </template>
        <template
          v-for="field in inputs"
          :key="field?.key"
          #[`item.${field.key}`]="{ item, index, value }"
        >
          <div
            class="text-center mx-2 d-flex align-center"
            :class="{
              'justify-center': field?.align === 'center',
              'justify-start': field?.align === 'start',
              'justify-end':
                field?.align !== 'center' && field?.align !== 'start',
            }"
          >
            <DatePicker
              v-if="
                (typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) &&
                field?.input?.datePicker &&
                item
              "
              :ref="`${field.key}${index}`"
              v-model="(item as any)[field.key]"
              :options="{
                hideDetails: true,
                id: 'data',
                variant: 'outlined',
                density: 'compact',
                class: 'input-edit',
                type: 'date',
              }"
              @input="
                (() => {
                  (item as any)[field.key] = $event;
                  field?.input?.action && field.input.action(item);
                })()
              "
            />
            <span
              v-if="
                !(typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) &&
                field?.input?.datePicker &&
                item
              "
              style="
                padding: 0;
                height: 30px;
                font-size: 14px;
                display: flex;
                align-items: center;
                font-weight: 600;
              "
            >
              {{
                (item as any)[field.key]
                  ? dayjs((item as any)[field.key]).format("DD/MM/YYYY")
                  : null
              }}
            </span>
            <v-text-field
              v-if="
                (typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) &&
                field?.input?.VMoeda &&
                item
              "
              :ref="`${field.key}${index}`"
              v-model="(item as any)[field.key]"
              v-moeda="{
                negativo: field?.input?.VMoedaNegativo || false,
                decimal: field?.input?.VMoedaInteiro
                  ? 0
                  : field?.input?.VMoedaCasasDecimais || 2,
              }"
              :reverse="field?.input?.reverse"
              :suffix="field?.input?.sufixo"
              :prefix="field?.input?.prefixo"
              hide-details
              type="text"
              variant="outlined"
              density="compact"
              class="input-edit"
              @click="
                field?.input?.onClickAction
                  ? field.input.onClickAction(item)
                  : ''
              "
              @change="field?.input?.action ? field?.input?.action(item) : ''"
              @keyup.enter="
                ($refs as any)[`${field?.key}${index + 1}`] &&
                ($refs as any)[`${field?.key}${index + 1}`].focus()
              "
            />
            <v-text-field
              v-if="
                (typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) &&
                field?.input?.VMaska &&
                item
              "
              :ref="`${field.key}${index}`"
              v-model="(item as any)[field.key]"
              v-maska="
                field?.input?.mascara && validMask(field?.input?.mascara)
              "
              :reverse="field?.input?.reverse"
              :suffix="field?.input?.sufixo"
              :prefix="field?.input?.prefixo"
              hide-details
              :style="
                field?.input?.width
                  ? `width: ${field?.input?.width} !important`
                  : ''
              "
              type="text"
              variant="outlined"
              density="compact"
              class="input-edit"
              @change="field?.input?.action ? field?.input?.action(item) : ''"
              @keyup.enter="
                ($refs as any)[`${field?.key}${index + 1}`] &&
                ($refs as any)[`${field?.key}${index + 1}`].focus()
              "
            />
            <component
              :is="field?.input?.componenteDinamico"
              v-if="field?.input?.type === 'componente-dinamico' && item"
              :ref="`${field.key}${index}`"
              v-model="(item as any)[field.key]"
              v-bind="
                field?.input?.componenteDinamicoProps &&
                field?.input?.componenteDinamicoProps(item, index, value)
              "
              v-on="
                field?.input?.listeners &&
                Object.entries(field?.input?.listeners).reduce(
                  (acc: any, [key, value]) => {
                    if (acc[key]) {
                      return acc;
                    } else {
                      return {
                        ...acc,
                        [key]: () => value(item),
                      };
                    }
                  },
                  {}
                )
              "
              @update:model-value="
                field?.input?.action ? field.input.action(item) : undefined
              "
              @modal-ativo="
                field?.input?.action ? field.input.action(item) : undefined
              "
            />
            <v-chip
              v-if="field?.input?.type === 'status' && item"
              :color="value?.color ? value?.color : 'primary'"
              :text-color="value?.color === '#FFEB3B' ? '#263238' : 'white'"
              class="v-chip-status"
              small
              density="compact"
            >
              <span class="font-weight-bold">
                {{ value?.text }}
              </span>
            </v-chip>
            <v-progress-linear
              v-if="field?.input?.type === 'progress-bar' && item"
              v-model="(item as any)[field.key]"
              :color="field?.input?.progressoColor?.(item) || 'primary'"
              bg-color="primary"
              :height="field?.input?.progressoHeight || 20"
              reactive
            >
              <strong>{{ Math.floor(value) }}%</strong>
            </v-progress-linear>
            <v-checkbox
              v-if="
                (typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) &&
                field?.input?.VCheckBox &&
                item
              "
              v-model="(item as any)[field.key]"
              density="compact"
              class="input-edit-checkbox"
              color="primary"
              hide-details
              @change="field?.input?.action ? field?.input?.action(item) : ''"
              @keyup.enter="
                ($refs as any)[`${field?.key}${index + 1}`] &&
                ($refs as any)[`${field?.key}${index + 1}`].focus()
              "
            >
              <template #label>
                <span class="input-edit-checkbox">
                  {{ field?.input?.checkBoxLabel }}
                </span>
              </template>
            </v-checkbox>
            <span
              v-if="
                !(typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) &&
                !field?.input?.VCheckBox &&
                !field?.input?.datePicker &&
                !field?.input?.type
              "
              style="
                padding: 0px 0px 0px 0px !important;
                height: 30px !important;
                font-size: 14px !important;
                font-weight: 600;
                display: flex;
                align-items: center;
              "
            >
              {{ field?.input?.prefixo ? field?.input?.prefixo + " " : ""
              }}{{ value
              }}{{ field?.input?.sufixo ? " " + field?.input?.sufixo : "" }}
            </span>
            <span
              v-if="
                !(typeof field?.input?.modoEdicao === 'function'
                  ? field?.input?.modoEdicao(item)
                  : field?.input?.modoEdicao) && field?.input?.VCheckBox
              "
              style="
                padding: 0px 0px 0px 0px !important;
                height: 30px !important;
                font-size: 14px !important;
                font-weight: 600;
                display: flex;
                align-items: center;
              "
            >
              {{ value ? field?.input?.msgTrue : field?.input?.msgFalse }}
            </span>
          </div>
        </template>
        <template
          v-for="field in origem"
          :key="field?.key"
          #[`item.${field.key}`]="{ item, index, value }"
        >
          <div
            v-if="value !== null"
            :ref="`${field.key}${index}`"
            class="text-center mx-2 d-flex align-center"
          >
            <v-btn
              density="comfortable"
              title="Abrir Link"
              class="botao-origem-tabela pl-3 pr-1"
              icon
              variant="text"
              @click="abrirLink(field, item)"
            >
              <v-icon color="secondary" class="mr-2">mdi-redo</v-icon>
            </v-btn>
            <span
              style="
                padding-left: 10px;
                height: 30px;
                font-size: 14px;
                display: flex;
                align-items: center;
                font-weight: 600;
              "
            >
              {{ value }}
            </span>
          </div>
        </template>
        <template #item.campoInputEdit="{ item, index }">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-if="campoInputEditModoEdicao"
                :ref="`campoInputEditRef${index}`"
                v-model="(item as any).campoInputEdit"
                v-moeda="
                  campoInputInteiro
                    ? { negativo: false, decimal: 0 }
                    : { negativo: false, decimal: casasDecimaisCampoEditInput }
                "
                :reverse="campoInputEditReverse"
                hide-details
                type="text"
                variant="outlined"
                density="compact"
                class="shrink input-edit"
                @change="emit('campoInputEdit', item)"
                @keyup.enter="
                  (emit('campoInputEdit:enter', { item, $event }),
                  ($refs as any)[`campoInputEditRef${index + 1}`]
                    ? ($refs as any)[`campoInputEditRef${index + 1}`].focus()
                    : emit('campoInputEdit:input'))
                "
              />
              <span v-if="!campoInputEditModoEdicao">
                {{ (item as any).campoInputEdit }}
              </span>
            </v-col>
          </v-row>
        </template>
        <template #item.icone="{ value }: any">
          <v-icon
            v-if="value && value.icone && String(value.icone).includes('mdi')"
            :color="value && value.color ? value.color : ''"
            :title="value && value.title ? value.title : ''"
            size="25"
          >
            {{ value && value.icone ? value.icone : value }}
            {{ value.icone }}
          </v-icon>
        </template>
        <template #item.personalizado="{ item }: any">
          <span
            :style="`font-weight: 600; color: ${item.personalizado >= 1 || item.personalizado === 'SIM' ? `green` : `red`};`"
          >
            {{ item.personalizado || "" }}
          </span>
        </template>
        <template #item.personalizado1="{ item }: any">
          <span
            :style="`font-weight: 600; color: ${item.personalizado1 >= 1 || item.personalizado1 === 'SIM' ? `green` : `red`};`"
          >
            {{ item.personalizado1 || "" }}
          </span>
        </template>
        <template #no-data>
          <div
            class="d-flex justify-center align-center align-self-center py-4"
          >
            <v-chip
              class="bg-grey-lighten-3 text-primary py-3"
              label
              :size="options?.mensagemSemRegistros ? 'auto' : '210px'"
              width="auto"
            >
              <v-icon left size="24" class="mr-3 ml-4">
                mdi-alert-circle
              </v-icon>
              <span
                v-if="options?.mensagemSemRegistros"
                class="font-weight-medium mr-5"
                >{{ options?.mensagemSemRegistros }}</span
              >
              <span v-else class="text-h6 font-weight-medium mr-5">
                Nenhum Registro!</span
              >
            </v-chip>
          </div>
        </template>
        <template #item.status="{ value }">
          <v-chip
            :color="value?.color ? value?.color : 'primary'"
            :text-color="value?.color === '#FFEB3B' ? '#263238' : 'white'"
            class="v-chip-status chip-status-compact"
            size="x-small"
          >
            <span class="font-weight-bold">
              {{ value?.text }}
            </span>
          </v-chip>
        </template>
        <template #item.prioridadeChip="{ value }">
          <v-chip
            :color="value?.color ? value?.color : 'primary'"
            :text-color="value?.color === '#FFEB3B' ? '#263238' : 'white'"
            class="v-chip-status chip-status-compact"
            size="x-small"
          >
            <span class="font-weight-bold">
              {{ value?.text }}
            </span>
          </v-chip>
        </template>
        <template #item.mensagem="{ item }: any">
          <div class="mensagem">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span
              style="font-weight: 500"
              v-html="formatarMensagem(item?.mensagem)"
            />
          </div>
        </template>
        <template #top>
          <div v-if="propsTable.options.title" class="table-header-modern">
            <div
              class="d-flex align-center justify-space-between px-3"
              style="min-height: 44px"
            >
              <div class="d-flex align-center">
                <v-icon color="#086035" size="18" class="mr-2"
                  >mdi-table</v-icon
                >
                <span class="table-title-modern">{{
                  propsTable.options.title
                }}</span>
              </div>
              <div class="d-flex align-center">
                <slot name="botoes"/>
                <v-btn
                  v-if="exportarExcelConfig?.exibir"
                  color="#217346"
                  variant="flat"
                  prepend-icon="mdi-microsoft-excel"
                  size="small"
                  class="mr-2 text-white"
                  @click="exportarExcel"
                >
                  Exportar Excel
                </v-btn>
                <v-menu
                  v-if="botoesToolbarVisible"
                  :location="botoesToolbar.location || 'bottom'"
                >
                  <template #activator="{ props }">
                    <v-btn
                      class="ml-2"
                      :color="botoesToolbar.color || 'primary'"
                      :size="botoesToolbar.size || 'small'"
                      :variant="botoesToolbar.variant || 'tonal'"
                      v-bind="props"
                    >
                      {{ botoesToolbar.text || "Ações" }}
                      <v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(ac, i) in botoesToolbar.actions"
                      :key="i"
                      :disabled="
                        typeof ac.disabled === 'function'
                          ? ac.disabled()
                          : ac.disabled
                      "
                      @click="ac.action"
                    >
                      <template #prepend>
                        <v-icon :color="ac.color">{{ ac.icon }}</v-icon>
                      </template>
                      <v-list-item-title>{{ ac.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-menu
                  v-if="moreOptionsVisible"
                  :location="moreOptions.location || 'bottom'"
                >
                  <template #activator="{ props }">
                    <v-btn
                      class="ml-2"
                      :color="moreOptions.color"
                      :size="moreOptions.size || 'small'"
                      :variant="moreOptions.variant || 'tonal'"
                      icon
                      v-bind="props"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(ac, i) in moreOptions.actions"
                      :key="i"
                      :disabled="
                        typeof ac.disabled === 'function'
                          ? ac.disabled()
                          : ac.disabled
                      "
                      @click="ac.action"
                    >
                      <template #prepend>
                        <v-icon :color="ac.color">{{ ac.icon }}</v-icon>
                      </template>
                      <v-list-item-title>{{ ac.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
          <div>
            <v-text-field
              v-if="propsTable.options.showSearchField"
              v-model="search"
              label="Pesquisar"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              dense
              hide-details
              single-line
              density="compact"
              class="ma-2"
              placeholder="Digite aqui para pesquisar valores na tabela abaixo"
              clearable
            ></v-text-field>
            <v-divider v-if="$slots.cabecalho" />
            <v-card v-if="$slots.cabecalho" class="pa-2" flat>
              <slot name="cabecalho" />
            </v-card>
            <v-divider v-if="options?.toolBarGrid || options?.title" />
          </div>
        </template>
        <template
          #header.data-table-select="{ allSelected, selectAll, someSelected }"
        >
          <v-checkbox-btn
            v-if="!options?.actionSelecionar"
            :indeterminate="someSelected && !allSelected"
            :model-value="allSelected"
            color="primary"
            density="compact"
            @update:model-value="selectAll(!allSelected)"
          />
        </template>
        <template
          #item.data-table-select="{ internalItem, isSelected, toggleSelect }"
        >
          <v-checkbox-btn
            :model-value="isSelected(internalItem)"
            color="primary"
            density="compact"
            class="input-checkbox-data-table"
            @update:model-value="toggleSelect(internalItem)"
            @click="
              options?.actionSelecionar &&
              options?.actionSelecionar(internalItem, isSelected(internalItem))
            "
          />
        </template>
        <template #bottom>
          <v-divider />
          <v-toolbar
            v-if="!semRodape && !selectedExpand.length"
            flat
            height="30"
            class="py-0 my-0"
            color="white"
          >
            <span class="font-weigth-bold ml-2"
              >Registros:
              <b>{{ moeda.format(filteredItems.length || 0, 0) }}</b></span
            >
            <span v-if="selecionadosMostrar" class="ml-1">
              &nbsp; | &nbsp; Selecionados:
              <b>{{ moeda.format(options?.selecionados?.length || 0, 0) }}</b>
            </span>

            <v-spacer />

            <div class="d-flex flex-row align-center ml-3 mr-2">
              Por página

              <v-select
                v-model="itemsPerPage"
                class="mx-2 pb-3"
                density="compact"
                hide-details
                :items="rowsPaginate"
                variant="underlined"
                width="80"
                @input="page = 1"
              />
              <div class="px-3">
                <v-btn
                  :color="isDark ? '' : 'primary darken-1'"
                  :disabled="desabilitarPaginaAnterior()"
                  icon
                  width="35"
                  @click="page = 1"
                >
                  <v-icon class="mx-0"> mdi-chevron-double-left </v-icon>
                </v-btn>
                <v-btn
                  :color="isDark ? '' : 'primary darken-1'"
                  :disabled="desabilitarPaginaAnterior()"
                  icon
                  width="35"
                  @click="page > 1 ? (page = page - 1) : null"
                >
                  <v-icon class="mx-0"> mdi-chevron-left </v-icon>
                </v-btn>
                <span>
                  {{ page }}&nbsp;-&nbsp;{{
                    Math.ceil(Number(filteredItems.length || 1) / itemsPerPage)
                  }}
                </span>
                <v-btn
                  :color="isDark ? '' : 'primary darken-1'"
                  :disabled="desabilitarPaginaPosterior()"
                  icon
                  width="35"
                  @click="
                    page <
                    Math.ceil(Number(filteredItems.length || 1) / itemsPerPage)
                      ? (page = page + 1)
                      : null
                  "
                >
                  <v-icon class="mx-0"> mdi-chevron-right </v-icon>
                </v-btn>
                <v-btn
                  :color="isDark ? '' : 'primary darken-1'"
                  :disabled="desabilitarPaginaPosterior()"
                  icon
                  width="35"
                  @click="
                    page = Math.ceil(
                      Number(filteredItems.length || 1) / itemsPerPage
                    )
                  "
                >
                  <v-icon class="mx-0"> mdi-chevron-double-right </v-icon>
                </v-btn>
              </div>
            </div>
          </v-toolbar>
        </template>
      </v-data-table>
      <slot name="totais" />
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
/* ========================================
   DESIGN MODERNO E MINIMALISTA - ESTILO PRIMEVUE
   ======================================== */

/* Tabela Principal - Clean e Moderna */
:deep(.v-data-table) {
  line-height: 1.5;
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  white-space: nowrap !important;
  border: 1px solid #e0e0e0;
}

:deep(.v-data-table > .v-data-table__wrapper > table) {
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;
}

/* Header Moderno - Fundo Suave */
:deep(thead) {
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
  border-bottom: 2px solid #e0e0e0;
}

:deep(th) {
  padding: 0px 8px !important;
  height: 32px !important;
  width: auto;
  font-weight: 600 !important;
  color: #424242 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e0e0 !important;
  background: transparent;
}

:deep(th span) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #424242;
}

/* Células - Espaçamento e Tipografia */
:deep(td) {
  padding: 0px 8px !important;
  height: 32px !important;
  font-size: 0.813rem !important;
  font-weight: 500 !important;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif !important;
  color: #424242;
  border-bottom: 1px solid #e8e8e8 !important;
  border-left: none !important;
  border-right: none !important;
  transition: background-color 0.2s ease;
}

/* Linhas - Alternadas com Cor Mais Visível */
:deep(tbody tr) {
  cursor: pointer !important;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

:deep(tbody tr:nth-child(even)) {
  background-color: #f7f7f7;
}

/* Hover Suave e Elegante */
:deep(tbody > tr:hover) {
  background-color: #f0f7f4 !important;
  box-shadow: inset 0 0 0 1px rgba(8, 96, 53, 0.1);
}

/* Linha Selecionada - Verde Suave */
:deep(
  .v-data-table__tr:has(
    .input-checkbox-data-table
      > .v-selection-control__wrapper
      > .v-selection-control__input
      > input[type="checkbox"]:checked
  )
) {
  background: #e8f5e9 !important;
  border-left: 3px solid #086035;
}

/* Última linha sem borda */
:deep(tbody tr:last-child td) {
  border-bottom: none !important;
}

/* Botões de Ação Compactos */
:deep(.botao-acao-tabela) {
  height: 32px !important;
  width: 32px !important;
  border-radius: 6px;
}

:deep(.botao-origem-tabela) {
  height: 32px !important;
  width: 32px !important;
  border-radius: 6px;
}

/* Header Moderno da Tabela - Estilo Card */
.table-header-modern {
  background: linear-gradient(180deg, #fafafa, #f8f8f8);
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 44px;
}

.table-title-modern {
  font-size: 0.75rem;
  font-weight: 600;
  color: #086035;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.mensagem {
  overflow: hidden;
  height: 32px !important;
}

:deep(.v-data-table) {
  white-space: nowrap !important;
}

:deep(.v-chip-status) {
  width: 100%;
  display: flex !important;
  justify-content: center !important;
}

/* Chips de status mais compactos */
:deep(.chip-status-compact) {
  height: 20px !important;
  font-size: 0.688rem !important;
  padding: 0 8px !important;
  border-radius: 10px !important;
}

:deep(.chip-status-compact .v-chip__content) {
  padding: 0 !important;
}

:deep(.chip-status-compact span) {
  font-size: 0.688rem !important;
  font-weight: 600 !important;
}

:deep(
  .input-edit
    > .v-input__control
    > .v-field
    > .v-field__field
    > input.v-field__input[type="text"]
) {
  padding: 0;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  min-height: 0 !important;
  text-align: center;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  --v-field-input-padding-bottom: 0;
}

:deep(
  .input-edit
    > .v-input__control
    > .v-field
    > .v-field__field
    > span.v-text-field__prefix
) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 0 !important;
}

:deep(
  .input-edit
    > .v-input__control
    > .v-field
    > .v-field__field
    > span.v-text-field__suffix
) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 0 !important;
}

:deep(.input-edit-checkbox, .v-checkbox-btn) {
  padding: 0px 0px 0px 0px !important;
  height: 30px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  display: flex !important;
  align-items: center;
  --v-input-control-height: 30px !important;
}

:deep(.input-edit-select > .v-input__control > .v-field) {
  --v-field-input-padding-top: 0;
  --v-field-input-padding-bottom: 0;
}
</style>
