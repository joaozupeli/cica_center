<script lang="ts" setup>
// #region Import libs
import dayjs from "@/plugins/dayjs";
import { mascara } from "@/plugins/maska.js";
import { useAppStore } from "@/stores/app";
import { computed, nextTick, onMounted, ref, toRaw, watch } from "vue";
import { useTheme } from "vuetify";
import type { DateRange } from "./DateRange";
// #endregion

// #region Declare variables
const propsDateRange = withDefaults(
  defineProps<{
    options: DateRange;
  }>(),
  {},
);

const emit = defineEmits<{
  input: [value: any];
  listar: [];
  change: [];
}>();

const appStore = useAppStore();
const dateRangeModelValue = defineModel<any>({ required: true });
const dataRangeRef = ref<HTMLInputElement | null>(null);
const menuModelValue = ref(false);
const selectedItem = ref("");
let bimestreSelecionado: any = 0;
let trimestreSelecionado: any = 0;
let dataFormatada: any = ref(null);
let date = ref<Date[]>([]);
let datePicker: any = ref(null);
const theme = useTheme();
const isDark = theme.themes.value.light.dark;
let mascaraData = computed(() => {
  return "##/##/#### à ##/##/####";
});
const dateLength = computed(() => {
  return toRaw(String(date).split(",").length);
});
// #endregion

