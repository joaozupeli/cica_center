interface ActionsAlert {
  type?: string;
  color?: string;
  class?: string;
  icon?: string;
  text?: string;
  size?: string;
  variant?: any;
  action?: Function | undefined;
}

interface Alert {
  visible?: boolean;
  text?: string;
  color?: string;
  icon?: string;
  title?: string;
  width?: string;
  size?: string;
  actions?: Array<ActionsAlert> | undefined;
}
