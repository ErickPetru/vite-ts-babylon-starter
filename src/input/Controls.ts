
import { GamePadAxis, Keyboard } from "./devices/Devices";
import { ActionMapping, AxisMapping, Controls } from "./types/ControlsInterface";

// TODO move this to a json file
const axisMappings: AxisMapping  = {
  "accelerate": [
    {"button": Keyboard.W, "scale": 1}, 
    {"button": GamePadAxis.RightTrigger, "scale": 1}
  ],
  "decelerate": [
    {"button": Keyboard.S, "scale": 1}, 
    {"button": GamePadAxis.RightTrigger, "scale": 1}
  ],
  "turnRight":  [
    {"button": Keyboard.D, "scale": 1}, 
    {"button": Keyboard.A, "scale": -1}, 
    {"button": GamePadAxis.LeftStickX, "scale": 1}
  ],
}

const actionMappings: ActionMapping = {
  "shoot": [Keyboard.F],
}

export const ControlSetup: Controls = {
  axisMappings, 
  actionMappings
}