<script lang="ts" setup>
// #region Import libs
import dayjs from "@/plugins/dayjs";
import { mascara } from "@/plugins/maska.js";
import { useAppStore } from "@/stores/app";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { computed, onMounted, ref, watch } from "vue";
import { useTheme } from "vuetify";
import type { DatePicker } from "./DatePicker.d.ts";
// #endregion

// #region Declare variables
const propsDatePicker = withDefaults(
  defineProps<{
    options: DatePicker;
  }>(),
  {},
);

const emit = defineEmits<{
  input: [value: any];
  listar: [];
}>();

const value = defineModel<any>({ required: true });
const appStore = useAppStore();
const dataRef = ref<HTMLInputElement | null>(null);
const timePicker = ref<HTMLInputElement | number>();
const picker = ref(false);
const valor = ref("");
const auxHora = ref(null);
const data = ref(new Date());
const horario = ref<string | null>(null);
const theme = useTheme();
const isDark = theme.themes.value.light.dark;
const type = propsDatePicker.options?.type || "date";
const mascaraData = computed(() => {
  let formato;
  switch (type) {
    case "date":
      formato = "##/##/####";
      break;
    case "datetime":
      formato = "##/##/#### ##:##";
      break;
    case "datetimefull":
      formato = "##/##/#### ##:##:##";
      break;
    case "month":
      formato = "##/####";
      break;
    case "dayOfMonth":
      formato = "##/##";
      break;
  }
  return formato;
});
// #endregion

