export interface ActionsTable {
  type?: string | undefined;
  color?: string | undefined;
  class?: string | undefined;
  icon?: string | undefined;
  text?: string | undefined;
  title?: string | undefined;
  style?: string | undefined;
  size?: string | undefined;
  disabled?: boolean | Function | undefined;
  variant?: string | undefined;
  action?: Function | undefined;
  visibleAction?: Function | undefined;
  badge?: Function | undefined;
  badgeNotify?: boolean | undefined;
  badgeNotifyColor?: string | undefined;
  badgeNotifyQuantidade?: number | ((item: any) => number | Promise<number>) | undefined;
}
export interface Input {
  modoEdicao?: boolean | Function | undefined;
  progressoColor?: Function | undefined;
  progressoHeight?: number | string | undefined;
  almoxarifadoId?: number | undefined;
  fabricanteId?: number | undefined;
  pecaId?: number | undefined | Function;
  ordemCompraFornecedorItemId?: number | undefined | Function;
  idLote?: number | undefined;
  datePicker?: boolean | undefined;
  type?: string | undefined;
  VMoeda?: boolean | undefined;
  VMaska?: boolean | undefined;
  VCheckBox?: boolean | undefined;
  preencher?: boolean | Function | undefined;
  checkBoxLabel?: string | undefined;
  sufixo?: string | undefined;
  prefixo?: string | undefined;
  width?: string | number | undefined;
  msgTrue?: string | undefined;
  msgFalse?: string | undefined;
  itemValue?: string | undefined;
  itemText?: string | undefined;
  mascara?: Array<any> | undefined;
  items?: Array<any> | undefined;
  reverse?: boolean | undefined;
  VMoedaNegativo?: boolean | undefined;
  VMoedaInteiro?: boolean | undefined;
  VMoedaCasasDecimais?: number;
  empresaId?: number | undefined;
  pecaAlmoxarifadoCompartimentoId?: number | undefined;
  action?: Function | undefined;
  onClickAction?: Function | undefined;
  componenteDinamico?: any | undefined;
  componenteDinamicoProps?: Function | undefined;
  listeners?: Object | undefined;
}

export interface Origem {
  name?: string | undefined;
  query?: object | undefined;
}

export interface HeadersTable {
  actions?: Array<ActionsTable> | undefined;
  campoEdit?: Array<any> | undefined;
  key: string;
  value?: string | undefined;
  title?: string | undefined;
  fixed?: boolean | undefined;
  align: "start" | "end" | "center";
  width?: string | number | undefined;
  minWidth?: string | undefined;
  maxWidth?: string | undefined;
  naoExibirExcel?: boolean;
  nowrap?: boolean | undefined;
  headerProps?: { [x: string]: any } | undefined;
  sortable?: boolean | undefined;
  mobile?: boolean | undefined;
  children?: any[] | undefined;
  input?: Input | undefined;
  origem?: Origem | undefined;
  cellProps?: any | undefined;
}

export interface BtnExpandTable {
  actionExpanded?: Function | undefined;
  actionExpandedUndo?: Function | undefined;
  btnDisabled?: boolean | any | undefined;
  visivel?: boolean | undefined;
  noCloneItem?: boolean | undefined;
  badge?: Function | undefined;
}

export interface Sortable {
  action: Function;
  disabled?: boolean | undefined;
  color?: string | undefined;
}

type Anchor = "start" | "end" | "top" | "bottom" | "center" | "left" | "right";
interface ActionsModal {
  color?: string;
  icon?: string;
  text?: string;
  disabled?: boolean | (() => boolean);
  action?: () => void;
}

interface MoreOptions {
  visible?: boolean;
  color?: string;
  text?: string;
  size?: string;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  actions?: Array<ActionsModal> | undefined;
  location?: Anchor | undefined;
}

export interface ExportarExcel {
  exibir: boolean;
  titulo: string;
  descricao?: string | (() => string);
}

interface BotoesToolbar {
  visible?: boolean;
  color?: string;
  text?: string;
  size?: string;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  actions?: Array<ActionsModal> | undefined;
  location?: Anchor | undefined;
  exportarExcel?: ExportarExcel;
}

export interface DataTable {
  items: Array<any>;
  selecionados?: any[] | [];
  actionSelecionar?: Function | undefined;
  fixOrderBy?: boolean | undefined;
  headers: Array<HeadersTable>;
  title?: string | undefined;
  mensagemSemRegistros?: string | undefined;
  height?: number | string | undefined;
  itemValue?: string | undefined;
  returnObject?: boolean | undefined;
  heightAuto?: boolean | undefined;
  selecionar?: boolean | undefined;
  selectStrategy?: "page" | "single" | "all" | undefined;
  campoInputEditModoEdicao?: boolean | undefined;
  campoInputEditReverse?: boolean | undefined;
  campoInputInteiro?: boolean | undefined;
  casasDecimaisCampoEditInput?: number;
  toolBarGrid?: boolean | undefined;
  sortable?: Sortable | undefined;
  semRodape?: boolean | undefined;
  selecionadosMostrar?: boolean | undefined;
  registrosPorPagina?: number;
  sorted?: Function | undefined;
  fnSearch?: FilterFunction | undefined;
  btnExpandTable?: BtnExpandTable | undefined;
  search?: string | undefined;
  /**@example [{ key: "id", order: "desc" }] */
  sortBy?: any | undefined;
  moreOptions?: MoreOptions;
  botoesToolbar?: BotoesToolbar;
  showSearchField?: boolean;
  exportarExcelConfig?: ExportarExcel;
}

export type FilterMatch = boolean | number | [number, number] | [number, number][];
export type FilterFunction = (value: string, query: string, item?: any) => FilterMatch;
