import { Scene } from '@babylonjs/core'
import { InputHandler } from './InputHandler'
import { BindAction, BindAxis } from './types/BindingTypes'

export function useInput(scene: Scene) {
  const inputHandler = InputHandler.getInstance(scene)
  // Binds action to a function
  function bindAction(action: BindAction) {
    inputHandler.addAction(action)
  }

  // Binds axis to a function
  function bindAxis(axis: BindAxis) {
    inputHandler.addAxis(axis)
  }

  return { bindAction, bindAxis }
}
