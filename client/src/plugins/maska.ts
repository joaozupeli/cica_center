import { type MaskInputOptions, type MaskTokens } from "maska";

/**
 * Returns a mask input options object based on the provided mask and size.
 *
 * If a mask string is provided without a size, the mask is used as is.
 * If a mask string and a size are provided, the mask is repeated to match the size.
 *
 * @param {string} mascara - The mask string (default: '')
 * @param {number} tamanho - The size of the mask (default: 0)
 * @return {MaskInputOptions} The mask input options object
 * @example
 * const maskOptions = mascara('###.###.###-##');
 * // Output: { mask: '###.###.###-##', tokens: { ... } }
 *
 * @property {MaskTokens} "#" - Dígitos (0-9)
 * @property {MaskTokens} a - Letras minúsculas (a-z)
 * @property {MaskTokens} N - Letras e dígitos (a-z, 0-9)
 * @property {MaskTokens} X - Qualquer caractere
 * @property {MaskTokens} H - Dígitos e vírgula (0-9, ,)
 * @property {MaskTokens} E - Qualquer caractere (incluindo espaço)
 * @property {MaskTokens} A - Letras e dígitos (A-Z, a-z, 0-9)
 * @property {MaskTokens} B - Letras, dígitos e caracteres especiais (A-Z, a-z, 0-9, _-)
 * @property {MaskTokens} G - Letras e espaço (A-Z, a-z, espaço)
 * @property {MaskTokens} L - Letras, dígitos e caracteres especiais (A-Z, a-z, 0-9, _-, )
 * @property {MaskTokens} T - Qualquer caractere (transformado para maiúscula)
 * @property {MaskTokens} t - Qualquer caractere (transformado para minúscula)
 * @property {MaskTokens} Y - Letras, dígitos e caracteres especiais (A-Z, a-z, 0-9, espaço, ./?<>;:!@#%&*()+[\]\\,-çÇ) (transformado para maiúscula)
 * @property {MaskTokens} y - Letras, dígitos e caracteres especiais (A-Z, a-z, 0-9, espaço, ./?<>;:!@#%&*()+[\]\\,-çÇ) (transformado para minúscula)
 * @property {MaskTokens} W - Letras, dígitos e caracteres especiais (A-Z, a-z, 0-9, espaço, ./?<>;:!@#%&*()+[\]\\,-çÇ)
 */
export const mascara = (mascara: string | string[] = "", tamanho: number = 0) => {
  const tokens: MaskTokens = {
    "#": { pattern: /\d/ },
    a: {
      pattern: /[a-z]/i,
    },
    N: { pattern: /[0-9a-z]/i },
    X: { pattern: /./ },

    H: { pattern: /[0-9,]/ },
    E: { pattern: /.+/ },
    A: {
      pattern: /[a-zA-ZÀ-ú0-9]/,
    },
    B: {
      pattern: /[a-zA-Z0-9_-]/,
      transform: (v: string) => {
        return v.toLocaleUpperCase();
      },
    },
    F: {
      pattern: /[a-zA-Z0-9 ]/,
      transform: (v: string) => {
        return v.toLocaleUpperCase();
      },
    },
    G: {
      pattern: /[a-zA-Zà-ùÀ-Ú\s]/,
      transform: (v: string) => {
        return v.toLocaleUpperCase();
      },
    },
    L: { pattern: /[a-zA-Z0-9 _-]/, transform: (v: string) => v.toLocaleUpperCase() },
    T: {
      pattern: /./,
      transform: (v: string) => {
        return v.toLocaleUpperCase();
      },
    },
    t: {
      pattern: /./,
      transform: (v: string) => {
        return v.toLocaleLowerCase();
      },
    },
    Y: {
      pattern: /[a-zA-Z0-9\s/.?<>;:!@#%&*()+[\]\\,-çÇ]/,
      transform: (v: string) => v.toLocaleUpperCase(),
    },
    y: {
      pattern: /[a-zA-Z0-9\s/.?<>;:!@#%&*()+[\]\\,-çÇ]/,
      transform: (v: string) => v.toLocaleLowerCase(),
    },
    W: { pattern: /[a-zA-Z0-9\s/.?<>;:!@#%&*()+[\]\\,-çÇõ]/ },
  };
  if (!tamanho && typeof mascara === "string") {
    return <MaskInputOptions>{
      mask: mascara,

      tokens: tokens,
    };
  } else if (tamanho && typeof mascara === "string") {
    return <MaskInputOptions>{
      mask: mascara.repeat(tamanho),

      tokens: tokens,
    };
  } else if (!tamanho && Array.isArray(mascara)) {
    return <MaskInputOptions>{
      mask: [...mascara],

      tokens: tokens,
    };
  }
};

export const validMask = (mask: any[]): any => {
  if (Array.isArray(mask) && mask.length === 1 && typeof mask[0] === "string") {
    return mascara(...mask);
  } else if (
    Array.isArray(mask) &&
    mask.length === 2 &&
    typeof mask[0] === "string" &&
    typeof mask[1] === "number"
  ) {
    return mascara(...mask);
  } else if (Array.isArray(mask) && !mask.some((el: any) => typeof el !== "string")) {
    return mascara([...mask]);
  } else {
    return mascara(undefined);
  }
};

/**
 * Mascara um CPF mostrando apenas os dígitos do meio
 * @param cpf - CPF com ou sem formatação (ex: "12345678901" ou "123.456.789-01")
 * @returns CPF mascarado no formato "***.XXX.XXX-**"
 * @example
 * mascaraCpf("12345678901") // "***.456.789-**"
 * mascaraCpf("123.456.789-01") // "***.456.789-**"
 */
export const mascaraCpf = (cpf: string): string => {
  if (!cpf) return "";
  
  // Remove tudo que não é número
  const apenasNumeros = cpf.replace(/\D/g, "");
  
  // Verifica se tem 11 dígitos
  if (apenasNumeros.length !== 11) return cpf;
  
  // Extrai os dígitos do meio (posições 3-5 e 6-8)
  const meio1 = apenasNumeros.substring(3, 6);
  const meio2 = apenasNumeros.substring(6, 9);
  
  // Retorna no formato ***.XXX.XXX-**
  return `***.${meio1}.${meio2}-**`;
};

/**
 * Formata um CPF completo no padrão XXX.XXX.XXX-XX
 * @param cpf - CPF apenas números
 * @returns CPF formatado
 */
export const formatarCpf = (cpf: string): string => {
  if (!cpf) return "";
  
  const apenasNumeros = cpf.replace(/\D/g, "");
  
  if (apenasNumeros.length !== 11) return cpf;
  
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};