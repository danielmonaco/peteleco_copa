// Entry point do núcleo jogável. Monta uma partida de exemplo (times placeholder)
// e inicia o loop. Menu/seleção/config completos virão de match-flow-ui.
import { createMatchState } from './state.js'
import { getTeam } from './teams.js'
import { createGame } from './game.js'

function boot() {
  const canvas = document.getElementById('game')
  if (!canvas) return
  const teamA = getTeam('BRA')
  const teamB = getTeam('ARG')
  const state = createMatchState(teamA, teamB, { touchesPerTurn: 3, goalsToWin: 5, difficulty: 'medio' })
  state.phase = 'config' // começa pelo seletor de dificuldade
  const game = createGame(canvas, state)
  game.start()
  window.__peteleco = { state, game } // útil p/ debug/verificação
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
