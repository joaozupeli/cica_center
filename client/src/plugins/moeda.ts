const format = (moeda: number | null | undefined | string, casasDecimais: number = 2) => {
  if (typeof moeda === "number" && !isNaN(moeda)) {
    const negativo = moeda < 0 ? "-" : "";
    let valorAbsoluto = Math.abs(moeda);

    const fator = Math.pow(10, casasDecimais);
    valorAbsoluto = Math.round(valorAbsoluto * fator) / fator;

    const [parteInteiraRaw, parteDecimal] = valorAbsoluto.toString().split(".");

    const parteInteira = parteInteiraRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return negativo + (parteDecimal ? `${parteInteira},${parteDecimal}` : parteInteira);
  }

  return moeda;
};

const strip = (moeda: any) => {
  return moeda && typeof moeda === "string"
    ? Number(moeda.replace(/[.]/g, "").replace(",", ".").trim())
    : moeda;
};

export default {
  format,
  strip,
};
