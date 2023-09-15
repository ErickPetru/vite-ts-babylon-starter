import {
  DualShockButton,
  DualShockPad,
  GamepadManager,
  PointerEventTypes,
  PointerInfo,
  Scene,
  Xbox360Button,
  Xbox360Pad,
} from '@babylonjs/core'
import { DevicesKeys } from './devices/Devices'
import { ActionType, BindAction, BindAxis } from './types/BindingTypes'
import { ActionMapping, AxisMapping } from './types/ControlsInterface'

enum CallbackTypes {
  Axis = 'Axis',
  Action = 'Action',
}

export class InputHandler {
  private scene: Scene
  private static instance: InputHandler

  /**
   * A list of aliases for functions and all buttons that trigger that function
   * @example
   * {
   *  'moveForward': [{ button: 'W', scale: 1 }, {button: 'gamepadLeftStickY', scale: 1}, {button: 'S', scale: -1} ],
   * }
   */
  private aliasToButtonMap: Map<string, { button: string; scale?: number }[]> = new Map()
  /**
   * A list of buttons binded to functions and the scale of the button
   * The scale will be multiplied by the amount of the axis
   * @example
   * {
   *  'W': {scale: 1, callback: moveForwardFunction, callbackType: CallbackTypes.Axis},
   *  'S': {scale: -1, callback: moveForwardFunction, callbackType: CallbackTypes.Axis},
   *  'gamepadFaceButtonBottom_P': {callback: shootFunction, callbackType: CallbackTypes.Action, type: ActionType.Pressed},
   *  'gamepadFaceButtonBottom_R': {callback: stopShootingFunction, callbackType: CallbackTypes.Action, type: ActionType.Released},
   * }
   */
  private buttonToFunctionMap: Map<
    string,
    {
      scale?: number
      type?: ActionType
      callback?: Function
      callbackType?: CallbackTypes
    }
  > = new Map()

  private gamepadManager: GamepadManager

  private constructor(scene: Scene) {
    this.scene = scene
    this.gamepadManager = new GamepadManager(scene)
    this.generateMaps()
    this.startObservables()
  }

  public static getInstance(scene: Scene): InputHandler {
    if (!InputHandler.instance) {
      InputHandler.instance = new InputHandler(scene)
    }
    return InputHandler.instance
  }

  public addAxis(axis: BindAxis) {
    const buttonsToBind = this.aliasToButtonMap.get(axis.name)
    if (!buttonsToBind) {
      console.warn(
        `No configuration found for "${axis.name}" that was binded to a function, configure it in GameControls.json.`
      )
      return
    }
    buttonsToBind.forEach(({ button }) => {
      const buttonFunction = this.buttonToFunctionMap.get(button)
      if (buttonFunction) {
        buttonFunction.callback = axis.callback
      }
    })
  }

  public addAction(action: BindAction) {
    const buttonsToBind = this.aliasToButtonMap.get(action.name)
    if (!buttonsToBind) {
      console.warn(
        `No configuration found for "${action.name}" that was binded to a function, configure it in GameControls.json.`
      )
      return
    }
    buttonsToBind.forEach(({ button }) => {
      const buttonFunction = this.buttonToFunctionMap.get(button)
      if (buttonFunction) {
        // The same button can have the pressed function different than the released one, we should differentiate it
        const actionTypeString = action.type === ActionType.Released ? 'R' : 'P'
        if (button.split('_')[1] === actionTypeString) {
          buttonFunction.callback = action.callback
          buttonFunction.callbackType = CallbackTypes.Action
          buttonFunction.type = action.type
        }
      }
    })
  }

  private executeAxis(button: string, amount: number) {
    const buttonFunction = this.buttonToFunctionMap.get(button)
    if (!buttonFunction) return
    if (buttonFunction.callback === undefined) {
      console.warn(`Button [${button}] was configured in settings, but not binded to any function`)
      return
    }
    if (buttonFunction.callbackType === CallbackTypes.Axis) {
      if (!buttonFunction.scale) throw new Error('Button was configured as axis, but no scale was defined')
      buttonFunction.callback(buttonFunction.scale * amount)
    }
  }

  private executeAction(button: string, type: ActionType) {
    const buttonFunction = this.buttonToFunctionMap.get(`${button}_${type === ActionType.Pressed ? 'P' : 'R'}`)
    if (!buttonFunction) return
    if (buttonFunction.type !== type) return
    if (buttonFunction.callback === undefined) {
      console.warn(`Button [${button}] was configured in settings, but not binded to any function`)
      return
    }
    if (buttonFunction.callbackType === CallbackTypes.Action) {
      buttonFunction.callback()
    }
  }

