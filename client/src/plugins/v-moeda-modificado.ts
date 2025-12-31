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

  const formatar = (input: string) => {
    let casaDecimal = 2;
    let valorNegativo = true;
    let mascara = true;

    if (binding.value) {
      if (typeof binding.value.decimal === "number")
        casaDecimal = Math.max(0, Math.min(binding.value.decimal, 20));
      if (typeof binding.value.negativo === "boolean") valorNegativo = binding.value.negativo;
      if (typeof binding.value.mascara === "boolean") mascara = binding.value.mascara;
    }

    if (!mascara) return input;

    // Se input estiver vazio, retorna vazio
    if (!input) return "";

    // Preserva sinal negativo se houver
    let negativo = "";
    if (valorNegativo && input.includes("-")) {
      negativo = "-";
      input = input.replace("-", "");
    }

    // Limpa caracteres inválidos, mas mantém vírgula para detectar decimal
    input = input.replace(/[^\d,]/g, "");

    // Divide em parte inteira e decimal
    const partes = input.split(",");
    let inteiro = partes[0] || "0";
    let decimal = partes[1] || "";

    // Limita casas decimais digitadas
    decimal = decimal.substring(0, casaDecimal);

    // Remove zeros à esquerda da parte inteira
    inteiro = inteiro.replace(/^0+(?=\d)/, "");

    // Adiciona separador de milhar (ponto)
    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Monta o valor final
    let resultado = negativo + inteiro;

    if (input.includes(",")) {
      resultado += "," + decimal;
    }

    return resultado;
  };

  el.formatarInput();
};

function install(Vue: App): void {
  Vue.directive("moeda", moeda);
}

export default install;
