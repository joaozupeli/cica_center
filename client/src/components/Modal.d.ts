export interface ActionsModal {
  color?: string | undefined;
  class?: string | undefined;
  icon?: string | undefined;
  text?: string | undefined;
  size?: string | undefined;
  title?: string | undefined;
  disabled?: boolean | undefined;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  action?: any | undefined;
  id?: string | undefined;
  visible?: boolean;
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

declare const block: readonly ["top", "bottom"];
declare const inline: readonly ["start", "end", "left", "right"];
type Tblock = (typeof block)[number];
type Tinline = (typeof inline)[number];
type Anchor =
  | Tblock
  | Tinline
  | "center"
  | "center center"
  | `${Tblock} ${Tinline | "center"}`
  | `${Tinline} ${Tblock | "center"}`;

export interface Modal {
  moving?: boolean | undefined;
  fullScreen?: boolean | undefined;
  camposObrigatorios?: boolean | undefined;
  title?: string | undefined;
  textButton?: string | undefined;
  class?: string | undefined;
  colorButton?: string | undefined;
  variantButton?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  height?: string | number | undefined;
  width?: string | number | undefined;
  actions?: Array<ActionsModal> | undefined;
  idsVisibleActions?: Array<string>;
  moreOptions?: MoreOptions;
  toolbarButtons?: Array<Actions>;
  contentDense?: boolean | undefined;
}
