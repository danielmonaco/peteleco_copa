import { describe, it, expect } from 'vitest'
import { buildArena, buildPegs, goalLine } from './arena.js'

const pf = { w: 600, h: 900 }

describe('buildPegs', () => {
  it('cria 10 pegs (5 por time)', () => {
    const pegs = buildPegs(pf)
    expect(pegs).toHaveLength(10)
    expect(pegs.filter((p) => p.team === 'A')).toHaveLength(5)
    expect(pegs.filter((p) => p.team === 'B')).toHaveLength(5)
  })

  it('numera 1..5 por time, sem repetir', () => {
    const pegs = buildPegs(pf)
    const nums = (t) => pegs.filter((p) => p.team === t).map((p) => p.number).sort()
    expect(nums('A')).toEqual([1, 2, 3, 4, 5])
    expect(nums('B')).toEqual([1, 2, 3, 4, 5])
  })

  it('posiciona B espelhado em relação a A (B.y = h - A.y)', () => {
    const pegs = buildPegs(pf)
    for (let n = 1; n <= 5; n++) {
      const a = pegs.find((p) => p.team === 'A' && p.number === n)
      const b = pegs.find((p) => p.team === 'B' && p.number === n)
      expect(b.x).toBe(a.x)
      expect(b.y).toBeCloseTo(pf.h - a.y, 6)
    }
  })
})

describe('goalLine', () => {
  it('retorna intervalo entre as traves centrado', () => {
    const a = buildArena(pf)
    const top = goalLine('top', a)
    const bottom = goalLine('bottom', a)
    expect(top.xMin).toBeLessThan(top.xMax)
    expect((top.xMin + top.xMax) / 2).toBeCloseTo(pf.w / 2, 6)
    expect(top.y).toBe(a.top)
    expect(bottom.y).toBe(a.bottom)
  })
})
