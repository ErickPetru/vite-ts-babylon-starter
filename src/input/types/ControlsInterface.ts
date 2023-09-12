
type AxisButton = {
  button: string,
  scale: number
}

export type ActionMapping = {
  [name: string]: (string)[]
}

export type AxisMapping = {
  [name: string]: AxisButton[]
}

export interface Controls {
  actionMappings?: ActionMapping;
  axisMappings?: AxisMapping;
}