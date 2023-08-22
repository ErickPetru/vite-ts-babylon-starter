import { Scene } from '@babylonjs/core'
import { FreeCamera } from '@babylonjs/core/Cameras'
import { Engine } from '@babylonjs/core/Engines'
import { HemisphericLight } from '@babylonjs/core/Lights'
import { Vector3 } from '@babylonjs/core/Maths'
import { MeshBuilder } from '@babylonjs/core/Meshes'

export function usePlaygroundDefaultScene(engine: Engine) {
  const scene = new Scene(engine)

  const camera = new FreeCamera('camera', new Vector3(0, 5, -10), scene)
  camera.setTarget(Vector3.Zero())
  camera.attachControl(window, true)

  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene)
  sphere.position.y = 1

  const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)
  ground.position.y = 0

  return { scene }
}
