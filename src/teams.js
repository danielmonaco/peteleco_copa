// PLACEHOLDER de seleções — a lista oficial das 48 da Copa 2026 pertence à feature
// match-flow-ui e está bloqueada (B-01). Aqui ficam só algumas para o núcleo rodar.
// Formato: { code, name, flag, colorPrimary, colorSecondary? }  (PRD §10)
export const TEAMS = [
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', colorPrimary: '#FDE100', colorSecondary: '#1f7a3d' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', colorPrimary: '#75AADB', colorSecondary: '#ffffff' },
  { code: 'FRA', name: 'França', flag: '🇫🇷', colorPrimary: '#1c2c6b', colorSecondary: '#ffffff' },
  { code: 'ESP', name: 'Espanha', flag: '🇪🇸', colorPrimary: '#c60b1e', colorSecondary: '#ffd700' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', colorPrimary: '#006600', colorSecondary: '#ff0000' },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', colorPrimary: '#0a3161', colorSecondary: '#ffffff' },
  { code: 'MEX', name: 'México', flag: '🇲🇽', colorPrimary: '#006847', colorSecondary: '#ffffff' },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦', colorPrimary: '#d52b1e', colorSecondary: '#ffffff' },
]

export function getTeam(code) {
  return TEAMS.find((t) => t.code === code) || TEAMS[0]
}