// #region functions declaration
function dataPreDefinida(parametro: any) {
  const data = date.value[0] || [];
  dataFormatada.value = null;
  date.value = [];
  emit("input", {
    dataInicio: null,
    dataFim: null,
  });
  nextTick(() => {
    if (parametro === "ano") {
      setTimeout(() => {
        const ano = dayjs().format("YYYY");
        const dataAno = [
          dayjs(ano, "YYYY").startOf("year").format("YYYY-MM-DD"),
          dayjs(ano, "YYYY").endOf("year").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataAno[0], dataAno[1]);
        datePicker?.value?.yearClick(Number(ano));
      }, 100);
    } else if (parametro === "mesPassado") {
      const dataMesPassado = [
        dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
        dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
      ];
      date.value = dateRange(dataMesPassado[0], dataMesPassado[1]);
    } else if (parametro === "mesAtual") {
      const dataMesAtual = [
        dayjs().startOf("month").format("YYYY-MM-DD"),
        dayjs().endOf("month").format("YYYY-MM-DD"),
      ];
      date.value = dateRange(dataMesAtual[0], dataMesAtual[1]);
    } else if (parametro === "mesQueVem") {
      const dataMesQueVem = [
        dayjs().add(1, "month").startOf("month").format("YYYY-MM-DD"),
        dayjs().add(1, "month").endOf("month").format("YYYY-MM-DD"),
      ];
      date.value = dateRange(dataMesQueVem[0], dataMesQueVem[1]);
    } else if (parametro === "ontem") {
      const dataOntem = [
        dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      ];
      date.value = dateRange(dataOntem[0], dataOntem[1]);
    } else if (parametro === "hoje") {
      const dataHoje = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
      date.value = dateRange(dataHoje[0], dataHoje[1]);
    } else if (parametro === "amanha") {
      const dataAmanha = [
        dayjs().add(1, "day").format("YYYY-MM-DD"),
        dayjs().add(1, "day").format("YYYY-MM-DD"),
      ];
      date.value = dateRange(dataAmanha[0], dataAmanha[1]);
    } else if (parametro === "estaSemana") {
      const dataEstaSemana = [
        dayjs().startOf("week").format("YYYY-MM-DD"),
        dayjs().endOf("week").format("YYYY-MM-DD"),
      ];
      date.value = dateRange(dataEstaSemana[0], dataEstaSemana[1]);
    } else if (parametro === "anoPassado") {
      let ano = null;
      if (toRaw(String(data).split(",").length === 1)) {
        setTimeout(() => {
          ano = dayjs(data).subtract(1, "year").format("YYYY");
          const dataAnoPassado = [
            dayjs(ano, "YYYY").startOf("year").format("YYYY-MM-DD"),
            dayjs(ano, "YYYY").endOf("year").format("YYYY-MM-DD"),
          ];
          date.value = dateRange(dataAnoPassado[0], dataAnoPassado[1]);
        }, 100);
      } else {
        ano = dayjs().subtract(1, "year").format("YYYY");
        const dataAnoPassado = [
          dayjs(ano, "YYYY").startOf("year").format("YYYY-MM-DD"),
          dayjs(ano, "YYYY").endOf("year").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataAnoPassado[0], dataAnoPassado[1]);
      }
      if (datePicker?.value?.internalActivePicker === "DATE")
        datePicker.value.yearClick(Number(ano));
    } else if (parametro === "proximoAno") {
      let ano = null;
      if (toRaw(String(data).split(",").length === 1)) {
        setTimeout(() => {
          ano = dayjs(data).add(1, "year").format("YYYY");
          const dataProximoAno = [
            dayjs(ano, "YYYY").startOf("year").format("YYYY-MM-DD"),
            dayjs(ano, "YYYY").endOf("year").format("YYYY-MM-DD"),
          ];
          date.value = dateRange(dataProximoAno[0], dataProximoAno[1]);
        }, 100);
      } else {
        ano = dayjs().add(1, "year").format("YYYY");
        const dataProximoAno = [
          dayjs(ano, "YYYY").startOf("year").format("YYYY-MM-DD"),
          dayjs(ano, "YYYY").endOf("year").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataProximoAno[0], dataProximoAno[1]);
      }
    } else if (parametro === "bimestre") {
      const ano = dayjs().format("YYYY");
      if (bimestreSelecionado > 6) bimestreSelecionado = 1;
      if (bimestreSelecionado < 1) bimestreSelecionado = 1;
      const enumAuxiliar: any = {
        1: ["01-01", "02"],
        2: ["03-01", "04"],
        3: ["05-01", "06"],
        4: ["07-01", "08"],
        5: ["09-01", "10"],
        6: ["11-01", "12"],
      };
      setTimeout(() => {
        const dataBimestre = [
          dayjs(enumAuxiliar[bimestreSelecionado][0], "MM-DD").format("YYYY-MM-DD"),
          dayjs(enumAuxiliar[bimestreSelecionado][1], "MM").endOf("month").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataBimestre[0], dataBimestre[1]);
        datePicker?.value?.yearClick(Number(ano));
      }, 100);
    } else if (parametro === "trimestre") {
      const ano = dayjs().format("YYYY");
      if (trimestreSelecionado > 4) trimestreSelecionado = 1;
      if (trimestreSelecionado < 1) trimestreSelecionado = 1;
      const enumAuxiliar: any = {
        1: ["01-01", "03"],
        2: ["04-01", "06"],
        3: ["07-01", "09"],
        4: ["10-01", "12"],
      };
      setTimeout(() => {
        const dataTrimestre = [
          dayjs(enumAuxiliar[trimestreSelecionado][0], "MM-DD").format("YYYY-MM-DD"),
          dayjs(enumAuxiliar[trimestreSelecionado][1], "MM").endOf("month").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataTrimestre[0], dataTrimestre[1]);
        datePicker?.value?.yearClick(Number(ano));
      }, 100);
    } else if (parametro === "semestre") {
      const ano = dayjs().format("YYYY");
      setTimeout(() => {
        const dataSemestre = [
          dayjs().startOf("year").format("YYYY-MM-DD"),
          dayjs().startOf("year").add(5, "month").endOf("month").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataSemestre[0], dataSemestre[1]);
        datePicker?.value?.yearClick(Number(ano));
      }, 100);
    } else if (parametro === "semestre2") {
      const ano = dayjs().format("YYYY");
      setTimeout(() => {
        const dataSemestre2 = [
          dayjs("07-01", "MM-DD").format("YYYY-MM-DD"),
          dayjs("07-01", "MM-DD").add(5, "month").endOf("month").format("YYYY-MM-DD"),
        ];
        date.value = dateRange(dataSemestre2[0], dataSemestre2[1]);
        datePicker?.value?.yearClick(Number(ano));
      }, 100);
    }
  });
}

