export type ActionCallback = () => void;
export type AxisCallback = (amount: number) => void;

export enum ActionType {
  Pressed = 1,
  Released = 2,
}

export type BindAction = {
  name: string;
  type: ActionType;
  callback: ActionCallback;
}

export type BindAxis = {
  name: string;
  callback: AxisCallback;
}