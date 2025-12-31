import * as CryptoJS from "crypto-js";

const hashByCrypto = (senha: any) => {
  return CryptoJS.HmacSHA256(senha, "123").toString();
};

export default hashByCrypto;
