import { Scene } from '@babylonjs/core'
import { InputHandler } from './InputHandler'
import { ActionType, BindAction, BindAxis } from './types/BindingTypes'

export function useInput(scene: Scene) {
  const inputHandler = InputHandler.getInstance(scene)
  // Binds action to a function
  function bindAction(action: BindAction) {
    if (action.type === ActionType.Pressed) {
      // inputHandler.addActionPressed(action)
    } else {
      // inputHandler.addActionReleased(action)
    }
  }

  // Binds axis to a function
  function bindAxis(axis: BindAxis) {
    inputHandler.addAxis(axis)
  }

  return { bindAction, bindAxis }
}
