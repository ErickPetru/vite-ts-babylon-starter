/**
 * TODOs
 * Create binding for all these inputs
 * 
 * 
 * [ ] - Mouse Right
 * [ ] - Mouse Left
 * [ ] - Mouse Middle
 * [ ] - Mouse Wheel
 * [ ] - Mouse X
 * [ ] - Mouse Y
 * 
 * [ ] - Keyboard All
 * 
 * [ ] - Gamepad Left Stick X
 * [ ] - Gamepad Left Stick Y
 * [ ] - Gamepad Right Stick X
 * [ ] - Gamepad Right Stick Y
 * [ ] - Gamepad Left Trigger
 * [ ] - Gamepad Right Trigger
 * [ ] - Gamepad DPad Up
 * [ ] - Gamepad DPad Down
 * [ ] - Gamepad DPad Left
 * [ ] - Gamepad DPad Right
 * 
 * 
 */




import { GamepadManager, KeyboardEventTypes, KeyboardInfo, PointerEventTypes, PointerInfo, Scene } from "@babylonjs/core";
import { ControlSetup } from "./Controls";
import { BindAction, BindAxis } from "./types/BindingTypes";

type BindingActionMap = {
  [name: string]: Array<() => void>
}

type BindingAxisMap = {
  [name: string]: Array<(amount: number) => void>
}

export class InputHandler {
  
  private scene: Scene;
  private static instance: InputHandler | null = null;
  private actionPressedBindings: BindingActionMap = {};
  private actionReleasedBindings: BindingActionMap = {};
  private axisBindings: BindingAxisMap = {};
  private gamepadManager: GamepadManager;

  private constructor(scene: Scene) {
    this.scene = scene;
    this.gamepadManager = new GamepadManager(scene);
    this.startObservables()
  }

  public static getInstance(scene: Scene): InputHandler {
    if (!InputHandler.instance) {
      InputHandler.instance = new InputHandler(scene);
    }
    return InputHandler.instance;
  }

  public addActionPressed(action: BindAction) {
    if(!this.actionPressedBindings[action.name]) {
      this.actionPressedBindings[action.name] = [action.callback]
    }
    this.actionPressedBindings[action.name].push(action.callback)
  }

  public addActionReleased(action: BindAction) {
    this.actionReleasedBindings[action.name].push(action.callback)
  }

  public addAxis(axis: BindAxis) {
    if(!this.axisBindings[axis.name]) {
      this.axisBindings[axis.name] = [axis.callback]
    }
    else {
      this.axisBindings[axis.name].push(axis.callback)
    }
  }

  public executeActionPressed(button: string) {
    const actionName = this.getActionsNameByButton(button).action
    if(actionName)
      this.actionPressedBindings[actionName].forEach(callback => callback())
  }

  public executeActionReleased(button: string) {
    
  }

  public executeAxis(button: string, amount: number) {
    // TODO search on control map buttons for actionName
    const axisName = this.getActionsNameByButton(button).axis
    console.log(axisName)
    if(axisName)
      this.axisBindings[axisName!]?.forEach(callback => callback(amount))
  }


  private startObservables(){
    console.log('staring observables')
    this.scene.onKeyboardObservable.add((keyboardInfo) => {
      this.keyboardHandler(keyboardInfo)
    });

    this.scene.onPointerObservable.add((pointerInfo) => {
      this.mouseHandler(pointerInfo)
    })

    this.gamepadHandler()
  }

  private keyboardHandler(keyboardInfo: KeyboardInfo) {
    const isPressed = keyboardInfo.type === KeyboardEventTypes.KEYDOWN
    const key = keyboardInfo.event.key
    if (isPressed) {
      // console.log('key pressed', key)
      this.executeActionPressed(key)
      this.executeAxis(key, 1)
    } else {
      // this.executeActionReleased(key)
    }
  }

  private mouseHandler(pointerInfo: PointerInfo) {
    // There are more then down and up for mouses
    // TODO scroll the wheel is 1 also, we should check for event types
    const isPressed = pointerInfo.type === PointerEventTypes.POINTERDOWN
    const isReleased = pointerInfo.type === PointerEventTypes.POINTERUP

    const button = pointerInfo.event.button.toString()
    if (isPressed) {
      this.executeActionPressed(button)
    }
  }

  private gamepadHandler() {
      this.gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
        // @ts-ignore
        gamepad.onButtonDownObservable.add((button, state) => {
          console.log(button)
        })

        gamepad.onleftstickchanged((values) => {
          console.log(values.x, values.y)
        })

        // TODO by device

      }
    )
  }


  //TODO remove this and create a map with buttons being the key of the object
  private getActionsNameByButton(button: string) {
    let action
    let axis
    if(ControlSetup.actionMappings) {
        action = Object.keys(ControlSetup.actionMappings!).find(actionName => {
        const buttons = ControlSetup.actionMappings![actionName]
        return buttons.includes(button)
      })
    }
    if(ControlSetup.axisMappings){
      axis = Object.keys(ControlSetup.axisMappings!).find(axisName => {
        const axisMap = ControlSetup.axisMappings![axisName]
        return axisMap.find(axisButton => axisButton.button === button)
      })
    }

    return {
      axis,
      action
    }
  }

}