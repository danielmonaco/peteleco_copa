import { describe, it, expect } from 'vitest'
import { applyImpulse, step, isBallStopped, checkGoal } from './physics.js'
import { createMatchState } from './state.js'
import { FIXED_DT, V_STOP, STOP_FRAMES } from './constants.js'

const teamA = { code: 'BRA', name: 'Brasil', flag: '🇧🇷', colorPrimary: '#FFDF00' }
const teamB = { code: 'ARG', name: 'Argentina', flag: '🇦🇷', colorPrimary: '#75AADB' }

function freshState(cfg) {
  const s = createMatchState(teamA, teamB, cfg)
  s.pegs = [] // remover pegs para testes de integração/colisão de parede isolados
  return s
}

// --- T4: integração / atrito ---
describe('física: atrito e parada (CORE-02)', () => {
  it('bola com peteleco médio para em <= 1,5s', () => {
    const s = freshState()
    applyImpulse(s.ball, 700, 0) // ~700 u/s para a direita (médio)
    let t = 0
    let steps = 0
    while (!isBallStopped(s.ball) && steps < 1000) {
      step(s, FIXED_DT)
      t += FIXED_DT
      steps++
    }
    expect(isBallStopped(s.ball)).toBe(true)
    expect(t).toBeLessThanOrEqual(1.5)
  })

  it('isBallStopped só vira true após STOP_FRAMES abaixo do limiar', () => {
    const s = freshState()
    // velocidade logo abaixo do limiar, sem colisões
    applyImpulse(s.ball, V_STOP * 0.5, 0)
    // primeiro passo: cai abaixo do limiar mas counter < STOP_FRAMES
    step(s, FIXED_DT)
    expect(isBallStopped(s.ball)).toBe(false)
    for (let i = 0; i < STOP_FRAMES; i++) step(s, FIXED_DT)
    expect(isBallStopped(s.ball)).toBe(true)
  })

  it('usa dt fixo (resultado independe da frequência de chamada)', () => {
    const s = freshState()
    applyImpulse(s.ball, 300, 0)
    const x0 = s.ball.x
    step(s, FIXED_DT)
    const dxOneStep = s.ball.x - x0
    expect(dxOneStep).toBeGreaterThan(0)
    expect(dxOneStep).toBeLessThan(300 * FIXED_DT + 1) // ~ v*dt
  })
})

// --- T7: colisões ---
describe('física: colisões (CORE-02)', () => {
  it('ricocheteia na parede direita e permanece na arena', () => {
    const s = freshState()
    s.ball.x = s.arena.right - s.ball.radius - 2
    s.ball.y = 450
    applyImpulse(s.ball, 1700, 0) // forte contra a parede
    step(s, FIXED_DT)
    expect(s.ball.vx).toBeLessThan(0) // inverteu
    expect(s.ball.x + s.ball.radius).toBeLessThanOrEqual(s.arena.right + 0.001)
  })

  it('não atravessa parede mesmo em alta velocidade (anti-tunneling)', () => {
    const s = freshState()
    s.ball.x = 300; s.ball.y = 450
    applyImpulse(s.ball, 1800, 0)
    for (let i = 0; i < 600; i++) step(s, FIXED_DT)
    expect(s.ball.x - s.ball.radius).toBeGreaterThanOrEqual(s.arena.left - 0.5)
    expect(s.ball.x + s.ball.radius).toBeLessThanOrEqual(s.arena.right + 0.5)
  })

  it('desvia ao colidir com um peg (peg não se move)', () => {
    const s = freshState()
    const peg = { x: 360, y: 450, radius: 17, team: 'A', number: 1 }
    s.pegs = [peg]
    s.ball.x = 300; s.ball.y = 450
    applyImpulse(s.ball, 800, 0) // indo na direção do peg
    for (let i = 0; i < 60; i++) step(s, FIXED_DT)
    // bola não fica sobreposta ao peg
    const d = Math.hypot(s.ball.x - peg.x, s.ball.y - peg.y)
    expect(d).toBeGreaterThanOrEqual(s.ball.radius + peg.radius - 0.5)
    // peg imóvel
    expect(peg.x).toBe(360)
    expect(peg.y).toBe(450)
  })
})

// --- T8: detecção de gol ---
describe('física: detecção de gol (CORE-05)', () => {
  it('detecta gol quando a bola cruza a linha entre as traves', () => {
    const s = freshState()
    s.ball.x = 300 // centro (dentro das traves)
    s.ball.y = s.arena.top + 30
    applyImpulse(s.ball, 0, -1700) // forte para cima
    let goal = null
    for (let i = 0; i < 60 && !goal; i++) goal = step(s, FIXED_DT)
    expect(goal).toBe('top')
  })

  it('bola rápida não perde o gol (checagem no substep)', () => {
    const s = freshState()
    s.ball.x = 300
    s.ball.y = s.arena.top + 5
    applyImpulse(s.ball, 0, -1800)
    const goal = step(s, FIXED_DT)
    expect(goal).toBe('top')
  })

  it('checkGoal fora do intervalo das traves não conta', () => {
    const s = freshState()
    const a = s.arena
    expect(checkGoal({ x: a.goalXMin - 20, y: a.top - 5 }, a)).toBeNull()
    expect(checkGoal({ x: 300, y: a.top + 50 }, a)).toBeNull()
  })
})
