import { describe, it, expect } from 'vitest'
import { createMatchState, DEFAULT_CONFIG, resetBall, createBall } from './state.js'
import { getDifficulty } from './difficulty.js'

const teamA = { code: 'BRA', name: 'Brasil', flag: '🇧🇷', colorPrimary: '#FFDF00' }
const teamB = { code: 'ARG', name: 'Argentina', flag: '🇦🇷', colorPrimary: '#75AADB' }

describe('createMatchState', () => {
  it('aplica defaults de config quando omitida', () => {
    const s = createMatchState(teamA, teamB)
    // Toques por vez agora seguem a dificuldade (default médio); só override explícito vence.
    expect(s.touchesPerTurn).toBe(getDifficulty('medio').touchesPerTurn)
    expect(s.goalsToWin).toBe(DEFAULT_CONFIG.goalsToWin)
  })

  it('respeita overrides de config', () => {
    const s = createMatchState(teamA, teamB, { touchesPerTurn: 1, goalsToWin: 3, startTeam: 'B' })
    expect(s.touchesPerTurn).toBe(1)
    expect(s.goalsToWin).toBe(3)
    expect(s.currentTeam).toBe('B')
  })

  it('tem shape inicial correto', () => {
    const s = createMatchState(teamA, teamB)
    expect(s.scoreA).toBe(0)
    expect(s.scoreB).toBe(0)
    expect(s.touchesLeft).toBe(s.touchesPerTurn)
    expect(s.phase).toBe('playing')
    expect(s.winner).toBeNull()
    expect(s.pegs).toHaveLength(10)
    expect(s.ball).toBeDefined()
  })
})

describe('resetBall', () => {
  it('recoloca a bola no centro e zera velocidade', () => {
    const pf = { w: 600, h: 900 }
    const b = createBall(pf)
    b.x = 10; b.y = 10; b.vx = 99; b.vy = 99
    resetBall(b, pf)
    expect(b.x).toBe(300)
    expect(b.y).toBe(450)
    expect(b.vx).toBe(0)
    expect(b.vy).toBe(0)
  })
})