  // This will be called once just in the startup of the game to generate the maps
  private generateMaps() {
    this.readControlsFile()
    const gameControls = localStorage.getItem('GameControls')
    if (!gameControls) throw new Error('GameControls removed from local storage.')
    const { actionMapping, axisMapping } = JSON.parse(gameControls)

    this.generateAxisBindingsMap(axisMapping as AxisMapping)
    this.generateActionBindingsMap(actionMapping as ActionMapping)
  }

  private generateAxisBindingsMap(axisMapping: AxisMapping) {
    if (!axisMapping) {
      console.warn('No axis mapping defined. Check GameControls file.')
      return
    }
    Object.keys(axisMapping).forEach((axisName) => {
      const buttonsSettings = axisMapping[axisName]
      if (!buttonsSettings) throw new Error('Axis mapping defined without buttons configuration.')

      this.aliasToButtonMap.set(
        axisName,
        buttonsSettings.map(({ button, scale }) => {
          return { button, scale }
        })
      )
      // Create the map for the functions even if they are not defined
      buttonsSettings.forEach((button) => {
        this.buttonToFunctionMap.set(button.button, {
          scale: button.scale,
          callback: undefined,
          callbackType: CallbackTypes.Axis,
        })
      })
    })
  }

  private generateActionBindingsMap(actionMapping: ActionMapping) {
    if (!actionMapping) {
      console.warn('No action mapping defined. Check GameControls file.')
      return
    }
    Object.keys(actionMapping).forEach((actionName) => {
      const buttonsSettings = actionMapping[actionName]
      if (!buttonsSettings) throw new Error('Action mapping defined without buttons configuration.')

      buttonsSettings.forEach((button) => {
        this.aliasToButtonMap.set(actionName, [{ button: `${button}_P` }, { button: `${button}_R` }])
      })

      this.aliasToButtonMap.get(actionName)?.forEach(({ button }) => {
        this.buttonToFunctionMap.set(button, {
          callback: undefined,
          callbackType: CallbackTypes.Action,
          type: button.split('_')[1] === 'P' ? ActionType.Pressed : ActionType.Released,
        })
      })
    })
  }

  private startObservables() {
    this.keyboardHandler()
    this.mouseHandler()
    this.gamepadHandler()
  }

  private keyboardHandler() {
    this.scene.onKeyboardObservable.add((keyboardInfo) => {
      this.executeAxis(keyboardInfo.event.key, 1)
      this.executeAction(keyboardInfo.event.key, keyboardInfo.type === 1 ? ActionType.Pressed : ActionType.Released)
    })
  }

  private mouseHandler() {
    this.scene.onPointerObservable.add((pointerInfo) => {
      const { type } = pointerInfo
      if (type === PointerEventTypes.POINTERDOWN) {
        this.callMouseFunctions(pointerInfo, ActionType.Pressed)
        return
      }
      if (type === PointerEventTypes.POINTERUP) {
        this.callMouseFunctions(pointerInfo, ActionType.Released)
        return
      }
      if (type === PointerEventTypes.POINTERMOVE) {
        this.executeAxis(DevicesKeys.mouseX, pointerInfo.event.movementX)
        this.executeAxis(DevicesKeys.mouseY, pointerInfo.event.movementY)
        return
      }
      if (type === PointerEventTypes.POINTERWHEEL) {
        const event = pointerInfo.event as WheelEvent
        if (event.deltaY > 0) this.executeAxis(DevicesKeys.mouseWheelUp, 1)
        if (event.deltaY < 0) this.executeAxis(DevicesKeys.mouseWheelDown, 1)
        return
      }
    })
  }

  private callMouseFunctions = (pointerInfo: PointerInfo, type: ActionType) => {
    const {
      event: { inputIndex: index },
    } = pointerInfo
    if (index === 2) {
      this.executeAction(DevicesKeys.mouseLeftButton, type)
    }
    if (index === 3) {
      this.executeAction(DevicesKeys.mouseMiddleButton, type)
    }
    if (index === 4) {
      this.executeAction(DevicesKeys.mouseRightButton, type)
    }
    if (index === 5) {
      this.executeAction(DevicesKeys.mouseAltBottom, type)
    }
    if (index === 6) {
      this.executeAction(DevicesKeys.mouseAltTop, type)
    }
  }

  // Minimal deadzone to avoid triggering stick events with small controller movements
  private checkDeadZone(x: number, y: number) {
    return Math.abs(x) < 0.1 && Math.abs(y) < 0.1
  }

