import {
  DualShockButton,
  DualShockPad,
  GamepadManager,
  PointerInfo,
  Scene,
  Xbox360Button,
  Xbox360Pad,
} from '@babylonjs/core'
import { ControlSetup } from './Controls'
import { BindAxis } from './types/BindingTypes'

type AxisBindingCallback = (amount: number) => void
type ActionBindingCallback = () => void

enum CallbackTypes {
  Axis = 'Axis',
  Action = 'Action',
}

export class InputHandler {
  private scene: Scene
  private static instance: InputHandler | null = null

  /**
   * A list of aliases for functions and all buttons that trigger that function
   * @example
   * {
   *  'moveForward': [{ button: 'W', scale: 1 }, {button: 'gamepadLeftStickY', scale: 1}, {button: 'S', scale: -1} ],
   * }
   */
  private aliasToButtonMap: Map<string, { button: string; scale: number }[]> = new Map()
  /**
   * A list of buttons binded to functions and the scale of the button
   * The scale will be multiplied by the amount of the axis
   * @example
   * {
   *  'W': {scale: 1, callback: moveForwardFunction},
   *  'S': {scale: -1, callback: moveForwardFunction},
   * }
   */
  private buttonToFunctionMap: Map<
    string,
    { scale?: number; callback?: AxisBindingCallback | ActionBindingCallback; callbackType?: CallbackTypes }
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
        `No configuration found for "${axis.name}" that was binded to ${axis.callback.name} function, configure it in GameControls.json.`
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

  private executeAxis(button: string, amount: number) {
    const buttonFunction = this.buttonToFunctionMap.get(button)
    console.log('buttonFunction', buttonFunction)
    if (!buttonFunction) return
    if (buttonFunction.callback === undefined) {
      console.warn('Button was configured in settings, but not binded to any function', button)
      return
    }
    if (buttonFunction.callbackType === CallbackTypes.Axis) {
      console.log(' executing axis')
      if (!buttonFunction.scale) throw new Error('Button was configured as axis, but no scale was defined')
      buttonFunction.callback(buttonFunction.scale * amount)
    }
  }

  // This will be called once just in the startup of the game to generate the maps
  private generateMaps() {
    this.generateAxisBindingsMap()
  }

  private generateAxisBindingsMap() {
    if (!ControlSetup.axisMappings) {
      console.warn('No axis mapping defined. Check GameControls file.')
      return
    }
    // TODO read from json
    Object.keys(ControlSetup.axisMappings).forEach((axisName) => {
      const buttonsSettings = ControlSetup.axisMappings?.[axisName]
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

  private startObservables() {
    this.keyboardHandler()

    this.scene.onPointerObservable.add((pointerInfo) => {
      this.mouseHandler(pointerInfo)
    })

    this.gamepadHandler()
  }

  private keyboardHandler() {
    this.scene.onKeyboardObservable.add((keyboardInfo) => {
      this.executeAxis(keyboardInfo.event.key, 1)
      // this.executeAction()
    })
  }

  private mouseHandler(pointerInfo: PointerInfo) {
    // There are more then down and up for mouses
    // TODO scroll the wheel is 1 also, we should check for event types
    // const isPressed = pointerInfo.type === PointerEventTypes.POINTERDOWN
    // const isReleased = pointerInfo.type === PointerEventTypes.POINTERUP
    // const button = pointerInfo.event.button.toString()
    // if (isPressed) {
    //   this.executeActionPressed(button)
    // }
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
          this.executeAxis('gamepadLeftStickX', x)
          this.executeAxis('gamepadLeftStickY', y)
        })
        gamepad.onrightstickchanged(({ x, y }) => {
          if (this.checkDeadZone(x, y)) return
          this.executeAxis('gamepadRightStickX', x)
          this.executeAxis('gamepadRightStickY', y)
        })
        gamepad.onrighttriggerchanged((value) => {
          this.executeAxis('gamepadRightTrigger', value)
        })
        gamepad.onlefttriggerchanged((value) => {
          this.executeAxis('gamepadLeftTrigger', value)
        })
        gamepad.ondpaddown((button) => {
          if (button === 12) this.executeAxis('gamepadDPadUp', 1)
          if (button === 13) this.executeAxis('gamepadDPadDown', 1)
          if (button === 14) this.executeAxis('gamepadDPadLeft', 1)
          if (button === 15) this.executeAxis('gamepadDPadRight', 1)
        })
        gamepad.onbuttondown((button: DualShockButton | Xbox360Button) => {
          switch (button) {
            case Xbox360Button.A || DualShockButton.Cross:
              this.executeAxis('gamepadFaceButtonBottom', 1)
              break
            case Xbox360Button.B || DualShockButton.Circle:
              this.executeAxis('gamepadFaceButtonRight', 1)
              break
            case Xbox360Button.X || DualShockButton.Square:
              this.executeAxis('gamepadFaceButtonLeft', 1)
              break
            case Xbox360Button.Y || DualShockButton.Triangle:
              this.executeAxis('gamepadFaceButtonTop', 1)
              break
            case Xbox360Button.LB || DualShockButton.L1:
              this.executeAxis('gamepadLeftShoulder', 1)
              break
            case Xbox360Button.RB || DualShockButton.R1:
              this.executeAxis('gamepadRightShoulder', 1)
              break
            case Xbox360Button.Back || DualShockButton.Share:
              this.executeAxis('gamepadSelect', 1)
              break
            case Xbox360Button.Start || DualShockButton.Options:
              this.executeAxis('gamepadStart', 1)
              break
            case Xbox360Button.LeftStick || DualShockButton.LeftStick:
              this.executeAxis('gamepadLeftStickPress', 1)
              break
            case Xbox360Button.RightStick || DualShockButton.RightStick:
              this.executeAxis('gamepadRightStickPress', 1)
              break
            default:
              break
          }
        })
        // gamepad.ondpadup((button) => {

        // })
      }
    })
  }
}
