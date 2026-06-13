// Seleções para a escolha de times.
// ⚠️ LISTA PROVISÓRIA E EDITÁVEL (B-01 / D-13): a classificação da Copa 2026 ainda
// não fechou — só EUA, México e Canadá são vaga garantida (sede). Estas 48 são
// seleções reais conhecidas, usadas como pool provisório para a grade funcionar.
// Substituir pela lista oficial quando a classificação terminar. Não é a lista oficial.
// Formato (PRD §10): { code, name, flag, colorPrimary, colorSecondary? }
export const TEAMS = [
  // Anfitriões (vaga garantida)
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', colorPrimary: '#0a3161', colorSecondary: '#ffffff' },
  { code: 'MEX', name: 'México', flag: '🇲🇽', colorPrimary: '#006847', colorSecondary: '#ffffff' },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦', colorPrimary: '#d52b1e', colorSecondary: '#ffffff' },
  // CONMEBOL
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', colorPrimary: '#FDE100', colorSecondary: '#1f7a3d' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', colorPrimary: '#6cace4', colorSecondary: '#ffffff' },
  { code: 'URU', name: 'Uruguai', flag: '🇺🇾', colorPrimary: '#5b9ad5', colorSecondary: '#111111' },
  { code: 'COL', name: 'Colômbia', flag: '🇨🇴', colorPrimary: '#fcd116', colorSecondary: '#003893' },
  { code: 'ECU', name: 'Equador', flag: '🇪🇨', colorPrimary: '#ffd100', colorSecondary: '#0072c6' },
  { code: 'PER', name: 'Peru', flag: '🇵🇪', colorPrimary: '#d91023', colorSecondary: '#ffffff' },
  { code: 'CHI', name: 'Chile', flag: '🇨🇱', colorPrimary: '#d52b1e', colorSecondary: '#0039a6' },
  { code: 'PAR', name: 'Paraguai', flag: '🇵🇾', colorPrimary: '#d52b1e', colorSecondary: '#0038a8' },
  // UEFA
  { code: 'FRA', name: 'França', flag: '🇫🇷', colorPrimary: '#1c2c6b', colorSecondary: '#ffffff' },
  { code: 'ESP', name: 'Espanha', flag: '🇪🇸', colorPrimary: '#c60b1e', colorSecondary: '#ffd700' },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', colorPrimary: '#ffffff', colorSecondary: '#0a3161' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', colorPrimary: '#006600', colorSecondary: '#d52b1e' },
  { code: 'GER', name: 'Alemanha', flag: '🇩🇪', colorPrimary: '#111111', colorSecondary: '#ffffff' },
  { code: 'ITA', name: 'Itália', flag: '🇮🇹', colorPrimary: '#0066a2', colorSecondary: '#ffffff' },
  { code: 'NED', name: 'Holanda', flag: '🇳🇱', colorPrimary: '#ff6a13', colorSecondary: '#ffffff' },
  { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', colorPrimary: '#c8102e', colorSecondary: '#ffd100' },
  { code: 'CRO', name: 'Croácia', flag: '🇭🇷', colorPrimary: '#d52b1e', colorSecondary: '#ffffff' },
  { code: 'DEN', name: 'Dinamarca', flag: '🇩🇰', colorPrimary: '#c60c30', colorSecondary: '#ffffff' },
  { code: 'SUI', name: 'Suíça', flag: '🇨🇭', colorPrimary: '#d52b1e', colorSecondary: '#ffffff' },
  { code: 'POL', name: 'Polônia', flag: '🇵🇱', colorPrimary: '#dc143c', colorSecondary: '#ffffff' },
  { code: 'SRB', name: 'Sérvia', flag: '🇷🇸', colorPrimary: '#c6363c', colorSecondary: '#ffffff' },
  { code: 'AUT', name: 'Áustria', flag: '🇦🇹', colorPrimary: '#ed2939', colorSecondary: '#ffffff' },
  { code: 'UKR', name: 'Ucrânia', flag: '🇺🇦', colorPrimary: '#ffd500', colorSecondary: '#0057b7' },
  { code: 'TUR', name: 'Turquia', flag: '🇹🇷', colorPrimary: '#e30a17', colorSecondary: '#ffffff' },
  { code: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', colorPrimary: '#0065bf', colorSecondary: '#ffffff' },
  { code: 'NOR', name: 'Noruega', flag: '🇳🇴', colorPrimary: '#ba0c2f', colorSecondary: '#00205b' },
  // CAF
  { code: 'MAR', name: 'Marrocos', flag: '🇲🇦', colorPrimary: '#c1272d', colorSecondary: '#006233' },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', colorPrimary: '#00853f', colorSecondary: '#fdef42' },
  { code: 'NGA', name: 'Nigéria', flag: '🇳🇬', colorPrimary: '#008751', colorSecondary: '#ffffff' },
  { code: 'EGY', name: 'Egito', flag: '🇪🇬', colorPrimary: '#c8102e', colorSecondary: '#ffffff' },
  { code: 'CMR', name: 'Camarões', flag: '🇨🇲', colorPrimary: '#007a5e', colorSecondary: '#ce1126' },
  { code: 'GHA', name: 'Gana', flag: '🇬🇭', colorPrimary: '#ce1126', colorSecondary: '#fcd116' },
  { code: 'ALG', name: 'Argélia', flag: '🇩🇿', colorPrimary: '#006233', colorSecondary: '#ffffff' },
  { code: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮', colorPrimary: '#ff8200', colorSecondary: '#009e60' },
  { code: 'TUN', name: 'Tunísia', flag: '🇹🇳', colorPrimary: '#e70013', colorSecondary: '#ffffff' },
  // AFC
  { code: 'JPN', name: 'Japão', flag: '🇯🇵', colorPrimary: '#1c2d6b', colorSecondary: '#ffffff' },
  { code: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷', colorPrimary: '#c60c30', colorSecondary: '#003478' },
  { code: 'AUS', name: 'Austrália', flag: '🇦🇺', colorPrimary: '#00843d', colorSecondary: '#ffcd00' },
  { code: 'IRN', name: 'Irã', flag: '🇮🇷', colorPrimary: '#ffffff', colorSecondary: '#239f40' },
  { code: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦', colorPrimary: '#006c35', colorSecondary: '#ffffff' },
  { code: 'QAT', name: 'Catar', flag: '🇶🇦', colorPrimary: '#8a1538', colorSecondary: '#ffffff' },
  { code: 'JOR', name: 'Jordânia', flag: '🇯🇴', colorPrimary: '#007a3d', colorSecondary: '#ce1126' },
  { code: 'UZB', name: 'Uzbequistão', flag: '🇺🇿', colorPrimary: '#1eb53a', colorSecondary: '#0099b5' },
  // OFC
  { code: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿', colorPrimary: '#111111', colorSecondary: '#ffffff' },
  { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷', colorPrimary: '#002b7f', colorSecondary: '#ce1126' },
]

export function getTeam(code) {
  return TEAMS.find((t) => t.code === code) || TEAMS[0]
}

// Garante cor distinta quando os dois lados escolhem o mesmo país (FLOW-02 AC2).
export function withDistinctColor(team, takenColor) {
  if (!takenColor || team.colorPrimary.toLowerCase() !== takenColor.toLowerCase()) {
    return team
  }
  const alt =
    team.colorSecondary && team.colorSecondary.toLowerCase() !== takenColor.toLowerCase()
      ? team.colorSecondary
      : '#ff5a3c'
  return { ...team, colorPrimary: alt, recolored: true }
}