  private gamepadHandler() {
    this.gamepadManager.onGamepadConnectedObservable.add((gamepad) => {
      if (gamepad instanceof Xbox360Pad || gamepad instanceof DualShockPad) {
        gamepad.onleftstickchanged(({ x, y }) => {
          if (this.checkDeadZone(x, y)) return
          this.executeAxis(DevicesKeys.gamepadLeftStickX, x)
          this.executeAxis(DevicesKeys.gamepadLeftStickY, y)
        })
        gamepad.onrightstickchanged(({ x, y }) => {
          if (this.checkDeadZone(x, y)) return
          this.executeAxis(DevicesKeys.gamepadRightStickX, x)
          this.executeAxis(DevicesKeys.gamepadRightStickY, y)
        })
        gamepad.onrighttriggerchanged((value) => {
          this.executeAxis(DevicesKeys.gamepadRightTrigger, value)
        })
        gamepad.onlefttriggerchanged((value) => {
          this.executeAxis(DevicesKeys.gamepadLeftTrigger, value)
        })
        gamepad.ondpaddown((button) => console.log(button))
        gamepad.ondpaddown((button) => this.callDpadFunctions(button, ActionType.Pressed))
        gamepad.ondpadup((button) => this.callDpadFunctions(button, ActionType.Released))
        gamepad.onbuttondown((button) => this.callGamepadFunctions(button, ActionType.Pressed))
        gamepad.onbuttonup((button) => this.callGamepadFunctions(button, ActionType.Released))
      }
    })
  }

  private callDpadFunctions = (button: number, type: ActionType) => {
    switch (button) {
      case 12:
        this.executeAxis(DevicesKeys.gamepadDPadUp, 1)
        this.executeAction(DevicesKeys.gamepadDPadUp, type)
        break
      case 13:
        this.executeAxis(DevicesKeys.gamepadDPadDown, 1)
        this.executeAction(DevicesKeys.gamepadDPadDown, type)
        break
      case 14:
        this.executeAxis(DevicesKeys.gamepadDPadLeft, 1)
        this.executeAction(DevicesKeys.gamepadDPadLeft, type)
        break
      case 15:
        this.executeAxis(DevicesKeys.gamepadDPadRight, 1)
        this.executeAction(DevicesKeys.gamepadDPadRight, type)
        break
      default:
        break
    }
  }

  private callGamepadFunctions = (button: DualShockButton | Xbox360Button, type: ActionType) => {
    switch (button) {
      case Xbox360Button.A || DualShockButton.Cross:
        this.executeAxis(DevicesKeys.gamepadFaceButtonBottom, 1)
        this.executeAction(DevicesKeys.gamepadFaceButtonBottom, type)
        break
      case Xbox360Button.B || DualShockButton.Circle:
        this.executeAxis(DevicesKeys.gamepadFaceButtonRight, 1)
        this.executeAction(DevicesKeys.gamepadFaceButtonRight, type)
        break
      case Xbox360Button.X || DualShockButton.Square:
        this.executeAxis(DevicesKeys.gamepadFaceButtonLeft, 1)
        this.executeAction(DevicesKeys.gamepadFaceButtonLeft, type)
        break
      case Xbox360Button.Y || DualShockButton.Triangle:
        this.executeAxis(DevicesKeys.gamepadFaceButtonTop, 1)
        this.executeAction(DevicesKeys.gamepadFaceButtonTop, type)
        break
      case Xbox360Button.LB || DualShockButton.L1:
        this.executeAxis(DevicesKeys.gamepadLeftShoulder, 1)
        this.executeAction(DevicesKeys.gamepadLeftShoulder, type)
        break
      case Xbox360Button.RB || DualShockButton.R1:
        this.executeAxis(DevicesKeys.gamepadRightShoulder, 1)
        this.executeAction(DevicesKeys.gamepadRightShoulder, type)
        break
      case Xbox360Button.Back || DualShockButton.Share:
        this.executeAxis(DevicesKeys.gamepadSelect, 1)
        this.executeAction(DevicesKeys.gamepadSelect, type)
        break
      case Xbox360Button.Start || DualShockButton.Options:
        this.executeAxis(DevicesKeys.gamepadStart, 1)
        this.executeAction(DevicesKeys.gamepadStart, type)
        break
      case Xbox360Button.LeftStick || DualShockButton.LeftStick:
        this.executeAxis(DevicesKeys.gamepadLeftStickButton, 1)
        this.executeAction(DevicesKeys.gamepadLeftStickButton, type)
        break
      case Xbox360Button.RightStick || DualShockButton.RightStick:
        this.executeAxis(DevicesKeys.gamepadRightStickButton, 1)
        this.executeAction(DevicesKeys.gamepadRightStickButton, type)
        break
      default:
        break
    }
  }

  private readControlsFile() {
    try {
      // Read json and save it to the local storage to be able to listen to changes
      fetch('src/input/GameControls.json').then((res) => {
        res.json().then((controls) => {
          localStorage.setItem('GameControls', JSON.stringify(controls))
        })
      })
    } catch (e) {
      console.log(e)
      throw new Error('Could not read GameControls.json file. Check if it exists and is valid.')
    }
  }
}
