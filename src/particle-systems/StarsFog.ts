import { Scene } from '@babylonjs/core'
import { Texture } from '@babylonjs/core/Materials'
import { Color4, Vector3 } from '@babylonjs/core/Maths'
import { Mesh } from '@babylonjs/core/Meshes'
import { GPUParticleSystem, ParticleSystem } from '@babylonjs/core/Particles'
import smokeURL from '../assets/smoke.png'

type Options = {
  capacity: number
}

export function useStarsFog(scene: Scene, emitter: Mesh, options: Options = { capacity: 1000 }) {
  const particles = GPUParticleSystem.IsSupported
    ? new GPUParticleSystem('starsFog', { capacity: options.capacity }, scene)
    : new ParticleSystem('starsFog', options.capacity, scene)

  particles.isBillboardBased = true
  particles.isLocal = true
  particles.maxEmitPower = options.capacity
  particles.minEmitBox = new Vector3(-250, -250, -250)
  particles.maxEmitBox = new Vector3(250, 250, 250)

  const texture = new Texture(smokeURL, scene)
  particles.particleTexture = texture

  particles.color1 = new Color4(0.04, 0.08, 0.45, 0.05)
  particles.color2 = new Color4(0.35, 0.35, 0.47, 0.1)
  particles.colorDead = new Color4(0.25, 0.25, 0.25, 0.1)
  particles.minSize = 5
  particles.maxSize = 90
  particles.minLifeTime = Number.MAX_SAFE_INTEGER
  particles.emitRate = options.capacity * 100
  particles.blendMode = ParticleSystem.BLENDMODE_MULTIPLYADD
  particles.gravity = new Vector3(0, 0, 0)
  particles.direction1 = new Vector3(0, 0, 0)
  particles.direction2 = new Vector3(0, 0, 0)
  particles.updateSpeed = 0.001

  particles.emitter = emitter
  particles.start()

  return { starsFog: particles }
}
