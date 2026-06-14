// Geometria do campo: paredes, aberturas de gol e pegs estáticos. CORE-01.
import { PLAYFIELD, WALL, GOAL_WIDTH, PEG_RADIUS } from './constants.js'

// Arena como retângulo (colisão) com duas aberturas de gol no topo e na base.
// Os cantos são arredondados apenas no render (CORNER); a colisão usa o retângulo
// por estabilidade (ver design.md / D-02).
export function buildArena(pf = PLAYFIELD, opts = {}) {
  const cx = pf.w / 2
  const half = (opts.goalWidth ?? GOAL_WIDTH) / 2
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
export function buildPegs(pf = PLAYFIELD, opts = {}) {
  const cx = pf.w / 2
  const pegR = opts.pegRadius ?? PEG_RADIUS
  const keeperR = opts.keeperRadius ?? pegR
  // Formação 2-1-2: P2/P3 alinhados às traves, P1 libero, P4/P5 alas
  const gHalf = (opts.goalWidth ?? GOAL_WIDTH) / 2
  const baseA = [
    [cx,          pf.h - 220, 1], // libero: (300, 680)
    [cx - gHalf,  pf.h - 130, 2], // def. esq. na trave esq.
    [cx + gHalf,  pf.h - 130, 3], // def. dir. na trave dir.
    [cx - 150,    pf.h - 310, 4], // ala esq.: (150, 590)
    [cx + 150,    pf.h - 310, 5], // ala dir.: (450, 590)
  ]
  const radiusFor = (number) => (number === 1 ? keeperR : pegR)
  const pegs = []
  for (const [x, y, number] of baseA) {
    pegs.push({ x, y, radius: radiusFor(number), team: 'A', number })
  }
  for (const [x, y, number] of baseA) {
    pegs.push({ x, y: pf.h - y, radius: radiusFor(number), team: 'B', number })
  }
  return pegs
}
