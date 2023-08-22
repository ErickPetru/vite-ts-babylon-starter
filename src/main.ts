import { useGame } from './Game'
import './style.css'

window.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas')
  if (!canvas) throw new Error('Canvas not found. Please review your HTML.')

  const { run, resize } = await useGame(canvas)
  window.addEventListener('resize', resize)
  run()
})