async function confirmarData() {
  menuModelValue.value = false;
  let dataCampo = toRaw(String(date.value).split(","));
  let dateValue = [];
  if (dataCampo[0] !== "") {
    let dataInicio = null;
    if (dataCampo[0]) {
      dataInicio = new Date(dataCampo[0]).toLocaleDateString();
      dateValue.push(new Date(dataCampo[0]));
    } else {
      dataInicio = dayjs().format("DD/MM/YYYY");
      dateValue.push(dayjs().format("DD/MM/YYYY"));
    }
    let dataFim = null;
    let dataCampoFim = dataCampo[dataCampo.length - 1];
    if (dataCampoFim) {
      dataFim = new Date(dataCampoFim).toLocaleDateString();
      dateValue.push(new Date(dataCampoFim));
    } else {
      dataFim = new Date(dataCampo[0]).toLocaleDateString();
      dateValue.push(new Date(dataCampo[0]));
    }
    date.value = dateRange(dateValue[0], dateValue[1]);
    if (dayjs(dataCampo[0]).isAfter(dataCampo[1])) {
      dataFormatada.value = `${dataFim} à ${dataInicio}`;
    } else {
      dataFormatada.value = `${dataInicio} à ${dataFim}`;
    }
  }
}

function changeData() {
  const data = toRaw(String(date.value).split(","));
  if (
    !data &&
    dataFormatada.value &&
    dataFormatada.value.length &&
    [10, 13].includes(dataFormatada.value.length)
  ) {
    date.value = dateRange(data[0], data[0]);
    const dtDigitada = String(dataFormatada.value).substring(0, 10);
    dataFormatada.value = `${dtDigitada} à ${dtDigitada}`;
  } else if (dateLength.value === 1) {
    date.value = dateRange(data[0], data[0]);
    dataFormatada.value = `${dayjs(data[0]).format("DD/MM/YYYY")} à ${dayjs(data[0]).format("DD/MM/YYYY")}`;
  } else if (!dateLength.value) {
    const data = dayjs().format("YYYY-MM-DD");
    date.value = dateRange(data, data);
    dataFormatada.value = `${dayjs().format("DD/MM/YYYY")} à ${dayjs().format("DD/MM/YYYY")}`;
  }
}

function dateRange(startDate: any, endDate: any, steps = 1) {
  const dateArray = [];
  let currentDate = dayjs(startDate);
  let currentDateEnd = dayjs(endDate);
  while (currentDate.isBefore(currentDateEnd) || currentDate.isSame(currentDateEnd)) {
    dateArray.push(currentDate.toDate());
    currentDate = currentDate.add(steps, "day");
  }
  return dateArray;
}

function resetData() {
  dataFormatada.value = null;
  date.value = [];
  bimestreSelecionado = 0;
  trimestreSelecionado = 0;
  selectedItem.value = "";
  emit("input", {
    dataInicio: null,
    dataFim: null,
  });
  if (!propsDateRange.options.disabled) {
    propsDateRange.options.autofocus ?? (menuModelValue.value = true);
  }
  emit("listar");
}

