export interface SelectAll {
  id?: string | undefined;
  clearable?: boolean | undefined;
  hideDetails?: boolean | undefined;
  disabled?: boolean | undefined;
  density?: "default" | "comfortable" | "compact";
  variant?:
    | "outlined"
    | "plain"
    | "solo"
    | "filled"
    | "underlined"
    | "solo-inverted"
    | "solo-filled";
  items?: any[];
  itemValue: string;
  itemTitle: string;
  label?: string | undefined;
  multiple?: boolean | undefined;
  required?: boolean | undefined;
  action?: Function | undefined;
  rules?: any | undefined;
}
