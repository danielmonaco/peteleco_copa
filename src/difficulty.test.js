import { describe, it, expect } from 'vitest'
import { DIFFICULTIES, DIFFICULTY_ORDER, getDifficulty, difficultyParams } from './difficulty.js'
import { buildArena, buildPegs } from './arena.js'
import { createMatchState, setDifficulty } from './state.js'

const teamA = { code: 'BRA', name: 'Brasil', flag: '🇧🇷', colorPrimary: '#FDE100' }
const teamB = { code: 'ARG', name: 'Argentina', flag: '🇦🇷', colorPrimary: '#75AADB' }

describe('presets de dificuldade', () => {
  it('tem os 3 níveis na ordem fácil→difícil', () => {
    expect(DIFFICULTY_ORDER).toEqual(['facil', 'medio', 'dificil'])
    for (const k of DIFFICULTY_ORDER) expect(DIFFICULTIES[k]).toBeDefined()
  })

  it('gol estreita e jogadores crescem conforme a dificuldade aumenta', () => {
    expect(DIFFICULTIES.facil.goalWidth).toBeGreaterThan(DIFFICULTIES.dificil.goalWidth)
    expect(DIFFICULTIES.facil.pegRadius).toBeLessThan(DIFFICULTIES.dificil.pegRadius)
    expect(DIFFICULTIES.facil.keeperRadius).toBeLessThan(DIFFICULTIES.dificil.keeperRadius)
  })

  it('getDifficulty faz fallback p/ médio em chave inválida', () => {
    expect(getDifficulty('xyz').key).toBe('medio')
    expect(getDifficulty(undefined).key).toBe('medio')
  })
})

describe('parametrização de arena/pegs pela dificuldade', () => {
  const pf = { w: 600, h: 900 }

  it('buildArena respeita goalWidth do preset', () => {
    const easy = buildArena(pf, difficultyParams('facil'))
    const hard = buildArena(pf, difficultyParams('dificil'))
    const widthOf = (a) => a.goalXMax - a.goalXMin
    expect(widthOf(easy)).toBeCloseTo(DIFFICULTIES.facil.goalWidth, 6)
    expect(widthOf(easy)).toBeGreaterThan(widthOf(hard))
  })

  it('buildPegs aplica pegRadius e keeperRadius (nº1) do preset', () => {
    const pegs = buildPegs(pf, difficultyParams('dificil'))
    const keeperA = pegs.find((p) => p.team === 'A' && p.number === 1)
    const fieldA = pegs.find((p) => p.team === 'A' && p.number === 2)
    expect(keeperA.radius).toBe(DIFFICULTIES.dificil.keeperRadius)
    expect(fieldA.radius).toBe(DIFFICULTIES.dificil.pegRadius)
  })
})

describe('integração com o estado', () => {
  it('createMatchState usa a dificuldade da config (default médio)', () => {
    const s = createMatchState(teamA, teamB)
    expect(s.difficulty).toBe('medio')
    const s2 = createMatchState(teamA, teamB, { difficulty: 'dificil' })
    expect(s2.difficulty).toBe('dificil')
  })

  it('setDifficulty reconstrói arena/pegs e reseta a bola', () => {
    const s = createMatchState(teamA, teamB, { difficulty: 'dificil' })
    s.ball.x = 10; s.ball.y = 10; s.ball.vx = 50
    setDifficulty(s, 'facil')
    expect(s.difficulty).toBe('facil')
    expect(s.arena.goalXMax - s.arena.goalXMin).toBeCloseTo(DIFFICULTIES.facil.goalWidth, 6)
    expect(s.pegs.find((p) => p.number === 2 && p.team === 'A').radius).toBe(DIFFICULTIES.facil.pegRadius)
    expect(s.ball.x).toBe(s.playfield.w / 2)
    expect(s.ball.vx).toBe(0)
  })
})
