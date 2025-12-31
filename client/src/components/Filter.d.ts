export interface Fields {
  type?: string;
  cols?: string;
  model?: object;
  moeda?: { negativo: boolean | undefined; decimal: number | undefined } | undefined;
  id?: string;
  label?: string;
  variant?:
    | "outlined"
    | "plain"
    | "underlined"
    | "filled"
    | "solo"
    | "solo-inverted"
    | "solo-filled";
  variantBtn?: "flat" | "text" | "outlined" | "elevated" | "tonal" | "plain";
  density?: any;
  appendInnerIcon?: string;
  bgColor?: string;
  color?: string;
  required?: boolean;
  disabled?: boolean;
  validarRotina?: boolean;
  almoxarifadoId?: any;
  filtrarEmpresas?: boolean;
  filtrarAlmoxarifados?: boolean;
  validate?: boolean;
  placeholder?: string;
  prefix?: string;
  sufixo?: string;
  items?: Array<any>;
  multiple?: boolean;
  size?: string;
  itemValue?: string;
  visible?: boolean;
  itemTitle?: string;
  typeDatePicker?: string;
  maxDate?: string;
  minDate?: string;
  dataCy?: string;
  rounded?: boolean | number | string | undefined;
  btnNowDatePicker?: boolean;
  controlarDiaDatePicker?: boolean;
  singleLineDatePicker?: boolean;
  singleLine?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  semPlaceholder?: boolean;
  autofocus?: boolean;
  trueValue?: number;
  falseValue?: number;
  ripple?: boolean;
  rules?: any | [];
  hideDetails?: boolean;
  block?: boolean;
  mostrarPecaPai?: boolean;
  mascara?: Array<any> | undefined;
  keyDownEnter?: Function;
  action?: Function;
  grupoId?: any;
  empresaId?: any;
  status?: any;
  tabelaGrupo?: string;
  tipo?: number | undefined | null | number[];
  description?: string;
  ordemServicoId?: number | null;
}
export interface Actions {
  type: string;
  color?: string;
  class?: string;
  icon?: string;
  text?: string;
  size?: string | number;
  slim?: boolean;
  disabled?: boolean;
  validate?: boolean;
  variant: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  //variant?: string;
  action?: any | undefined;
  list?: Array<Actions>;
}

export interface Filter {
  actions?: Array<Actions>;
  moreFilters?: boolean;
  fields?: Array<Fields> | undefined;
  defaultExpanded?: boolean;
  fieldsInMoreFilters?: Array<Fields> | undefined;
  fieldsResetFilters?: boolean;
}
