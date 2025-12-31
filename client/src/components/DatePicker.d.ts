export interface DatePicker {
  autofocus?: boolean | undefined;
  clearable?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  singleLine?: boolean | undefined;
  controlarDia?: boolean | undefined;
  rules?: any;
  class?: any;
  required?: boolean;
  hideDetails?: boolean | undefined;
  btnNow?: boolean | undefined;
  rounded?: boolean | number | string | undefined;
  variant?:
    | underlined
    | outlined
    | filled
    | solo
    | `solo-inverted`
    | `solo-filled`
    | plain
    | undefined;
  density?: "default" | "comfortable" | "compact" | undefined;
  dataCy?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  label?: string | undefined;
  placeHolder?: string | undefined;
  type?: string | undefined;
  id?: string | undefined;
  horamax?: "23:59" | string;
  horamin?: "00:00" | string;
}

export type posicao = "minute" | "month" | "day" | "";
