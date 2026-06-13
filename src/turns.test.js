import { describe, it, expect } from 'vitest'
import {
  consumeTouch, onBallSettled, attributeGoal, registerGoal, checkWin,
} from './turns.js'
import { createMatchState } from './state.js'

const teamA = { code: 'BRA', name: 'Brasil', flag: '🇧🇷', colorPrimary: '#FFDF00' }
const teamB = { code: 'ARG', name: 'Argentina', flag: '🇦🇷', colorPrimary: '#75AADB' }
const mk = (cfg) => createMatchState(teamA, teamB, cfg)

describe('turnos (CORE-04)', () => {
  it('consumeTouch decrementa os toques', () => {
    const s = mk({ touchesPerTurn: 3 })
    consumeTouch(s)
    expect(s.touchesLeft).toBe(2)
  })

  it('onBallSettled mantém a vez enquanto sobram toques', () => {
    const s = mk({ touchesPerTurn: 3 })
    consumeTouch(s) // 2 restantes
    onBallSettled(s)
    expect(s.currentTeam).toBe('A')
    expect(s.touchesLeft).toBe(2)
  })

  it('onBallSettled troca a vez quando os toques acabam', () => {
    const s = mk({ touchesPerTurn: 1 })
    consumeTouch(s) // 0 restantes
    onBallSettled(s)
    expect(s.currentTeam).toBe('B')
    expect(s.touchesLeft).toBe(1)
  })
})

describe('gol e placar (CORE-05)', () => {
  it('gol na baliza top credita A; bottom credita B', () => {
    const s = mk()
    expect(attributeGoal(s, 'top')).toBe('A')
    expect(attributeGoal(s, 'bottom')).toBe('B')
  })

  it('registerGoal incrementa o time certo e dá a saída a quem sofreu', () => {
    const s = mk({ touchesPerTurn: 2 })
    s.currentTeam = 'A'
    const scorer = registerGoal(s, 'top') // A marca
    expect(scorer).toBe('A')
    expect(s.scoreA).toBe(1)
    expect(s.scoreB).toBe(0)
    expect(s.currentTeam).toBe('B') // B sofreu, recomeça
    expect(s.touchesLeft).toBe(2)
    expect(s.ball.x).toBe(s.playfield.w / 2)
    expect(s.ball.y).toBe(s.playfield.h / 2)
  })

  it('gol contra (bola na própria baliza) credita o adversário', () => {
    const s = mk()
    s.currentTeam = 'B' // B petelecou para a própria baliza (top, de B)
    const scorer = registerGoal(s, 'top')
    expect(scorer).toBe('A') // crédito vai ao adversário
    expect(s.scoreA).toBe(1)
  })
})

describe('vitória (CORE-06)', () => {
  it('checkWin retorna vencedor ao atingir os gols', () => {
    const s = mk({ goalsToWin: 3 })
    s.scoreA = 3
    expect(checkWin(s)).toBe('A')
  })

  it('registerGoal encerra a partida na vitória', () => {
    const s = mk({ goalsToWin: 3 })
    s.scoreA = 2
    s.currentTeam = 'A'
    registerGoal(s, 'top') // 3-0
    expect(s.winner).toBe('A')
    expect(s.phase).toBe('gameover')
  })

  it('não há empate: sem vencedor antes do teto de gols', () => {
    const s = mk({ goalsToWin: 5 })
    s.scoreA = 4; s.scoreB = 4
    expect(checkWin(s)).toBeNull()
  })
})
