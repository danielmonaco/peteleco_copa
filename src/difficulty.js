// Níveis de dificuldade: presets que ajustam o tamanho dos jogadores/goleiro e a
// largura do gol. Equilíbrio para idades mistas (PRD §3, FR-003). [ajustável]
export const DIFFICULTIES = {
  facil: { key: 'facil', label: 'Fácil', goalWidth: 210, pegRadius: 18, keeperRadius: 18 },
  medio: { key: 'medio', label: 'Médio', goalWidth: 165, pegRadius: 22, keeperRadius: 24 },
  dificil: { key: 'dificil', label: 'Difícil', goalWidth: 140, pegRadius: 26, keeperRadius: 28 },
}

export const DIFFICULTY_ORDER = ['facil', 'medio', 'dificil']

export function getDifficulty(key) {
  return DIFFICULTIES[key] || DIFFICULTIES.medio
}

// Parâmetros consumidos por arena/pegs a partir de um preset.
export function difficultyParams(key) {
  const d = getDifficulty(key)
  return { goalWidth: d.goalWidth, pegRadius: d.pegRadius, keeperRadius: d.keeperRadius }
}
