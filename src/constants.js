// Constantes de calibragem do Peteleco da Copa.
// Valores empíricos (ajustáveis) — ver STATE.md (todo de calibragem).

// Mundo lógico (world units), retrato. O render escala isto para a viewport.
export const PLAYFIELD = { w: 600, h: 900 }

// Raios de colisão
export const BALL_RADIUS = 13
export const PEG_RADIUS = 25 // jogadores maiores: defendem melhor, gol mais difícil

// Arena (retângulo arredondado com aberturas de gol — D-02)
export const WALL = 26 // margem da parede a partir da borda do playfield
export const GOAL_WIDTH = 150 // abertura do gol mais estreita p/ dificultar o gol
export const CORNER = 80 // raio visual dos cantos (apenas render)

// Física (timestep fixo — D-11)
export const FIXED_DT = 1 / 120 // passo fixo da física, em segundos
export const DAMP = 0.965 // damping por passo de física (atrito alto)
export const V_STOP = 5 // limiar de velocidade (u/s) p/ considerar bola parando
export const STOP_FRAMES = 6 // passos consecutivos abaixo do limiar p/ assentar
export const RESTITUTION_WALL = 0.78
export const RESTITUTION_PEG = 0.72

// Peteleco / slingshot
export const MIN_DRAG = 15 // arrasto mínimo (px de tela) p/ disparar
export const MAX_DRAG = 220 // arrasto que satura a força (px de tela)
export const MAX_SPEED = 1800 // velocidade máxima do disparo (u/s)
