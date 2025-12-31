export interface FieldsPage {
  type?: string
  cols?: string
  componenteDinamico?: any | undefined
  componenteDinamicoProps?: Function | undefined
  listeners?: object | undefined
  model?: object | undefined
  id?: string
  label?: string
  atividade?: boolean
  variant?:
    | "outlined"
    | "plain"
    | "underlined"
    | "filled"
    | "solo"
    | "solo-inverted"
    | "solo-filled"
    | undefined
  density?: "default" | "compact" | "comfortable" | undefined
  appendInnerIcon?: string
  bgColor?: string
  comtipoDescricao?: boolean
  color?: string
  disabled?: boolean
  placeholder?: string
  prefix?: string
  suffix?: string
  items?: Array<any>
  multiple?: boolean
  size?: string
  itemValue?: string
  itemTitle?: string
  typeField?: string
  typeDatePicker?: string
  maxDate?: string
  minDate?: string
  dataCy?: string
  rounded?: boolean | number | string | undefined
  btnNowDatePicker?: boolean
  controlarDiaDatePicker?: boolean
  singleLineDatePicker?: boolean
  readOnly?: boolean
  clearable?: boolean
  ordemServicoId?: number
  almoxarifadoId?: number
  redirecionar?: boolean
  autofocus?: boolean
  descricaoEmpresa?: string
  empresa?: boolean
  rules?: any
  hideDetails?: boolean
  block?: boolean
  rota?: object | undefined
  moeda?: object | undefined
  validarRotina?: boolean
  filtrarEmpresas?: boolean
  validate?: boolean
  trueValue?: boolean
  falseValue?: boolean
  required?: boolean | undefined
  ripple?: boolean
  visible?: boolean
  mascara?: Array<any> | undefined
  atualizar?: () => {} | undefined
  action?: Function | undefined
  grupoId?: any
  tipo?: number
  status?: number[]
  empresaId?: number | any[] | undefined
  ordemCompraId?: number
  append?: boolean
  semPlaceholder?: boolean
  NaoReplicarLabel?: boolean
  mostrarPecaPai?: boolean
  appendMessage?: string
  tabelaGrupo?: string
  removeAlmoxarifados?: any[]
  description?: string
}

interface Actions {
  id?: string
  color?: string
  icon?: string
  class?: string | undefined
  text?: string
  size?: string
  title?: string
  variant?: "flat" | "text" | "outlined" | "elevated" | "tonal" | "plain" | undefined
  validate?: boolean
  disabled?: boolean
  visible?: boolean
  action?: Function | undefined
}

interface MoreOptions {
  visible?: boolean
  color?: string
  text?: string
  size?: string
  variant?: string
  actions?: Array<Actions> | undefined
}
interface Forms {
  visible?: boolean
  description?: string
  actions?: Array<Actions>
  toolbarActions?: Array<Actions>
  toolbarButtons?: Array<Actions>
  moreOptions?: MoreOptions
  fields?: Array<FieldsPage>
  fieldsDetails?: Array<FieldsDetails>
}

export interface PageType {
  title?: string
  subtitle?: string
  class?: string
  cols?: number
  hideMsgCamposObrigatorios?: boolean
  mode?: string
  modeController?: { edit: boolean; insert: boolean; view: boolean } | undefined
  idsVisibleActions?: Array<string>
  form?: Forms
}

export interface FieldsDetails {
  title?: string
  fields?: Array<FieldsPage>
}
