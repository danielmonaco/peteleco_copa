import { describe, it, expect } from 'vitest'
import { TEAMS, getTeam, withDistinctColor, colorDistance } from './teams.js'

describe('seleções (FLOW-02)', () => {
  it('tem 48 seleções', () => {
    expect(TEAMS).toHaveLength(48)
  })

  it('códigos são únicos e com 3 letras', () => {
    const codes = TEAMS.map((t) => t.code)
    expect(new Set(codes).size).toBe(48)
    for (const c of codes) expect(c).toMatch(/^[A-Z]{3}$/)
  })

  it('todo time tem nome, flag e cor primária', () => {
    for (const t of TEAMS) {
      expect(t.name?.length).toBeGreaterThan(0)
      expect(t.flag?.length).toBeGreaterThan(0)
      expect(t.colorPrimary).toMatch(/^#/)
    }
  })

  it('inclui os 3 anfitriões (USA, MEX, CAN)', () => {
    for (const c of ['USA', 'MEX', 'CAN']) {
      expect(TEAMS.find((t) => t.code === c)).toBeDefined()
    }
  })

  it('getTeam retorna o time; fallback no primeiro', () => {
    expect(getTeam('BRA').code).toBe('BRA')
    expect(getTeam('___')).toBe(TEAMS[0])
  })
})

describe('withDistinctColor', () => {
  it('mantém a cor quando não há conflito', () => {
    const bra = getTeam('BRA')
    expect(withDistinctColor(bra, '#000000').colorPrimary).toBe(bra.colorPrimary)
  })

  it('troca a cor quando igual à do oponente', () => {
    const t = { code: 'XXX', name: 'X', flag: '🏳️', colorPrimary: '#abcabc', colorSecondary: '#123456' }
    const out = withDistinctColor(t, '#ABCABC')
    expect(out.colorPrimary.toLowerCase()).not.toBe('#abcabc')
  })

  it('troca para o 2º uniforme quando as cores são apenas PARECIDAS (não idênticas)', () => {
    // Brasil (amarelo) vs Colômbia (amarelo): primárias próximas
    const bra = getTeam('BRA')
    const col = getTeam('COL')
    expect(colorDistance(bra.colorPrimary, col.colorPrimary)).toBeLessThan(100)
    const out = withDistinctColor(col, bra.colorPrimary)
    expect(out.recolored).toBe(true)
    expect(colorDistance(out.colorPrimary, bra.colorPrimary)).toBeGreaterThan(100)
  })

  it('mantém a cor quando as camisas já são bem diferentes', () => {
    const bra = getTeam('BRA') // amarelo
    const arg = getTeam('ARG') // azul claro
    expect(withDistinctColor(arg, bra.colorPrimary).colorPrimary).toBe(arg.colorPrimary)
  })
})
