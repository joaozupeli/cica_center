import type { App } from "vue";

const moeda = (el: any, binding: any) => {
  if (el.tagName.toLocaleUpperCase() !== "INPUT") {
    const els = el.getElementsByTagName("input");

    if (els.length !== 1) throw new Error("A diretiva v-moeda requer um input");
    else el = els[0];
  }

  if ([binding.value].includes(undefined)) {
    return;
  }

  el.formatarInput = async () => {
    if (el.value !== "0,00") {
      const casaDecimal =
        typeof binding.value?.decimal && binding.value?.decimal === "number"
          ? binding.value.decimal
          : 2;

      if (el.value.replace(/[.,]/g, "").length - casaDecimal <= 12) {
        el.value = await formatar(el.value || "");

        // el.focus();
        el.dispatchEvent(new Event("input"));
      } else {
        el.value = el.value.replace(/[.,]/g, "").slice(0, 12 + casaDecimal);
        el.dispatchEvent(new Event("input"));
      }

      const ios = navigator.userAgent.match(/ipad|ipod|iphone/i);

      if (ios) {
        const range = document.createRange();

        range.selectNodeContents(el);

        const selection = window.getSelection();

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        setTimeout(() => {
          el.setSelectionRange(999999, 999999);
        }, 1);
      } else {
        setTimeout(() => {
          el.setSelectionRange(-1, -1);
        }, 1);
      }
    }
  };

  const formatar = (input: any) => {
    let casaDecimal = 2;
    let valorNegativo = true;
    let mascara = true;

    if (binding.value) {
      if (binding.value.decimal !== undefined && typeof binding.value.decimal === "number")
        casaDecimal = binding.value.decimal;
      if (binding.value.negativo !== undefined && typeof binding.value.negativo === "boolean")
        valorNegativo = binding.value.negativo;
      if (binding.value.mascara !== undefined && typeof binding.value.mascara === "boolean")
        mascara = binding.value.mascara;
    }

    const verificaValor = [];

    for (let i = 0; i <= casaDecimal; i++) {
      const string = "".padEnd(i, "0");

      verificaValor.push("0," + string);
    }

    if (mascara || (!mascara && input && verificaValor.indexOf(input) < 0 && input !== "0")) {
      if (typeof input === "number") input = input.toFixed(casasDecimaisFixas(casaDecimal));

      let negativo = "";

      if (valorNegativo) {
        if (input === "-0,0") negativo = "";
        else negativo = input.indexOf("-") >= 0 ? "-" : "";
      }

      const numeros = apenasNumeros(input);
      const moeda = numeroMoeda(numeros, casaDecimal);
      const separacao = String(moeda).split(".");
      let inteiro = separacao[0];
      const decimal = separacao[1];

      inteiro = adicionarSeparador(inteiro, ".");

      return negativo + inteiroAdicional(inteiro, decimal, ",");
    } else {
      return input;
    }
  };

  function apenasNumeros(input: any) {
    return String(input.replace(/\D+/g, "")) || "0";
  }

  function casasDecimaisFixas(casasDecimais: number) {
    return diferenca(0, casasDecimais, 20);
  }

  function diferenca(min: number, n: number, max: number) {
    return Math.max(min, Math.min(n, max));
  }

  function numeroMoeda(numero: string, casasDecimais: number) {
    const exp = Math.pow(10, casasDecimais);
    const float = parseFloat(numero) / exp;
    return float.toFixed(casasDecimaisFixas(casasDecimais));
  }

  function adicionarSeparador(inteiro: string, separador: string) {
    return inteiro.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separador}`);
  }

  function inteiroAdicional(inteiro: string, decimal: string, separador: string) {
    return decimal ? inteiro + separador + decimal : inteiro;
  }

  el.formatarInput();
};

function install(Vue: App): void {
  Vue.directive("moeda", moeda);
}

export default install;
