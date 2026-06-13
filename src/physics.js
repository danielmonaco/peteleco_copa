// Física da bola: integração com atrito alto, colisões e detecção de gol.
// CORE-02 (T4 integração/atrito, T7 colisões) e CORE-05 (T8 gol).
import {
  FIXED_DT, DAMP, V_STOP, STOP_FRAMES,
  RESTITUTION_WALL, RESTITUTION_PEG,
} from './constants.js'

export function applyImpulse(ball, vx, vy) {
  ball.vx = vx
  ball.vy = vy
  ball.stopCounter = 0
}

export function speedOf(ball) {
  return Math.hypot(ball.vx, ball.vy)
}

export function isBallStopped(ball) {
  return ball.vx === 0 && ball.vy === 0
}

// Detecta gol: centro da bola cruza a linha do gol entre as traves. CORE-05 / D-12.
export function checkGoal(ball, arena) {
  if (ball.x > arena.goalXMin && ball.x < arena.goalXMax) {
    if (ball.y <= arena.top) return 'top'
    if (ball.y >= arena.bottom) return 'bottom'
  }
  return null
}

// Reflexão círculo-parede com correção posicional (aberturas de gol não refletem).
function collideWalls(ball, a) {
  const r = ball.radius
  if (ball.x - r < a.left) {
    ball.x = a.left + r
    ball.vx = Math.abs(ball.vx) * RESTITUTION_WALL
  } else if (ball.x + r > a.right) {
    ball.x = a.right - r
    ball.vx = -Math.abs(ball.vx) * RESTITUTION_WALL
  }
  const inGoalX = ball.x > a.goalXMin && ball.x < a.goalXMax
  if (ball.y - r < a.top && !inGoalX) {
    ball.y = a.top + r
    ball.vy = Math.abs(ball.vy) * RESTITUTION_WALL
  } else if (ball.y + r > a.bottom && !inGoalX) {
    ball.y = a.bottom - r
    ball.vy = -Math.abs(ball.vy) * RESTITUTION_WALL
  }
}

// Reflexão círculo-círculo contra pegs estáticos (o peg não se move — D-01).
function collidePegs(ball, pegs) {
  for (const p of pegs) {
    const dx = ball.x - p.x
    const dy = ball.y - p.y
    const rr = ball.radius + p.radius
    const d2 = dx * dx + dy * dy
    if (d2 < rr * rr && d2 > 1e-9) {
      const d = Math.sqrt(d2)
      const nx = dx / d
      const ny = dy / d
      ball.x = p.x + nx * rr
      ball.y = p.y + ny * rr
      const vn = ball.vx * nx + ball.vy * ny
      if (vn < 0) {
        ball.vx -= (1 + RESTITUTION_PEG) * vn * nx
        ball.vy -= (1 + RESTITUTION_PEG) * vn * ny
      }
    }
  }
}

// Avança um passo de física fixo. Retorna 'top'|'bottom' se houve gol, senão null.
// Usa substeps por distância (<= radius/2) para evitar tunneling em alta velocidade.
export function step(state, dt = FIXED_DT) {
  const b = state.ball
  const a = state.arena
  b.px = b.x
  b.py = b.y
  const speed = Math.hypot(b.vx, b.vy)
  if (speed === 0) return null

  const dist = speed * dt
  const nSub = Math.max(1, Math.ceil(dist / (b.radius * 0.5)))
  const sdt = dt / nSub
  let goal = null
  for (let i = 0; i < nSub && !goal; i++) {
    b.x += b.vx * sdt
    b.y += b.vy * sdt
    goal = checkGoal(b, a)
    if (!goal) {
      collideWalls(b, a)
      collidePegs(b, state.pegs)
    }
  }

  // Atrito: damping forte por passo + assentar abaixo do limiar.
  b.vx *= DAMP
  b.vy *= DAMP
  const sp = Math.hypot(b.vx, b.vy)
  if (sp < V_STOP) {
    b.stopCounter = (b.stopCounter || 0) + 1
    if (b.stopCounter >= STOP_FRAMES) {
      b.vx = 0
      b.vy = 0
      b.stopCounter = 0
    }
  } else {
    b.stopCounter = 0
  }

  return goal
}
