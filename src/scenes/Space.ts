import { Scene } from '@babylonjs/core'
import { ArcRotateCamera } from '@babylonjs/core/Cameras'
import { Engine } from '@babylonjs/core/Engines'
import { Vector3 } from '@babylonjs/core/Maths'
import { useInput } from '../input/Input'
import { useStarsFog } from '../particle-systems/StarsFog'
import { useStars } from '../skydomes/Stars'

export function useSpaceScene(engine: Engine) {
  const scene = new Scene(engine)

  const camera = new ArcRotateCamera('camera', 0, Math.PI / 2.5, 20, Vector3.Zero(), scene)
  camera.lowerRadiusLimit = camera.upperRadiusLimit = 1
  camera.lowerBetaLimit = Math.PI / 5
  camera.upperBetaLimit = Math.PI / 1.5
  camera.minZ = 0.01
  camera.angularSensibilityX = 2000
  camera.angularSensibilityY = 2000
  camera.inertialRadiusOffset = 0
  camera.useAutoRotationBehavior = false
  camera.attachControl(window, true)

  const { skydome } = useStars(scene)
  useStarsFog(scene, skydome)
  const input = useInput(scene)

  input.bindAxis({name: "accelerate", callback: (amount) => { console.log(amount) }})


  return { scene }
}
