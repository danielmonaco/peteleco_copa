// Modelo de estado central da partida (MatchState) e factory. CORE-04.
import { PLAYFIELD, BALL_RADIUS } from './constants.js'
import { buildArena, buildPegs } from './arena.js'
import { difficultyParams, getDifficulty } from './difficulty.js'

export const PHASES = ['menu', 'select', 'config', 'playing', 'ballMoving', 'goal', 'gameover']

export const DEFAULT_CONFIG = { touchesPerTurn: 3, goalsToWin: 5 }

export function createBall(pf = PLAYFIELD) {
  const x = pf.w / 2
  const y = pf.h / 2
  return { x, y, vx: 0, vy: 0, radius: BALL_RADIUS, px: x, py: y, stopCounter: 0 }
}

export function resetBall(ball, pf = PLAYFIELD) {
  ball.x = pf.w / 2
  ball.y = pf.h / 2
  ball.px = ball.x
  ball.py = ball.y
  ball.vx = 0
  ball.vy = 0
  ball.stopCounter = 0
}

// Monta o estado inicial da partida. Recebe times já resolvidos (de match-flow-ui).
export function createMatchState(teamA, teamB, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const startTeam = cfg.startTeam === 'B' ? 'B' : 'A'
  const diff = getDifficulty(cfg.difficulty)
  const diffParams = difficultyParams(diff.key)
  return {
    teamA,
    teamB,
    scoreA: 0,
    scoreB: 0,
    goalsToWin: cfg.goalsToWin,
    touchesPerTurn: cfg.touchesPerTurn,
    currentTeam: startTeam,
    touchesLeft: cfg.touchesPerTurn,
    phase: 'playing',
    ball: createBall(PLAYFIELD),
    pegs: buildPegs(PLAYFIELD, diffParams),
    arena: buildArena(PLAYFIELD, diffParams),
    difficulty: diff.key,
    diffParams,
    winner: null,
    playfield: PLAYFIELD,
  }
}

// Troca a dificuldade e reconstrói arena/pegs (recalibra o campo). Reseta a bola.
export function setDifficulty(state, key) {
  const diff = getDifficulty(key)
  state.difficulty = diff.key
  state.diffParams = difficultyParams(diff.key)
  state.arena = buildArena(state.playfield, state.diffParams)
  state.pegs = buildPegs(state.playfield, state.diffParams)
  resetBall(state.ball, state.playfield)
}
