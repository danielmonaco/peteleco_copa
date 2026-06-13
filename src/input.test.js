import { describe, it, expect } from 'vitest'
import { computeFlick } from './input.js'
import { MIN_DRAG, MAX_DRAG, MAX_SPEED } from './constants.js'

const ball = { x: 300, y: 450 }

describe('computeFlick (CORE-03)', () => {
  it('direção é oposta ao arrasto (puxa pra trás) e unitária', () => {
    // ponteiro arrastado para baixo-direita -> disparo para cima-esquerda
    const f = computeFlick(ball, { x: ball.x + 100, y: ball.y + 100 })
    expect(f.fired).toBe(true)
    expect(f.dir.x).toBeLessThan(0)
    expect(f.dir.y).toBeLessThan(0)
    expect(Math.hypot(f.dir.x, f.dir.y)).toBeCloseTo(1, 6)
  })

  it('arrasto < MIN_DRAG não dispara nem gera velocidade', () => {
    const f = computeFlick(ball, { x: ball.x + (MIN_DRAG - 5), y: ball.y })
    expect(f.fired).toBe(false)
    expect(f.vx).toBe(0)
    expect(f.vy).toBe(0)
  })

  it('força cresce com o arrasto e satura no teto MAX_DRAG', () => {
    const mid = computeFlick(ball, { x: ball.x + 100, y: ball.y })
    const far = computeFlick(ball, { x: ball.x + MAX_DRAG + 200, y: ball.y })
    expect(far.power).toBeGreaterThan(mid.power)
    expect(far.power).toBe(MAX_DRAG)
    // no teto, a velocidade satura em MAX_SPEED
    expect(Math.hypot(far.vx, far.vy)).toBeCloseTo(MAX_SPEED, 4)
  })

  it('velocidade é proporcional à fração do arrasto', () => {
    const f = computeFlick(ball, { x: ball.x + MAX_DRAG / 2, y: ball.y })
    expect(Math.hypot(f.vx, f.vy)).toBeCloseTo(MAX_SPEED / 2, 4)
  })
})