// #region functions declaration
function parseMinMax(value: any) {
  let formatoScoped;
  switch (type) {
    case "date":
      if (dayjs(value, "DD/MM/YYYY").isValid())
        formatoScoped = dayjs(value, "DD/MM/YYYY").format("YYYY-MM-DD");
      else if (dayjs(value, "YYYY-MM-DD").isValid())
        formatoScoped = dayjs(value).format("YYYY-MM-DD");
      break;
    case "datetime":
      if (dayjs(value, "DD/MM/YYYY HH:mm").isValid())
        formatoScoped = dayjs(value, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm");
      else if (dayjs(value, "YYYY-MM-DD HH:mm").isValid())
        formatoScoped = dayjs(value).format("YYYY-MM-DD HH:mm");
      break;
    case "datetimefull":
      if (dayjs(value, "DD/MM/YYYY HH:mm:ss").isValid())
        formatoScoped = dayjs(value, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm:ss");
      else if (dayjs(value, "YYYY-MM-DD HH:mm:ss").isValid())
        formatoScoped = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      break;
    case "month":
      if (dayjs(value, "MM/YYYY").isValid())
        formatoScoped = dayjs(value, "MM/YYYY").format("YYYY-MM");
      else if (dayjs(value, "YYYY-MM").isValid()) formatoScoped = dayjs(value).format("YYYY-MM");
      break;
    case "dayOfMonth":
      if (dayjs(value, "DD/MM").isValid()) formatoScoped = dayjs(value, "DD/MM").format("MM-DD");
      else if (dayjs(value, "MM-DD").isValid())
        formatoScoped = dayjs(value, "MM-DD").format("MM-DD");
      break;
  }
  return formatoScoped;
}

function resetData() {
  emit("input", null);
  emit("listar");
  valor.value = "";
  data.value = new Date();
  horario.value = null;
}

function inputDateToday() {
  let today;
  switch (type) {
    case "date":
      today = dayjs().format("YYYY-MM-DD");
      emit("input", today);
      emit("listar");
      valor.value = dayjs(today).format("DD/MM/YYYY");
      data.value = new Date();
      picker.value = false;
      break;
    case "datetime":
      today = dayjs().format("YYYY-MM-DD HH:mm");
      emit("input", today);
      emit("listar");
      valor.value = dayjs(today).format("DD/MM/YYYY HH:mm");
      data.value = new Date();
      picker.value = false;
      break;
    case "datetimefull":
      today = dayjs().format("YYYY-MM-DD HH:mm:ss");
      emit("input", today);
      emit("listar");
      valor.value = dayjs(today).format("DD/MM/YYYY HH:mm:ss");
      data.value = new Date();
      picker.value = false;
      break;
  }
}

function validarTextField() {
  dayjs.extend(customParseFormat);
  const regexValidarData =
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  if (!valor.value || valor.value.length === 0) {
    emitirErro("Insira uma data");
    resetData();
    return;
  }
  if (type === "date") {
    if (!valor.value.match(regexValidarData) || !valor.value) {
      emitirErro("Data inválida");
      resetData();
      return;
    }
    const dataInput = dayjs(valor.value, "DD/MM/YYYY");
    if (propsDatePicker.options?.min) {
      const min = dayjs(parseMinMax(propsDatePicker.options?.min));
      if (dataInput.isBefore(min)) {
        emitirErro("A data inserida é mais antiga que a data mínima");
        resetData();
        return;
      }
    }
    if (propsDatePicker.options?.max) {
      const max = dayjs(parseMinMax(propsDatePicker.options?.max));
      if (dataInput.isAfter(max)) {
        emitirErro("A data inserida vai além da data máxima");
        resetData();
        return;
      }
    }
    emit("input", dayjs(valor.value, "DD/MM/YYYY").format("YYYY-MM-DD"));
    emit("listar");
    picker.value = false;
    data.value = new Date(dayjs(valor.value, "DD/MM/YYYY").add(1, "day").format("YYYY-MM-DD"));
  }
  if (type === "dayOfMonth") {
    const dia = parseInt(valor.value.slice(0, 2));
    const mes = parseInt(valor.value.slice(3, 5));
    if (dia > 31) {
      emitirErro("Data inválida");
      resetData();
      return;
    }
    if (mes > 12) {
      emitirErro("Data inválida");
      resetData();
      return;
    }
    if (dia > 29 && mes === 2) {
      emitirErro("Data inválida");
      resetData();
      return;
    }
    if (dia > 30 && (mes === 4 || mes === 6 || mes === 7 || mes === 11)) {
      emitirErro("Data inválida");
      resetData();
      return;
    }
    const dataInput = dayjs(valor.value, "DD/MM");
    if (propsDatePicker.options?.max) {
      const dataMax = dayjs(parseMinMax(propsDatePicker.options?.max));
      if (dataInput.isAfter(dataMax)) {
        emitirErro("A data inserida vai além da data máxima");
        resetData();
        return;
      }
    }
    if (propsDatePicker.options?.min) {
      const dataMin = dayjs(parseMinMax(propsDatePicker.options?.min));
      if (dataInput.isBefore(dataMin)) {
        emitirErro("A data inserida é mais antiga que a data mínima");
        resetData();
        return;
      }
    }
    emit("input", dayjs(valor.value, "DD/MM").format("MM-DD"));
    emit("listar");
    picker.value = false;
  }
  if (type === "datetime") {
    const dataInput = dayjs(valor.value, "DD/MM/YYYY HH:mm");
    const regexValidarHoras = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const data = valor?.value?.slice(0, 10) || "";
    const hora = valor.value.slice(11, 16);
    if (!data.match(regexValidarData)) {
      emitirErro("Data inválida 6");
      resetData();
      return;
    }
    if (!hora.match(regexValidarHoras)) {
      emitirErro("Hora inválida");
      resetData();
      return;
    }
    if (propsDatePicker.options?.min) {
      const min = dayjs(parseMinMax(propsDatePicker.options?.min));
      if (dataInput.isBefore(min)) {
        emitirErro("A data inserida é mais antiga que a data mínima");
        resetData();
        return;
      }
    }
    if (propsDatePicker.options?.max) {
      const max = dayjs(parseMinMax(propsDatePicker.options?.max));
      if (dataInput.isAfter(max)) {
        emitirErro("A data inserida vai além da data máxima");
        resetData();
        return;
      }
    }
    emit("input", dayjs(valor.value, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm"));
    emit("listar");
    picker.value = false;
  }
  if (type === "datetimefull") {
    const dataInput = dayjs(valor.value, "DD/MM/YYYY HH:mm:ss");
    const regexValidarHoras = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const data = valor?.value?.slice(0, 10) || "";
    const hora = valor.value.slice(11, 16);
    if (!data.match(regexValidarData)) {
      emitirErro("Data inválida");
      resetData();
      return;
    }
    if (!hora.match(regexValidarHoras)) {
      emitirErro("Hora inválida");
      resetData();
      return;
    }
    if (propsDatePicker.options?.min) {
      const min = dayjs(parseMinMax(propsDatePicker.options?.min));
      if (dataInput.isBefore(min)) {
        emitirErro("A data inserida é mais antiga que a data mínima");
        resetData();
        return;
      }
    }
    if (propsDatePicker.options?.max) {
      const max = dayjs(parseMinMax(propsDatePicker.options?.max));
      if (dataInput.isAfter(max)) {
        emitirErro("A data inserida vai além da data máxima");
        resetData();
        return;
      }
    }
    emit("input", dayjs(valor.value, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
    emit("listar");
    picker.value = false;
  }
  if (type === "month") {
    const dataInput = dayjs(valor.value, "MM/YYYY");
    const mes = parseInt(valor.value.slice(0, 2));
    const ano = valor.value.slice(3, 8);
    if (mes > 12 || mes < 1) {
      emitirErro("Data inválida 7");
      resetData();
      return;
    }
    // para caso a máscara falhe
    if (ano.length > 4 || ano.length < 4) {
      emitirErro("Data inválida 8");
      resetData();
      return;
    }
    if (propsDatePicker.options?.min) {
      const min = dayjs(parseMinMax(propsDatePicker.options?.min));
      if (dataInput.isBefore(min)) {
        emitirErro("A data inserida é mais antiga que a data mínima");
        resetData();
        return;
      }
    }
    if (propsDatePicker.options?.max) {
      const max = dayjs(parseMinMax(propsDatePicker.options?.max));
      if (dataInput.isAfter(max)) {
        emitirErro("A data inserida vai além da data máxima");
        resetData();
        return;
      }
    }
    emit("input", dayjs(valor.value, "MM/YYYY").format("YYYY-MM"));
    emit("listar");
    picker.value = false;
  }
}

function handleInput(data: any) {
  auxHora.value = data;
  horario.value = null;
}

function inputDataPicker() {
  const dataScoped = dayjs(data.value).format("DD/MM/YYYY");
  switch (type) {
    case "date":
      valor.value = dataScoped;
      emit("input", dayjs(dataScoped).format("YYYY-MM-DD"));
      emit("listar");
      picker.value = false;
      break;
    case "datetime": {
      let horaMinute;
      if (horario.value) {
        horaMinute = horario.value.split(":");
      }
      if (horaMinute && horaMinute.length === 2) {
        const hour = parseInt(horaMinute[0], 10);
        const minute = parseInt(horaMinute[1], 10);
        const d = dayjs(data.value).set("hour", hour).set("minute", minute);

        valor.value = "";

        valor.value = d.format("DD/MM/YYYY HH:mm");
        emit("input", dayjs(d).format("YYYY-MM-DD HH:mm"));
        emit("listar");
        picker.value = false;
      }
      break;
    }
    case "datetimefull": {
      let horaMinuteSecond;
      if (horario.value) {
        horaMinuteSecond = horario.value.split(":");
      }
      if (horaMinuteSecond && horaMinuteSecond.length === 2) {
        const hour = parseInt(horaMinuteSecond[0], 10);
        const minute = parseInt(horaMinuteSecond[1], 10);
        const d = dayjs(data.value).set("hour", hour).set("minute", minute).set("second", 0o0);

        valor.value = "";

        valor.value = d.format("DD/MM/YYYY HH:mm:ss");
        emit("input", dayjs(d).format("YYYY-MM-DD HH:mm:ss"));
        emit("listar");
        picker.value = false;
      }
      break;
    }
    case "month":
      valor.value = dayjs(data.value).format("MM/YYYY");
      emit("input", dayjs(data.value).format("YYYY-MM"));
      emit("listar");
      picker.value = false;
      break;
    case "dayOfMonth":
      valor.value = dayjs(data.value, "YYYY-MM-DD").format("DD/MM");
      emit("input", dayjs(data.value, "YYYY-MM-DD").format("MM-DD"));
      emit("listar");
      picker.value = false;
      break;
  }
}

function navegarDentroDoInput(event: any) {
  const keyCode = event.keyCode;
  const elementor = dataRef.value;
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
    dataRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
  }
  if (event.type === "click" && event.pointerType === "mouse") return;
  if ([35, 36].indexOf(keyCode) > -1) {
    // 36 - HOME, 25 - END
    pos = keyCode === 36 ? 0 : len;
    dataRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
  } else if ([37, 39].indexOf(keyCode) > -1) {
    if (keyCode === 37) {
      // Direção esquerda
      pos--;
      pos = pos === -1 ? 0 : pos;
    } else if (keyCode === 39) {
      // Direção direira
      pos = pos === len ? len : pos++;
    }
    dataRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
  } else {
    if (keyCode < 48 || keyCode > 57) return;
    if (isNaN(event.key)) return;
    const a =
      (pos > 0 ? valorScoped.substring(0, pos) : "") +
      event.key +
      valorScoped.substring(pos + 1, len);
    pos++;
    valor.value = a;
    setTimeout(() => {
      if (pos < len) {
        valorScoped = dataRef.value!.querySelector("input")!.value;
        charAt = valorScoped.charAt(pos);
        if (!/\d/.test(charAt)) {
          while (!/\d/.test(charAt) && pos < len) {
            pos++;
            charAt = valorScoped.charAt(pos);
          }
          dataRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
        } else {
          dataRef.value!.querySelector("input")!.setSelectionRange(pos, pos);
        }
      }
    }, 5);
  }
}

function diminuirDia() {
  dayjs.extend(customParseFormat);
  if (type === "date") {
    let data: any = dayjs(valor.value, "DD/MM/YYYY").subtract(1, "day");
    valor.value = dayjs(data).format("DD/MM/YYYY");
    emit("input", data.format("YYYY-MM-DD"));
    emit("listar");
    const min = dayjs(propsDatePicker.options?.min, "DD/MM/YYYY");
    if (propsDatePicker.options?.min && data.isBefore(min)) {
      emitirErro("A data inserida é mais antiga que a data mínima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
  if (type === "datetime") {
    let data: any = dayjs(valor.value, "DD/MM/YYYY HH:mm").subtract(1, "day");
    valor.value = dayjs(data).format("DD/MM/YYYY HH:mm");
    emit("input", data.format("YYYY-MM-DD HH:mm"));
    emit("listar");
    const min = dayjs(propsDatePicker.options?.min, "DD/MM/YYYY HH:mm");
    if (propsDatePicker.options?.min && data.isBefore(min)) {
      emitirErro("A data inserida é mais antiga que a data mínima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
  if (type === "datetimefull") {
    let data: any = dayjs(valor.value, "DD/MM/YYYY HH:mm:ss").subtract(1, "day");
    valor.value = dayjs(data).format("DD/MM/YYYY HH:mm:ss");
    emit("input", data.format("YYYY-MM-DD HH:mm:ss"));
    emit("listar");
    const min = dayjs(propsDatePicker.options?.min, "DD/MM/YYYY HH:mm:ss");
    if (propsDatePicker.options?.min && data.isBefore(min)) {
      emitirErro("A data inserida é mais antiga que a data mínima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
  if (type === "dayOfMonth") {
    let data: any = dayjs(valor.value, "DD/MM").subtract(1, "day");
    valor.value = dayjs(data).format("DD/MM");
    emit("input", data.format("MM-DD"));
    emit("listar");
    const min = dayjs(propsDatePicker.options?.min, "DD/MM");
    if (propsDatePicker.options?.min && data.isBefore(min)) {
      emitirErro("A data inserida é mais antiga que a data mínima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
}

function aumentarDia() {
  dayjs.extend(customParseFormat);
  if (type === "date") {
    let data: any = dayjs(valor.value, "DD/MM/YYYY").add(1, "day");
    valor.value = dayjs(data).format("DD/MM/YYYY");
    emit("input", data.format("YYYY-MM-DD"));
    emit("listar");
    const max = dayjs(propsDatePicker.options?.max || "", "DD/MM/YYYY");
    if (propsDatePicker.options?.max && data.isAfter(max)) {
      emitirErro("A data inserida vai além da data máxima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
  if (type === "datetime") {
    let data: any = dayjs(valor.value, "DD/MM/YYYY HH:mm").add(1, "day");
    valor.value = dayjs(data).format("DD/MM/YYYY HH:mm");
    emit("input", data.format("YYYY-MM-DD HH:mm"));
    emit("listar");
    const max = dayjs(propsDatePicker.options?.max || "", "DD/MM/YYYY HH:mm");
    if (propsDatePicker.options?.max && data.isAfter(max)) {
      emitirErro("A data inserida vai além da data máxima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
  if (type === "datetimefull") {
    let data: any = dayjs(valor.value, "DD/MM/YYYY HH:mm:ss").add(1, "day");
    valor.value = dayjs(data).format("DD/MM/YYYY HH:mm:ss");
    emit("input", data.format("YYYY-MM-DD HH:mm:ss"));
    emit("listar");
    const max = dayjs(propsDatePicker.options?.max || "", "DD/MM/YYYY HH:mm:ss");
    if (propsDatePicker.options?.max && data.isAfter(max)) {
      emitirErro("A data inserida vai além da data máxima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
  if (type === "dayOfMonth") {
    let data: any = dayjs(valor.value, "DD/MM").add(1, "day");
    valor.value = dayjs(data).format("DD/MM");
    emit("input", data.format("MM-DD"));
    emit("listar");
    const max = dayjs(propsDatePicker.options?.max || "", "DD/MM");
    if (propsDatePicker.options?.max && data.isAfter(max)) {
      emitirErro("A data inserida vai além da data máxima");
      data = null;
      emit("input", "");
      emit("listar");
      resetData();
      return;
    }
  }
}

function autocomplete() {
  const dataDigitada = String(valor.value).split("/");
  const dia = dataDigitada[0] ? String(dataDigitada[0]).padStart(2, "0") : null;
  const mes = dataDigitada[1] ? String(dataDigitada[1]).padStart(2, "0") : null;
  const ano = dataDigitada[2] ? String(dataDigitada[2]).padEnd(4, "0") : null;
  if (type === "date") {
    if (!valor.value || !valor.value.length) valor.value = dayjs().format("DD/MM/YYYY");
    else if (dia && mes && ano)
      valor.value = dayjs(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format("DD/MM/YYYY");
    else if (dia && mes) valor.value = dayjs(`${dia}-${mes}`, "DD-MM").format("DD/MM/YYYY");
    else if (dia) valor.value = dayjs(dia, "DD").format("DD/MM/YYYY");
  }
  if (type === "month") {
    if (!valor.value || !valor.value.length) valor.value = dayjs().format("MM/YYYY");
    else if (dia && mes && ano)
      valor.value = dayjs(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format("MM/YYYY");
    else if (dia && mes) valor.value = dayjs(`${dia}-${mes}`, "DD-MM").format("MM/YYYY");
    else if (dia) valor.value = dayjs(dia, "DD").format("MM/YYYY");
  }
  if (type === "datetime") {
    if (!valor.value || !valor.value.length) valor.value = dayjs().format("DD/MM/YYYY HH:mm");
    else if (dia && mes && ano)
      valor.value = dayjs(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format("DD/MM/YYYY HH:mm");
    else if (dia && mes) valor.value = dayjs(`${dia}-${mes}`, "DD-MM").format("DD/MM/YYYY HH:mm");
    else if (dia) valor.value = dayjs(dia, "DD").format("DD/MM/YYYY HH:mm");
  }
  if (type === "datetimefull") {
    if (!valor.value || !valor.value.length) valor.value = dayjs().format("DD/MM/YYYY HH:mm:ss");
    else if (dia && mes && ano)
      valor.value = dayjs(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format("DD/MM/YYYY HH:mm:ss");
    else if (dia && mes)
      valor.value = dayjs(`${dia}-${mes}`, "DD-MM").format("DD/MM/YYYY HH:mm:ss");
    else if (dia) valor.value = dayjs(dia, "DD").format("DD/MM/YYYY HH:mm:ss");
  }
  if (type === "dayOfMonth") {
    if (!valor.value || !valor.value.length) valor.value = dayjs().format("DD/MM");
    if (dia && mes && ano)
      valor.value = dayjs(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format("DD/MM");
    if (dia && mes) valor.value = dayjs(`${dia}-${mes}`, "DD-MM").format("DD/MM");
    if (dia) valor.value = dayjs(dia, "DD").format("DD/MM");
  }
}

function validateDateFormatoAMericano(date: string): boolean {
  // Expressão regular para validar o formato Americano, desconsiderando ano válido
  const regex =
    /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])T([0-1][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9]).([0-9][0-9][0-9])Z$/;
  const match = date.match(regex);
  if (!match) {
    return false; // Formato inválido
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, year, month, day] = match.map(Number);
  // Verifique o número de dias baseado no mês
  if (month === 2) {
    if (day < 1 || day > 29) {
      // Fevereiro pode ter no máximo 29 dias
      return false;
    }
    // Verifique se é um ano bissexto para permitir o dia 29
    if (day === 29) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
  } else if ([4, 6, 9, 11].includes(month)) {
    // Meses com 30 dias
    if (day < 1 || day > 30) {
      return false;
    }
  } else {
    // Meses com 31 dias
    if (day < 1 || day > 31) {
      return false;
    }
  }
  return true;
}

function emitirErro(erro: string) {
  appStore.setNotifySnackBar({
    value: true,
    color: "error",
    icon: "mdi-alert-circle",
    text: erro,
    timeout: -1,
  });
}
// #endregion

// #region Watch
watch(value, (newVal: any, oldVal: any) => {
  if ((newVal === null && oldVal !== newVal) || (newVal === undefined && oldVal !== newVal)) {
    resetData();
  } else if (
    newVal !== null &&
    oldVal !== newVal &&
    newVal !== undefined &&
    type === "date" &&
    validateDateFormatoAMericano(newVal)
  ) {
    valor.value = dayjs(newVal).format("DD/MM/YYYY");
  }
});

watch(valor, (v: any) => {
  if (v && type === "date" && v.length >= 10) {
    validarTextField();
  }
  if (v && type === "dayOfMonth" && v.length >= 5) {
    validarTextField();
  }
  if (v && type === "datetime" && v.length >= 16) {
    validarTextField();
  }
  if (v && type === "datetimefull" && v.length >= 20) {
    validarTextField();
  }
  if (v && type === "month" && v.length >= 7) {
    validarTextField();
  }
});
// #endregion

// #region Lifecycle hooks
onMounted(() => {
  if (value.value && type === "date") {
    valor.value = dayjs(value.value).format("DD/MM/YYYY");
  }
  if (value.value && type === "datetime") {
    valor.value = dayjs(value.value).format("DD/MM/YYYY HH:mm");
  }
  if (value.value && type === "datetimefull") {
    valor.value = dayjs(value.value).format("DD/MM/YYYY HH:mm:ss");
  }
  if (value.value && type === "dayOfMonth") {
    valor.value = dayjs(value.value).format("DD/MM");
  }
  if (value.value && type === "month") {
    valor.value = dayjs(value.value).format("MM/YYYY");
  }
});
// #endregion
</script>

<template>
  <v-menu
    v-model="picker"
    :close-on-content-click="false"
    min-width="0"
    bottom
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-text-field
        :id="propsDatePicker.options?.id"
        ref="dataRef"
        v-model="valor"
        v-maska="mascara(mascaraData)"
        :autofocus="propsDatePicker.options?.autofocus"
        :clearable="propsDatePicker.options?.clearable"
        :data-cy="propsDatePicker.options?.dataCy || 'dia'"
        :disabled="propsDatePicker.options?.disabled"
        :variant="propsDatePicker.options?.variant || 'filled'"
        :label="propsDatePicker.options?.label"
        :class="
          (propsDatePicker.options?.required ? 'required' : '') +
            (propsDatePicker.options?.class ? ' ' + propsDatePicker.options?.class : '')
        "
        :placeholder="propsDatePicker.options?.placeHolder || '-/-/-'"
        :readonly="propsDatePicker.options?.readOnly"
        :rounded="propsDatePicker.options?.rounded"
        :single-line="propsDatePicker.options?.singleLine"
        :density="propsDatePicker.options?.density || 'compact'"
        :hide-details="propsDatePicker.options?.hideDetails"
        :rules="propsDatePicker.options?.rules"
        flat
        v-bind="props"
        @click:clear="resetData()"
        @keydown.enter="autocomplete()"
        @keydown.tab="(autocomplete(), (picker = false))"
        @dblclick="autocomplete()"
        @keydown="navegarDentroDoInput"
        @click="((picker = true), navegarDentroDoInput)"
      >
        <template #append-inner>
          <slot name="append" />
          <v-icon
            v-if="!valor"
            color="primary"
            density="compact"
            class="px-0 mx-0"
            variant="text"
            title="Abrir Date-Picker"
            @click="picker = true"
          >
            mdi-calendar-month-outline
          </v-icon>
          <div
            v-if="propsDatePicker.options?.controlarDia && type !== 'month'"
            class="d-flex"
          >
            <v-btn
              v-if="valor"
              color="primary"
              size="x-small"
              height="25"
              width="25"
              variant="text"
              title="Dia Anterior"
              @click="diminuirDia()"
            >
              <v-icon size="24">
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              v-if="valor"
              color="primary"
              size="x-small"
              height="25"
              width="25"
              variant="text"
              title="Próximo Dia"
              @click="aumentarDia()"
            >
              <v-icon size="24">
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <div
        v-if="picker"
        :class="isDark ? 'appbar' : 'white'"
        class="d-flex inline-flex"
      >
        <span>
          <v-date-picker
            v-model="data"
            :disabled="propsDatePicker.options?.disabled"
            :max="propsDatePicker.options?.max && parseMinMax(propsDatePicker.options?.max)"
            :min="propsDatePicker.options?.min && parseMinMax(propsDatePicker.options?.min)"
            :type="type === 'month' ? 'month' : 'date'"
            :color="isDark ? 'appbar' : 'primary'"
            locale="pt-br"
            hide-header
            no-title
            @update:model-value="
              type === 'datetime' ? (handleInput($event), (timePicker = 1)) : inputDataPicker()
            "
          />
          <v-btn
            v-if="propsDatePicker.options?.btnNow ?? true"
            :color="isDark ? '#009C4D' : 'primary'"
            dark
            width="95%"
            class="mb-2 mx-2"
            variant="outlined"
            @click="inputDateToday()"
          >
            Hoje {{ dayjs().format("DD/MM/YYYY") }}
          </v-btn>
        </span>
        <v-divider
          inset
          vertical
        />
        <v-time-picker
          v-if="type === 'datetime' || type === 'datetimefull'"
          ref="timePicker"
          v-model="horario"
          :color="isDark ? 'appbar' : 'primary'"
          :disabled="!data"
          class="justify-center"
          :min="propsDatePicker.options?.horamin"
          :max="propsDatePicker.options?.horamax"
          format="24hr"
          @update:model-value="inputDataPicker()"
        />
      </div>
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

.v-time-picker-controls__time__btn {
  width: 10px !important;
  height: 50px !important;
  font-size: 15px !important;
}

.v-time-picker-controls__time__separator {
  font-size: 25px;
  height: 30px;
}

.v-time-picker.v-picker .v-picker-title {
  display: none;
}

.v-time-picker-controls {
  margin-bottom: 10px;
}
</style>
