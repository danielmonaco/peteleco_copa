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

  it('quanto mais difícil: menos toques, mais atrito, pegs mais repelentes, sem mira', () => {
    const f = DIFFICULTIES.facil, m = DIFFICULTIES.medio, d = DIFFICULTIES.dificil
    // Toques por vez decrescem (3/2/1) — fim do "walk-up" até o gol.
    expect(f.touchesPerTurn).toBeGreaterThan(m.touchesPerTurn)
    expect(m.touchesPerTurn).toBeGreaterThan(d.touchesPerTurn)
    // Atrito maior no difícil = damp menor (bola morre antes).
    expect(f.damp).toBeGreaterThan(d.damp)
    // Defensores mais repelentes no difícil.
    expect(d.pegRestitution).toBeGreaterThan(f.pegRestitution)
    // Jogadores crescem do fácil ao difícil.
    expect(d.pegRadius).toBeGreaterThan(m.pegRadius)
    expect(m.pegRadius).toBeGreaterThan(f.pegRadius)
    // Teto de força diminui do fácil ao difícil (bola percorre menos).
    expect(f.maxSpeed).toBeGreaterThan(m.maxSpeed)
    expect(m.maxSpeed).toBeGreaterThan(d.maxSpeed)
    // Mira escondida só no difícil.
    expect(f.showAim).toBe(true)
    expect(d.showAim).toBe(false)
  })

  it('escalonamento de tamanho: cada nível herda o tamanho do nível acima', () => {
    // Pedido do usuário (2026-06-14): Fácil = Médio antigo, Médio = Difícil antigo.
    expect(DIFFICULTIES.facil.pegRadius).toBe(22)
    expect(DIFFICULTIES.facil.keeperRadius).toBe(24)
    expect(DIFFICULTIES.medio.pegRadius).toBe(26)
    expect(DIFFICULTIES.medio.keeperRadius).toBe(28)
  })

  it('difficultyParams propaga os campos de física/economia/HUD', () => {
    const p = difficultyParams('dificil')
    expect(p.touchesPerTurn).toBe(DIFFICULTIES.dificil.touchesPerTurn)
    expect(p.damp).toBe(DIFFICULTIES.dificil.damp)
    expect(p.pegRestitution).toBe(DIFFICULTIES.dificil.pegRestitution)
    expect(p.maxSpeed).toBe(DIFFICULTIES.dificil.maxSpeed)
    expect(p.showAim).toBe(DIFFICULTIES.dificil.showAim)
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
