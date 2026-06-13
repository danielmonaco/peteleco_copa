// Geometria do campo: paredes, aberturas de gol e pegs estáticos. CORE-01.
import { PLAYFIELD, WALL, GOAL_WIDTH, PEG_RADIUS } from './constants.js'

// Arena como retângulo (colisão) com duas aberturas de gol no topo e na base.
// Os cantos são arredondados apenas no render (CORNER); a colisão usa o retângulo
// por estabilidade (ver design.md / D-02).
export function buildArena(pf = PLAYFIELD) {
  const cx = pf.w / 2
  const half = GOAL_WIDTH / 2
  return {
    left: WALL,
    right: pf.w - WALL,
    top: WALL,
    bottom: pf.h - WALL,
    goalXMin: cx - half,
    goalXMax: cx + half,
    width: pf.w,
    height: pf.h,
  }
}

// Linha de gol entre as traves para detecção. 'top' é a baliza defendida por B,
// 'bottom' a defendida por A.
export function goalLine(side, arena = buildArena()) {
  const base = { xMin: arena.goalXMin, xMax: arena.goalXMax }
  return side === 'top' ? { ...base, y: arena.top } : { ...base, y: arena.bottom }
}

// Formação fixa espelhada (D-06): 5 pegs por time, numerados 1..5.
// Time A na metade de baixo; Time B espelhado na metade de cima (B.y = h - A.y).
export function buildPegs(pf = PLAYFIELD) {
  const cx = pf.w / 2
  const baseA = [
    [cx, pf.h - 80, 1], // "goleiro"
    [cx - 120, pf.h - 195, 2], // zaga
    [cx + 120, pf.h - 195, 3],
    [cx - 78, pf.h - 330, 4], // meio
    [cx + 78, pf.h - 330, 5],
  ]
  const pegs = []
  for (const [x, y, number] of baseA) {
    pegs.push({ x, y, radius: PEG_RADIUS, team: 'A', number })
  }
  for (const [x, y, number] of baseA) {
    pegs.push({ x, y: pf.h - y, radius: PEG_RADIUS, team: 'B', number })
  }
  return pegs
}