function navegarDentroDoInput(event: any) {
  const keyCode = event.keyCode;
  const elementor = dataRangeRef.value;
  if (!elementor) return;
  let valorScoped = elementor.value;
  const len = valorScoped.length;
  let pos = elementor.selectionStart!;
  let charAt = valorScoped.charAt(pos);
  if (event.type === "click") {
    while (!/\d/.test(charAt) && pos < len) {
      pos++;
      charAt = valorScoped.charAt(pos);
    }
    dataRangeRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
  }
  if (event.type === "click" && event.pointerType === "mouse") return;
  if ([35, 36].indexOf(keyCode) > -1) {
    // 36 - HOME, 25 - END
    pos = keyCode === 36 ? 0 : len;
    dataRangeRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
  } else if ([37, 39].indexOf(keyCode) > -1) {
    if (keyCode === 37) {
      // Direção esquerda
      pos--;
      pos = pos === -1 ? 0 : pos;
    } else if (keyCode === 39) {
      // Direção direira
      pos = pos === len ? len : pos++;
    }
    dataRangeRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
  } else {
    if (keyCode < 48 || keyCode > 57) return;
    if (isNaN(event.key)) return;
    const a =
      (pos > 0 ? valorScoped.substring(0, pos) : "") +
      event.key +
      valorScoped.substring(pos + 1, len);
    pos++;
    dataFormatada.value = a;
    setTimeout(() => {
      if (pos < len) {
        valorScoped = dataRangeRef.value!.querySelector("input")!.value;
        charAt = valorScoped.charAt(pos);
        if (!/\d/.test(charAt)) {
          while (!/\d/.test(charAt) && pos < len) {
            pos++;
            charAt = valorScoped.charAt(pos);
          }
          dataRangeRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
        } else {
          dataRangeRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
        }
      }
    }, 5);
  }
}
// #endregion

// #region Watch
watch(dateRangeModelValue, (valor: any) => {
  if (valor && valor.dataInicio && !valor.dataFim) {
    dataFormatada.value = `${dayjs(valor.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY")} à ${dayjs(valor.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY")}`;
  } else if (valor && valor.dataInicio && valor.dataFim) {
    dataFormatada.value = `${dayjs(valor.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY")} à ${dayjs(valor.dataFim, "YYYY-MM-DD").format("DD/MM/YYYY")}`;
  } else {
    date.value = [];
    dataFormatada.value = null;
  }
});

watch(menuModelValue, (valor: any) => {
  setTimeout(() => {
    if (!valor) confirmarData();
  }, 100);
});

watch(dataFormatada, (valor: any) => {
  if (!valor || !valor.length) {
    resetData();
  }
  const data = toRaw(String(date.value).split(","));
  if (valor && valor.length && [10, 13].includes(valor.length)) {
    const [day, month, year] = String(valor).substring(0, 10).split("/");
    const data = `${year}-${month}-${day}`;
    // Valida mês e dia
    if (Number(day) <= 31 && Number(month) <= 12) {
      date.value = dateRange(data, data);
    } else if (valor && valor.length === 10 && !(Number(day) <= 31 && Number(month) <= 12)) {
      appStore.setNotifySnackBar({
        value: true,
        color: "error",
        icon: "mdi-alert-circle",
        text: "Formato de data inválida",
        timeout: -1,
      });
      dataFormatada.value = null;
    }
  } else if (valor && valor.length === 23) {
    const [day1, month1, year1] = String(valor).substring(0, 10).split("/");
    const data1 = `${year1}-${month1}-${day1}`;
    const [day2, month2, year2] = String(valor).substring(13, 23).split("/");
    const data2 = `${year2}-${month2}-${day2}`;
    // Valida mês e dia
    if (Number(day1) <= 31 && Number(day2) <= 31 && Number(month1) <= 12 && Number(month2) <= 12) {
      // TODO: Emite as datas Completas
      if (dayjs(data1).isAfter(data2)) {
        date.value = dateRange(data2, data1);
        if (
          dateRangeModelValue.value &&
          (dateRangeModelValue.value.dataInicio !== data[0] ||
            dateRangeModelValue.value.dataFim !== data[1])
        ) {
          emit("input", {
            dataInicio: data2 + " 00:00:00",
            dataFim: data1 + " 23:59:00",
          });
          setTimeout(() => {
            emit("listar");
          }, 100);
        } else {
          emit("input", {
            dataInicio: data2 + " 00:00:00",
            dataFim: data1 + " 23:59:00",
          });
        }
      } else {
        date.value = dateRange(data1, data2);
        if (
          dateRangeModelValue.value &&
          (dateRangeModelValue.value.dataInicio !== data[0] ||
            dateRangeModelValue.value.dataFim !== data[1])
        ) {
          emit("input", {
            dataInicio: data1 + " 00:00:00",
            dataFim: data2 + " 23:59:00",
          });
          setTimeout(() => {
            emit("listar");
          }, 100);
        } else {
          emit("input", {
            dataInicio: data1 + " 00:00:00",
            dataFim: data2 + " 23:59:00",
          });
        }
      }
    } else if (
      !(Number(day1) <= 31 && Number(day2) <= 31 && Number(month1) <= 12 && Number(month2) <= 12)
    ) {
      appStore.setNotifySnackBar({
        value: true,
        color: "error",
        icon: "mdi-alert-circle",
        text: "Formato de data inválida",
        timeout: -1,
      });
      dataFormatada.value = null;
    }
  }
});
// #endregion

