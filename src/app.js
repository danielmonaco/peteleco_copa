// Orquestrador do fluxo: liga as telas DOM (ui.js) ao motor da partida (game.js).
// Entry point do app. FLOW-01..05 (integração).
import { createMatchState } from './state.js'
import { getTeam, withDistinctColor } from './teams.js'
import { createGame } from './game.js'
import { createUI } from './ui.js'

function boot() {
  const canvas = document.getElementById('game')
  const root = document.getElementById('ui-root')
  if (!canvas || !root) return

  let game = null

  const ui = createUI(root, {
    onStart: startMatch,
    onRematch: () => {
      if (game) {
        game.restart()
        ui.hideAll()
      }
    },
    onChangeTeams: () => {
      if (game) {
        game.stop()
        game = null
      }
    },
  })

  function startMatch(codeA, codeB, config) {
    const teamA = getTeam(codeA)
    let teamB = getTeam(codeB)
    // Camisas parecidas (mesmo país OU cores semelhantes) → 2º uniforme no time B (FLOW-02 AC2).
    teamB = withDistinctColor(teamB, teamA.colorPrimary)

    if (game) game.stop()
    const state = createMatchState(teamA, teamB, config)
    game = createGame(canvas, state, {
      manageScreens: false,
      onGameOver: (winner) => ui.showGameOver(winner, state.scoreA, state.scoreB, teamA, teamB),
    })
    game.start()
  }

  ui.showMenu()
  window.__peteleco = {
    ui,
    get game() { return game },
    get state() { return game ? game.state : null },
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
