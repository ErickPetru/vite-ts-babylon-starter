import { Keyboard } from './devices/Devices'
import { ActionMapping, AxisMapping, Controls } from './types/ControlsInterface'

// TODO move this to a json file
const axisMappings: AxisMapping = {
  accelerate: [
    { button: Keyboard.W, scale: 1 },
    { button: 'gamepadRightTrigger', scale: 1 },
  ],
  decelerate: [
    { button: Keyboard.S, scale: 1 },
    { button: 'gamepadLeftTrigger', scale: 1 },
  ],
  turnRight: [
    { button: Keyboard.D, scale: 1 },
    { button: Keyboard.A, scale: -1 },
    { button: 'gamepadLeftStickX', scale: 1 },
  ],
  lookRight: [
    { button: 'gamepadRightStickX', scale: 1 },
    { button: 'ArrowRight', scale: 1 },
    { button: 'ArrowLeft', scale: -1 },
  ],
}

const actionMappings: ActionMapping = {
  shoot: [Keyboard.F],
}

export const ControlSetup: Controls = {
  axisMappings,
  actionMappings,
}
