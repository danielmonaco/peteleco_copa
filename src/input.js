// Mecânica de peteleco (slingshot). CORE-03.
// computeFlick é pura e testável; o wiring de Pointer Events está em game.js (T10).
import { MIN_DRAG, MAX_DRAG, MAX_SPEED, BALL_RADIUS } from './constants.js'

// Mapeia (posição da bola, posição do ponteiro) -> direção/força do disparo.
// Direção é OPOSTA ao arrasto (puxa pra trás, como estilingue).
export function computeFlick(ballPos, pointerPos, opts = {}) {
  const minDrag = opts.minDrag ?? MIN_DRAG
  const maxDrag = opts.maxDrag ?? MAX_DRAG
  const maxSpeed = opts.maxSpeed ?? MAX_SPEED

  const dx = pointerPos.x - ballPos.x
  const dy = pointerPos.y - ballPos.y
  const dragLen = Math.hypot(dx, dy)

  if (dragLen < minDrag) {
    return { fired: false, dragLen, power: 0, dir: { x: 0, y: 0 }, vx: 0, vy: 0 }
  }

  const dirx = -dx / dragLen
  const diry = -dy / dragLen
  const power = Math.min(dragLen, maxDrag)
  const speed = (power / maxDrag) * maxSpeed
  return {
    fired: true,
    dragLen,
    power,
    dir: { x: dirx, y: diry },
    vx: dirx * speed,
    vy: diry * speed,
  }
}

// true se o ponteiro caiu sobre a bola (com margem generosa p/ toque).
export function isPointerOnBall(ball, pointerPos, margin = 22) {
  const d = Math.hypot(pointerPos.x - ball.x, pointerPos.y - ball.y)
  return d <= (ball.radius ?? BALL_RADIUS) + margin
}
