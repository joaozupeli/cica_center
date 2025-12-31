export interface DateRange {
  autofocus?: boolean | undefined;
  clearable?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  singleLine?: boolean | undefined;
  dataDeHojeAutomatica?: boolean | undefined;
  ano?: boolean | undefined;
  bimestre?: boolean | undefined;
  semestre?: boolean | undefined;
  semestre2?: boolean | undefined;
  trimestre?: boolean | undefined;
  mesPassado?: boolean | undefined;
  mesAtual?: boolean | undefined;
  mesQueVem?: boolean | undefined;
  ontem?: boolean | undefined;
  hoje?: boolean | undefined;
  amanha?: boolean | undefined;
  estaSemana?: boolean | undefined;
  rules?: any;
  required?: boolean;
  hideDetails?: boolean | undefined;
  btnNow?: boolean | undefined;
  rounded?: boolean | number | string | undefined;
  variant?:
    | "underlined"
    | "outlined"
    | "filled"
    | "solo"
    | "solo-inverted"
    | "solo-filled"
    | "plain";
  density?: "default" | "comfortable" | "compact";
  dataCy?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  label?: string | undefined;
  placeHolder?: string | undefined;
  type?: string | undefined;
  id?: string | undefined;
}

export type posicao = "minute" | "month" | "day" | "";
