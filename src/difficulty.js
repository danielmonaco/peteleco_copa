// Níveis de dificuldade: presets que ajustam geometria (gol/jogadores) E a
// "economia"/física da partida. Equilíbrio para idades mistas (PRD §3, FR-003). [ajustável]
//
// Campos por nível:
//   goalWidth/pegRadius/keeperRadius — geometria (lever original, D-17).
//   touchesPerTurn — toques por vez: menos toques = sem "walk-up" até o gol (D-07).
//   damp           — atrito por passo de física: menor = bola morre antes (encurta alcance).
//   pegRestitution — repique nos defensores: maior = chute impreciso é punido com desvio forte.
//   maxSpeed       — teto de força do peteleco (u/s): menor = bola percorre menos distância.
//   showAim        — mostrar a linha de mira (prévia do arrasto); falso = chutar "no escuro".
export const DIFFICULTIES = {
  facil: { key: 'facil', label: 'Fácil', goalWidth: 210, pegRadius: 22, keeperRadius: 24, touchesPerTurn: 3, damp: 0.965, pegRestitution: 0.72, maxSpeed: 1800, showAim: true },
  medio: { key: 'medio', label: 'Médio', goalWidth: 165, pegRadius: 26, keeperRadius: 28, touchesPerTurn: 2, damp: 0.961, pegRestitution: 0.80, maxSpeed: 1600, showAim: true },
  dificil: { key: 'dificil', label: 'Difícil', goalWidth: 140, pegRadius: 30, keeperRadius: 32, touchesPerTurn: 1, damp: 0.957, pegRestitution: 0.88, maxSpeed: 1400, showAim: false },
}

export const DIFFICULTY_ORDER = ['facil', 'medio', 'dificil']

export function getDifficulty(key) {
  return DIFFICULTIES[key] || DIFFICULTIES.medio
}

// Parâmetros consumidos por arena/pegs/física/HUD a partir de um preset.
// arena/pegs ignoram os campos extras; física e game.js consomem o resto.
export function difficultyParams(key) {
  const d = getDifficulty(key)
  return {
    goalWidth: d.goalWidth,
    pegRadius: d.pegRadius,
    keeperRadius: d.keeperRadius,
    touchesPerTurn: d.touchesPerTurn,
    damp: d.damp,
    pegRestitution: d.pegRestitution,
    maxSpeed: d.maxSpeed,
    showAim: d.showAim,
  }
}
