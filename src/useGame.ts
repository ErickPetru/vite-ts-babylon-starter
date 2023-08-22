import { EngineFactory } from "@babylonjs/core/Engines"
import { KeyboardEventTypes } from "@babylonjs/core/Events"
import { Inspector } from "@babylonjs/inspector"
import { usePlaygroundScene } from "./scenes/usePlaygroundScene"

export async function useGame(canvas: HTMLCanvasElement) {
  canvas.style.width = "100%"
  canvas.style.height = "100%"

  const engine = await EngineFactory.CreateAsync(canvas, {})
  const { scene } = usePlaygroundScene(engine)

  const run = () => {
    engine.runRenderLoop(() => {
      scene.render()
    })

    canvas.addEventListener("pointerdown", () => {
      engine.enterPointerlock()
    })

    scene.onKeyboardObservable.add((info) => {
      // Ctrl + Alt + I to toggle inspector.
      if (
        info.type === KeyboardEventTypes.KEYDOWN &&
        info.event.ctrlKey &&
        info.event.altKey &&
        info.event.code === "KeyI"
      ) {
        toggleInspector()
      }
    })
  }

  const toggleInspector = () => {
    if (Inspector.IsVisible) {
      Inspector.Hide()
    } else {
      Inspector.Show(scene, {})
    }
  }

  const resize = () => {
    engine.resize()
  }

  return {
    run,
    resize,
  }
}
