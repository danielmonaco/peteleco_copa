// Regras de turno, placar, gol e vitória. CORE-04, CORE-05, CORE-06.
import { resetBall } from './state.js'

export function consumeTouch(state) {
  if (state.touchesLeft > 0) state.touchesLeft--
}

// Chamado quando a bola para sem gol: troca a vez se acabaram os toques.
export function onBallSettled(state) {
  if (state.phase === 'gameover') return
  if (state.touchesLeft <= 0) {
    state.currentTeam = state.currentTeam === 'A' ? 'B' : 'A'
    state.touchesLeft = state.touchesPerTurn
  }
  state.phase = 'playing'
}

// A baliza 'top' é de B, 'bottom' é de A. Quem marca é o adversário do dono da
// baliza — isso credita gol contra ao adversário automaticamente (D-04).
export function attributeGoal(state, goalEvent) {
  return goalEvent === 'top' ? 'A' : 'B'
}

// Registra gol: placar++, bola ao centro, saída de quem sofreu, checa vitória.
export function registerGoal(state, goalEvent) {
  const scorer = attributeGoal(state, goalEvent)
  if (scorer === 'A') state.scoreA++
  else state.scoreB++

  resetBall(state.ball, state.playfield)

  const conceding = scorer === 'A' ? 'B' : 'A'
  state.currentTeam = conceding
  state.touchesLeft = state.touchesPerTurn

  const winner = checkWin(state)
  if (winner) {
    state.winner = winner
    state.phase = 'gameover'
  } else {
    state.phase = 'playing'
  }
  return scorer
}

export function checkWin(state) {
  if (state.scoreA >= state.goalsToWin) return 'A'
  if (state.scoreB >= state.goalsToWin) return 'B'
  return null
}
