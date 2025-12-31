/**
 * Objeto que armazena as opções e seus respectivos status.
 *
 * @type {{ [key: number]: { [key: number]: { descricao: string; cor: string } } }}
 */
const opcoes: { [key: number]: { [key: number]: { descricao: string; cor: string } } } = {
  1: {
    1: {
      descricao: "GrupoDeOpções",
      cor: "#000000",
    },
    14: {
      descricao: "StatusDaPosicao",
      cor: "#000000",
    },
  },
  // STATUS DO EQUIPAMENTO
  3: {
    1: {
      descricao: "AGUARDANDO COMPRA",
      cor: "#F9A829",
    },
    2: {
      descricao: "COMPRADO/EM ALMOXARIFADO",
      cor: "#1976D2",
    },
    3: {
      descricao: "EM ALMOXARIFADO",
      cor: "#2E7D32",
    },
    4: {
      descricao: "EM REPARO",
      cor: "#FF6801",
    },
    5: {
      descricao: "AGUARDANDO REPARO",
      cor: "#06287a",
    },
    6: {
      descricao: "RETIRADO",
      cor: "#9E9E9E",
    },
    7: {
      descricao: "INSTALADO",
      cor: "#2E7D32",
    },
    8: {
      descricao: "EM TRANSITO",
      cor: "#0277A1",
    },
    9: {
      descricao: "SUBSTITUIDO",
      cor: "#027780",
    },
  },
  // STATUS REQUISIÇÃO
  5: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "AGUARDANDO APROVACAO",
      cor: "#FF6801",
    },
    3: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    4: {
      descricao: "REJEITADO",
      cor: "#800000",
    },
    5: {
      descricao: "ORDEM COMPRA GERADA",
      cor: "#9E9E9E",
    },
    6: {
      descricao: "CANCELADA",
      cor: "#F44336",
    },
  },
  // STATUS DA ORDEM DE COMPRA
  10: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "LIBERADO COTACAO",
      cor: "#1976D2",
    },
    3: {
      descricao: "COTACAO INICIADA",
      cor: "#06287a",
    },
    4: {
      descricao: "COTACAO FINALIZADA",
      cor: "#2E7D32",
    },
    5: {
      descricao: "PEDIDO LIBERADO IGERP",
      cor: "#9108ff",
    },
    6: {
      descricao: "EM GERAÇÃO IGERP",
      cor: "#9E9E91",
    },
    7: {
      descricao: "PEDIDO GERADO IGERP",
      cor: "#9E9E9E",
    },
    8: {
      descricao: "ERRO GERAÇÃO IGERP",
      cor: "#800000",
    },
    9: {
      descricao: "PEDIDO ENVIADO FORNECEDOR",
      cor: "#0277A1",
    },
    10: {
      descricao: "NOTA FISCAL EMITIDA",
      cor: "#85ddda",
    },
    11: {
      descricao: "RECEBIMENTO PARCIAL",
      cor: "#FF9800",
    },
    12: {
      descricao: "RECEBIMENTO TOTAL",
      cor: "#4CAF50",
    },
    13: {
      descricao: "LIBERADO VERIFICACAO PCM",
      cor: "#be7a0bff",
    },
    14: {
      descricao: "COTACAO VERIFICADA PCM",
      cor: "#2E7D32",
    },
    15: {
      descricao: "COTAÇÃO FINALIZADA PARCIAL",
      cor: "#FF9800",
    },
    16: {
      descricao: "AGUARDANDO REVISÃO",
      cor: "#1976D2",
    },
    17: {
      descricao: "REVISÃO INICIADA",
      cor: "#06287a",
    },
    18: {
      descricao: "CANCELADA",
      cor: "#F44336",
    },
  },
  // STATUS SISTEMA
  13: {
    1: {
      descricao: "INSTALADO",
      cor: "#4CAF50",
    },
    2: {
      descricao: "RETIRADO",
      cor: "#9E9E9E",
    },
  },
  // STATUS DA POSIÇÃO
  14: {
    1: {
      descricao: "ATIVO",
      cor: "#4CAF50",
    },
    2: {
      descricao: "INATIVO",
      cor: "#9E9E9E",
    },
  },
  // STATUS ITEM ORDEM COMPRA
  16: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "EM ANDAMENTO",
      cor: "#06287a",
    },
    3: {
      descricao: "CONFIRMADO",
      cor: "#2E7D32",
    },
    4: {
      descricao: "APROVADO",
      cor: "#658debff",
    },
    5: {
      descricao: "REJEITADO",
      cor: "#800000",
    },
  },
  // STATUS ORDEM COMPRA FORNECEDOR
  18: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "SELECIONADO",
      cor: "#06287a",
    },
    3: {
      descricao: "FINALIZADO",
      cor: "#2E7D32",
    },
    4: {
      descricao: "EXPORTADO",
      cor: "grey",
    },
  },
  // STATUS DO VEICULO
  19: {
    1: {
      descricao: "AGUARDANDO COMPRA",
      cor: "#F9A829",
    },
    2: {
      descricao: "COMPRADO/EM ALMOXARIFADO",
      cor: "#1976D2",
    },
    3: {
      descricao: "INSTALADO",
      cor: "#2E7D32",
    },
    4: {
      descricao: "RETIRADO",
      cor: "#9E9E9E",
    },
    5: {
      descricao: "EM TRANSITO",
      cor: "#06287a",
    },
  },
  // STATUS DO INVENTARIO
  21: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "LIBERADO INICIO",
      cor: "#1976D2",
    },
    3: {
      descricao: "INICIADO",
      cor: "#06287a",
    },
    4: {
      descricao: "FINALIZADO SEM DIVERGENCIA",
      cor: "#2E7D32",
    },
    5: {
      descricao: "FINALIZADO COM DIVERGENCIA",
      cor: "#F44336",
    },
    6: {
      descricao: "ESTOQUE ATUALIZADO",
      cor: "#9E9E9E",
    },
  },
  // STATUS ORDEM COMPRA FORNECEDOR
  22: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    3: {
      descricao: "RECUSADO",
      cor: "#800000",
    },
  },
  // ATIVO / INATIVO
  23: {
    1: {
      descricao: "ATIVO",
      cor: "#4CAF50",
    },
    2: {
      descricao: "INATIVO",
      cor: "#9E9E9E",
    },
  },
  // STATUS ORDEM DE SERVICO
  32: {
    1: {
      descricao: "SOLICITACAO DE SERVICO",
      cor: "#0277A1",
    },
    2: {
      descricao: "EMITIDO",
      cor: "#2E7D32",
    },
    3: {
      descricao: "AGUARDANDO PECA",
      cor: "#F9A829",
    },
    4: {
      descricao: "AGUARDANDO VERIFICACAO",
      cor: "#1976D2",
    },
    5: {
      descricao: "EM ANDAMENTO",
      cor: "#06287a",
    },
    6: {
      descricao: "CONCLUIDO",
      cor: "#9E9E9E",
    },
    7: {
      descricao: "CANCELADO",
      cor: "#F44336",
    },
  },
  // STATUS ATIVIDADE ORDEM SERVICO
  36: {
    1: {
      descricao: "AGUARDANDO",
      cor: "#F9A829",
    },
    2: {
      descricao: "INICIADO",
      cor: "#06287a",
    },
    3: {
      descricao: "CONCLUIDO",
      cor: "#2E7D32",
    },
  },
  // STATUS LISTA SELEÇÃO
  41: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "EM ATENDIMENTO",
      cor: "#1976D2",
    },
    3: {
      descricao: "AGUARDANDO APROVACAO",
      cor: "#06287a",
    },
    4: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    5: {
      descricao: "EMITIDO",
      cor: "#9E9E9E",
    },
  },
  // STATUS LISTA SELEÇÃO
  45: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "EM ANDAMENTO",
      cor: "#06287a",
    },
    3: {
      descricao: "FINALIZADO",
      cor: "#2E7D32",
    },
  },
  // STATUS RECEBIMENTO SEM OC
  47: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
  },
  // STATUS LISTA DE VERIFICAÇÃO
  56: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "EM ANDAMENTO",
      cor: "#06287a",
    },
    3: {
      descricao: "AGUARDANDO REVISOR",
      cor: "#1976D2",
    },
    4: {
      descricao: "REVISADO",
      cor: "#2E7D32",
    },
    5: {
      descricao: "REJEITADO",
      cor: "#800000",
    },
    6: {
      descricao: "CONCLUIDO",
      cor: "#9E9E9E",
    },
  },
  // STATUS RECEBIMENTO COM OC
  64: {
    1: {
      descricao: "INCOMPLETO",
      cor: "#06287a",
    },
    2: {
      descricao: "EM ANDAMENTO",
      cor: "#F9A829",
    },
    3: {
      descricao: "GUIA DE REMESSA REGISTRADA",
      cor: "#2E7D32",
    },
    4: {
      descricao: "APROVADO",
      cor: "#9E9E9E",
    },
  },
  // STATUS PRÉ REQUISIÇÃO
  67: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "EM ANDAMENTO",
      cor: "#06287a",
    },
    3: {
      descricao: "REQUISICAO GERADA",
      cor: "#2E7D32",
    },
    4: {
      descricao: "CANCELADO",
      cor: "#F44336",
    },
  },
  // STATUS CONFIGURACAO EQUIPAMENTO
  68: {
    1: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    2: {
      descricao: "SUBSTITUIDO",
      cor: "#9E9E9E",
    },
    3: {
      descricao: "INCOMPLETO",
      cor: "#F9A829",
    },
  },
  // STATUS GERACAO EQUIPAMENTO
  70: {
    1: {
      descricao: "AGUARDANDO",
      cor: "#06287a",
    },
    2: {
      descricao: "INICIADO",
      cor: "#F9A829",
    },
    3: {
      descricao: "PROCESSADO",
      cor: "#9E9E9E",
    },
  },
  // STATUS NOTA FISCAL
  72: {
    1: {
      descricao: "AGUARDANDO LIBERAÇÃO",
      cor: "#F9A829",
    },
    2: {
      descricao: "PEDIDO NFE GERADO",
      cor: "#2E7D32",
    },
    3: {
      descricao: "NFE EMITIDA",
      cor: "#9E9E9E",
    },
    4: {
      descricao: "NFE CANCELADA",
      cor: "#F44336",
    },
  },
  // STATUS DE EVENTO DA NOTA FISCAL
  75: {
    1: {
      descricao: "REALIZADO",
      cor: "#2E7D32",
    },
    2: {
      descricao: "CANCELADO",
      cor: "#F44336",
    },
  },
  // STATUS REQUISIÇÃO INTERNA
  76: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A829",
    },
    2: {
      descricao: "AGUARDANDO APROVACAO",
      cor: "#FF6801",
    },
    3: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    4: {
      descricao: "REJEITADO",
      cor: "#800000",
    },
    5: {
      descricao: "CANCELADA",
      cor: "#F44336",
    },
    6: {
      descricao: "AGUARDANDO PEÇA",
      cor: "#FF6654",
    },
    7: {
      descricao: "LIBERADO SEPARAÇÃO",
      cor: "#2A7010",
    },
    8: {
      descricao: "EM SEPARAÇÃO",
      cor: "#1976D2",
    },
    9: {
      descricao: "SEPARAÇÃO FINALIZADA",
      cor: "#027750",
    },
    10: {
      descricao: "AGUARDANDO EMISSÃO NFE",
      cor: "#0278B9",
    },
    11: {
      descricao: "LIBERADO EMISSÃO",
      cor: "#0277A1",
    },
    12: {
      descricao: "NFE EMITIDA / EM TRÂNSITO",
      cor: "#027780",
    },
    13: {
      descricao: "AGUARDANDO RECEBIMENTO",
      cor: "#06287a",
    },
    14: {
      descricao: "PARCIALMENTE RECEBIDO",
      cor: "#FF5C00",
    },
    15: {
      descricao: "TOTALMENTE RECEBIDO",
      cor: "#4CAF50",
    },
    16: {
      descricao: "FINALIZADO",
      cor: "#9E9E9E",
    },
    17: {
      descricao: "AGUARDANDO GERAÇÃO DE PEDIDO",
      cor: "#0278B9",
    },
    18: {
      descricao: "LIBERADO GERAÇÃO DE PEDIDO",
      cor: "#0277A1",
    },
    19: {
      descricao: "PEDIDO DE NOTA GERADO",
      cor: "#027700",
    },
  },
  // STATUS REQUISIÇÃO INTERNA PEÇA
  77: {
    1: {
      descricao: "AGUARDANDO SEPARAÇÃO",
      cor: "#F9A825",
    },
    2: {
      descricao: "SEPARAÇÃO INICIADA",
      cor: "#1976D2",
    },
    3: {
      descricao: "SEPARAÇÃO FINALIZADA",
      cor: "#027750",
    },
  },
  // STATUS REQUISIÇÃO INTERNA PEÇA RECEBIMENTO
  78: {
    1: {
      descricao: "AGUARDANDO RECEBIMENTO",
      cor: "#F9A825",
    },
    2: {
      descricao: "PARCIALMENTE RECEBIDO",
      cor: "#FF5C00",
    },
    3: {
      descricao: "TOTALMENTE RECEBIDO",
      cor: "#4CAF50",
    },
  },
  // STATUS EMPRESTIMO FERRAMENTA
  80: {
    1: {
      descricao: "DIGITAÇÃO",
      cor: "#06287a",
    },
    2: {
      descricao: "AGUARDANDO CONFIRMACAO SOLICITANTE",
      cor: "#F9A829",
    },
    3: {
      descricao: "AGUARDANDO APROVACAO AUTORIZADOR",
      cor: "#FF6801",
    },
    4: {
      descricao: "EMPRESTIMO LIBERADO",
      cor: "#2E7D32",
    },
    5: {
      descricao: "EM EMPRESTIMO",
      cor: "#0277A1",
    },
    6: {
      descricao: "FINALIZADO",
      cor: "#9E9E9E",
    },
    7: {
      descricao: "LIBERADO SEPARAÇÃO",
      cor: "#2A7010",
    },
    8: {
      descricao: "EM SEPARAÇÃO",
      cor: "#1976D2",
    },
    9: {
      descricao: "SEPARAÇÃO FINALIZADA",
      cor: "#027750",
    },
    10: {
      descricao: "RECEBIMENTO INICIADO",
      cor: "#06289b",
    },
    11: {
      descricao: "RECEBIMENTO PARCIAL",
      cor: "#FF5C00",
    },
    12: {
      descricao: "RECEBIMENTO FINALIZADO",
      cor: "#4CAF50",
    },
  },
  // STATUS REPARO INTERNO
  90: {
    1: {
      descricao: "AGUARDANDO APROVACAO",
      cor: "#FF6801",
    },
    2: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    3: {
      descricao: "REJEITADO",
      cor: "#800000",
    },
    4: {
      descricao: "REQUSICAO DE ENVIO",
      cor: "#F9A829",
    },
    5: {
      descricao: "RECEBIDO DESTINO",
      cor: "#1976D2",
    },
    6: {
      descricao: "REPARO FINALIZADO",
      cor: "#4CAF50",
    },
    7: {
      descricao: "FINALIZADO SEM RETORNO",
      cor: "#9E9E9E",
    },
    8: {
      descricao: "REQUISICAO DE RETORNO",
      cor: "#06289b",
    },
    9: {
      descricao: "REPARO INICIADO",
      cor: "#06287a",
    },
    10: {
      descricao: "REPARO PARCIAL",
      cor: "#FF5C00",
    },
    11: {
      descricao: "RECEBIDO NA ORIGEM",
      cor: "#0277A1",
    },
  },
  // STATUS DAS PEÇAS DO EMPRESTIMO DE FERRAMENTA
  85: {
    1: {
      descricao: "AGUARDANDO SEPARAÇÃO",
      cor: "#F9A825",
    },
    2: {
      descricao: "SEPARAÇÃO INICIADA",
      cor: "#1976D2",
    },
    3: {
      descricao: "SEPARAÇÃO FINALIZADA",
      cor: "#027750",
    },
  },
  // STATUS FABRICACAO PECA OS
  94: {
    1: {
      descricao: "PENDENTE",
      cor: "#F9A825",
    },
    2: {
      descricao: "PARCIAL",
      cor: "#1976D2",
    },
    3: {
      descricao: "FINALIZADO",
      cor: "#027750",
    },
  },

  // STATUS REPARO ITEM OS
  96: {
    1: {
      descricao: "AGUARDANDO",
      cor: "#06287a",
    },
    2: {
      descricao: "PARCIAL",
      cor: "#FF5C00",
    },
    3: {
      descricao: "FINALIZADO",
      cor: "#4CAF50",
    },
  },

  // STATUS RECEBIMENTO COM ORDEM DE COMPRA
  97: {
    1: {
      descricao: "RECEBIMENTO INICIADO",
      cor: "#06287a",
    },
    2: {
      descricao: "RECEBIMENTO PARCIAL",
      cor: "#FF5C00",
    },
    3: {
      descricao: "RECEBIMENTO FINALIZADO",
      cor: "#4CAF50",
    },
  },

  // STATUS VEÍCULO (FROTA PNEUS)
  103: {
    1: {
      descricao: "ATIVO",
      cor: "#027750",
    },
    2: {
      descricao: "EM MANUTENÇÃO",
      cor: "#1976D2",
    },
    3: {
      descricao: "INATIVO",
      cor: "#F9A825",
    },
  },

  // STATUS ITEM REPARO SOLICITACAO DE REPARO
  105: {
    1: {
      descricao: "REPARO INICIADO",
      cor: "#06287a",
    },
    2: {
      descricao: "REPARO PARCIAL",
      cor: "#FF5C00",
    },
    3: {
      descricao: "REPARO FINALIZADO",
      cor: "#4CAF50",
    },
  },

  // STATUS RECLAMAÇÃO DE GARANTIA
  110: {
    1: {
      descricao: "AGUARDANDO APROVAÇÃO",
      cor: "#FF6801",
    },
    2: {
      descricao: "APROVADO",
      cor: "#2E7D32",
    },
    3: {
      descricao: "REJEITADO",
      cor: "#800000",
    },
  },

  // STATUS PROGRAMAÇÃO DE MANUTENÇÃO PREVENTIVA
  111: {
    1: {
      descricao: "EM DIGITAÇÃO",
      cor: "#06287a",
    },
    2: {
      descricao: "AGUARDANDO APROVAÇÃO",
      cor: "#FF6801",
    },
    3: {
      descricao: "APROVADO",
      cor: "#4CAF50",
    },
  },
};

/**
 * Retorna a cor associada à opção e item fornecidos.
 *
 * @param {number} opcao - O número da opção.
 * @param {number} item - O número do item.
 * @return {string} A cor associada à opção e item fornecidos.
 */
function statusCor(opcao: number, item: number): string {
  const obj = opcoes[opcao];
  const itemGenerica = (obj && obj[item]) ?? { cor: "#000000" };
  return itemGenerica.cor;
}

export default { opcoes, statusCor };
