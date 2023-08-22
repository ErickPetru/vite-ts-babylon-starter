import { Scene } from '@babylonjs/core'
import { CustomProceduralTexture, Effect, StandardMaterial } from '@babylonjs/core/Materials'
import { MeshBuilder } from '@babylonjs/core/Meshes'
import { starsMapPixelShader } from '../shaders/stars'

type Options = {
  diameter: number
  resolution: number
}

export function useStars(scene: Scene, options: Options = { diameter: 2000, resolution: 2048 }) {
  Effect.ShadersStore['starsMapPixelShader'] = starsMapPixelShader

  const texture = new CustomProceduralTexture(
    'starsTexture',
    'starsMap',
    {
      width: options.resolution * 2,
      height: options.resolution,
    },
    scene
  )
  texture.refreshRate = 2
  texture.setFloat('time', 0)

  const material = new StandardMaterial('starsMaterial', scene)
  material.emissiveTexture = texture
  material.disableLighting = true
  material.backFaceCulling = false

  const sphere = MeshBuilder.CreateSphere(
    'skydome',
    {
      diameter: options.diameter,
      segments: 32,
    },
    scene
  )
  sphere.material = material

  let time = 0
  scene.registerBeforeRender(() => {
    texture.setFloat('time', time)
    time++
  })

  return { skydome: sphere }
}