// #region Lifecycle hooks
onMounted(() => {
  if (
    dateRangeModelValue.value &&
    dateRangeModelValue.value?.dataInicio &&
    !dateRangeModelValue.value?.dataFim
  ) {
    dataFormatada.value = `${dayjs(dateRangeModelValue.value.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY")} à ${dayjs(dateRangeModelValue.value.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY")}`;
  } else if (
    dateRangeModelValue.value &&
    dateRangeModelValue.value?.dataInicio &&
    dateRangeModelValue.value?.dataFim
  ) {
    dataFormatada.value = `${dayjs(dateRangeModelValue.value.dataInicio, "YYYY-MM-DD").format("DD/MM/YYYY")} à ${dayjs(dateRangeModelValue.value.dataFim, "YYYY-MM-DD").format("DD/MM/YYYY")}`;
  }
});
// #endregion
</script>

<template>
  <v-menu
    v-model="menuModelValue"
    :close-on-content-click="false"
    min-width="300px"
    offset-y
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-text-field
        :id="propsDateRange.options?.id"
        ref="dataRangeRef"
        v-model="dataFormatada"
        v-maska="mascara(mascaraData)"
        :autofocus="propsDateRange.options?.autofocus"
        :clearable="propsDateRange.options?.clearable"
        :data-cy="propsDateRange.options?.dataCy || 'periodo'"
        :disabled="propsDateRange.options?.disabled"
        :variant="propsDateRange.options?.variant || 'filled'"
        :label="propsDateRange.options?.label || 'Período'"
        :class="propsDateRange.options?.required ? 'required' : ''"
        :placeholder="propsDateRange.options?.placeHolder || ''"
        :readonly="propsDateRange.options?.readOnly"
        :rounded="propsDateRange.options?.rounded"
        :single-line="propsDateRange.options?.singleLine"
        :density="propsDateRange.options?.density || 'compact'"
        :hide-details="propsDateRange.options?.hideDetails"
        :rules="propsDateRange.options?.rules"
        flat
        v-bind="props"
        @click:clear="resetData()"
        @keydown.enter="
          !dataFormatada ? ((date = [dayjs().toDate()]), changeData()) : confirmarData()
        "
        @dblclick="((date = [dayjs().toDate()]), changeData())"
        @keydown="navegarDentroDoInput"
        @change="
          (!dataFormatada || dataFormatada.length <= 13) &&
          !menuModelValue &&
          propsDateRange.options?.dataDeHojeAutomatica
            ? ((date = [dayjs().toDate()]), changeData())
            : confirmarData()
        "
        @input="emit('change')"
        @click="((menuModelValue = true), navegarDentroDoInput)"
      >
        <template #append-inner>
          <slot name="append" />
          <v-icon
            v-if="!propsDateRange.options.disabled && !dataFormatada"
            size="24"
            density="compact"
            class="px-0 mx-0"
            title="Abrir Date-Range"
            @click="menuModelValue = true"
          >
            mdi-calendar
          </v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card
      flat
      :width="propsDateRange.options.bimestre || propsDateRange.options.trimestre ? '550' : ''"
    >
      <v-row dense>
        <v-col
          v-if="
            !(
              propsDateRange.options.ano &&
              propsDateRange.options?.mesPassado &&
              propsDateRange.options?.mesAtual &&
              propsDateRange.options?.mesQueVem &&
              propsDateRange.options?.ontem &&
              propsDateRange.options?.hoje &&
              propsDateRange.options?.amanha &&
              propsDateRange.options?.estaSemana
            )
          "
        >
          <v-list class="mt-3">
            <span class="ml-4 font-weight-bold text-body-2"> Período </span>
            <div
              style="
                height: 300px !important;
                margin-top: 10px;
                max-height: 300px;
                overflow-y: auto;
                overflow-x: hidden;
              "
            >
              <span class="d-flex flex-wrap">
                <v-btn
                  v-if="propsDateRange.options.ano"
                  :outlined="selectedItem === 'ano'"
                  color="primary"
                  class="justify-start text-overline mb-3 mt-1 ml-2 mr-16"
                  variant="text"
                  size="x-small"
                  @click="(dataPreDefinida('ano'), (selectedItem = 'ano'))"
                  @dblclick="(dataPreDefinida('ano'), (selectedItem = 'ano'), confirmarData())"
                >
                  Ano
                </v-btn>
                <v-btn
                  v-if="propsDateRange.options.ano"
                  color="primary"
                  icon
                  size="x-small"
                  height="25"
                  width="25"
                  class="mr-1"
                  title="Ano anterior"
                  @click="dataPreDefinida('anoPassado')"
                >
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn
                  v-if="propsDateRange.options.ano"
                  color="primary"
                  icon
                  height="25"
                  width="25"
                  size="x-small"
                  title="Próximo ano"
                  @click="dataPreDefinida('proximoAno')"
                >
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
              </span>
              <v-btn
                v-if="propsDateRange.options.mesPassado ?? true"
                :outlined="selectedItem === 'mesPassado'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('mesPassado'), (selectedItem = 'mesPassado'))"
                @dblclick="
                  (dataPreDefinida('mesPassado'), (selectedItem = 'mesPassado'), confirmarData())
                "
              >
                Mês Passado
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.mesAtual ?? true"
                :outlined="selectedItem === 'mesAtual'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('mesAtual'), (selectedItem = 'mesAtual'))"
                @dblclick="
                  (dataPreDefinida('mesAtual'), (selectedItem = 'mesAtual'), confirmarData())
                "
              >
                Mês Atual
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.mesQueVem ?? true"
                :outlined="selectedItem === 'mesQueVem'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('mesQueVem'), (selectedItem = 'mesQueVem'))"
                @dblclick="
                  (dataPreDefinida('mesQueVem'), (selectedItem = 'mesQueVem'), confirmarData())
                "
              >
                Mês Que Vem
              </v-btn>
              <span class="d-flex flex-wrap">
                <v-btn
                  v-if="propsDateRange.options.bimestre"
                  :outlined="selectedItem === 'bimestre'"
                  color="primary"
                  class="justify-start text-overline mb-3 mt-1 ml-2 mr-5"
                  variant="text"
                  size="x-small"
                  @click="
                    (dataPreDefinida('bimestre'),
                    (selectedItem = 'bimestre'),
                    (bimestreSelecionado = 1))
                  "
                >
                  Bimestre
                </v-btn>
                <v-btn
                  v-if="propsDateRange.options.bimestre"
                  color="primary"
                  icon
                  size="x-small"
                  height="25"
                  width="25"
                  class="mr-1"
                  title="Bimestre anterior"
                  @click="
                    ((selectedItem = 'bimestre'),
                    (bimestreSelecionado -= 1),
                    dataPreDefinida('bimestre'))
                  "
                >
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn
                  v-if="propsDateRange.options.bimestre"
                  color="primary"
                  icon
                  height="25"
                  width="25"
                  size="x-small"
                  title="Próximo bimestre"
                  @click="
                    ((selectedItem = 'bimestre'),
                    (bimestreSelecionado += 1),
                    dataPreDefinida('bimestre'))
                  "
                >
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
              </span>
              <span class="d-flex flex-wrap">
                <v-btn
                  v-if="propsDateRange.options.trimestre"
                  :outlined="selectedItem === 'trimestre'"
                  color="primary"
                  class="justify-start text-overline mb-3 mt-1 ml-2 mr-2"
                  variant="text"
                  size="x-small"
                  @click="
                    (dataPreDefinida('trimestre'),
                    (selectedItem = 'trimestre'),
                    (trimestreSelecionado = 1))
                  "
                >
                  Trimestre
                </v-btn>
                <v-btn
                  v-if="propsDateRange.options.trimestre"
                  color="primary"
                  icon
                  size="x-small"
                  height="25"
                  width="25"
                  class="mr-1"
                  title="Trimestre anterior"
                  @click="
                    ((selectedItem = 'trimestre'),
                    (trimestreSelecionado -= 1),
                    dataPreDefinida('trimestre'))
                  "
                >
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn
                  v-if="propsDateRange.options.trimestre"
                  color="primary"
                  icon
                  size="x-small"
                  height="25"
                  width="25"
                  title="Próximo trimestre"
                  @click="
                    ((selectedItem = 'trimestre'),
                    (trimestreSelecionado += 1),
                    dataPreDefinida('trimestre'))
                  "
                >
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
              </span>
              <v-btn
                v-if="propsDateRange.options.semestre"
                :outlined="selectedItem === 'semestre'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('semestre'), (selectedItem = 'semestre'))"
                @dblclick="
                  (dataPreDefinida('semestre'), (selectedItem = 'semestre'), confirmarData())
                "
              >
                1° Semestre
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.semestre2"
                :outlined="selectedItem === 'semestre2'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('semestre2'), (selectedItem = 'semestre2'))"
                @dblclick="
                  (dataPreDefinida('semestre2'), (selectedItem = 'semestre2'), confirmarData())
                "
              >
                2° Semestre
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.ontem ?? true"
                :outlined="selectedItem === 'ontem'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('ontem'), (selectedItem = 'ontem'))"
                @dblclick="(dataPreDefinida('ontem'), (selectedItem = 'ontem'), confirmarData())"
              >
                Ontem
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.hoje ?? true"
                :outlined="selectedItem === 'hoje'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('hoje'), (selectedItem = 'hoje'))"
                @dblclick="(dataPreDefinida('hoje'), (selectedItem = 'hoje'), confirmarData())"
              >
                Hoje
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.amanha ?? true"
                :outlined="selectedItem === 'amanha'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('amanha'), (selectedItem = 'amanha'))"
                @dblclick="(dataPreDefinida('amanha'), (selectedItem = 'amanha'), confirmarData())"
              >
                Amanhã
              </v-btn>
              <v-btn
                v-if="propsDateRange.options.estaSemana ?? true"
                :outlined="selectedItem === 'estaSemana'"
                color="primary"
                class="justify-start text-overline py-3 ml-2 mt-2"
                block
                variant="text"
                size="x-small"
                @click="(dataPreDefinida('estaSemana'), (selectedItem = 'estaSemana'))"
                @dblclick="
                  (dataPreDefinida('estaSemana'), (selectedItem = 'estaSemana'), confirmarData())
                "
              >
                Esta Semana
              </v-btn>
            </div>
          </v-list>
        </v-col>
        <v-divider inset vertical />
        <v-col>
          <span>
            <v-date-picker
              ref="datePicker"
              v-model="date"
              :color="isDark ? '' : 'primary'"
              :max="propsDateRange.options.max"
              :min="propsDateRange.options.min"
              hide-header
              locale="pt"
              multiple="range"
              @input="dateLength > 1 ? confirmarData() : ''"
            />
            <span class="d-flex flex-wrap justify-end my-2 mr-4">
              <v-spacer />
              <v-btn
                :color="isDark ? '' : 'primary'"
                size="small"
                class="mr-2"
                @click="confirmarData()"
              >
                OK
              </v-btn>
              <v-btn color="error" size="small" @click="resetData()"> Limpar </v-btn>
            </span>
          </span>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<style lang="css">
.v-date-picker-month__days {
  column-gap: -3px !important;
}
.v-date-picker-month__day {
  height: 37px !important;
}
.v-date-picker-month {
  height: 265px !important;
}
</style>
