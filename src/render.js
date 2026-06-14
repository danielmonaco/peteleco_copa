// Render do campo em visão de cima (canvas 2D). CORE-01.
import { PLAYFIELD, CORNER, GOAL_WIDTH, WALL } from './constants.js'

const COL = {
  fieldA: '#1f7a3d',
  fieldB: '#1b6e37',
  line: 'rgba(255,255,255,0.85)',
  wall: '#0d3f20',
  ball: '#ffffff',
  ballEdge: '#1a1a1a',
  goal: 'rgba(255,255,255,0.25)',
  guide: '#ffe14d',
}

export function createRenderer(canvas, pf = PLAYFIELD) {
  const ctx = canvas.getContext('2d')
  const r = { canvas, ctx, pf, scale: 1, ox: 0, oy: 0, dpr: 1 }
  resize(r)
  return r
}

// Espaço vertical mínimo (px CSS) reservado acima/abaixo do campo para os badges de time.
const BADGE_V = 40

export function resize(r) {
  const pf = r.pf
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
  const cw = r.canvas.clientWidth || pf.w
  const ch = r.canvas.clientHeight || pf.h
  r.canvas.width = Math.round(cw * dpr)
  r.canvas.height = Math.round(ch * dpr)
  // Reserva BADGE_V px acima e abaixo para que os badges nunca sobreponham o campo.
  const scale = Math.min(cw / pf.w, (ch - 2 * BADGE_V) / pf.h)
  r.scale = Math.max(0.1, scale)
  r.ox = (cw - pf.w * r.scale) / 2
  r.oy = (ch - pf.h * r.scale) / 2
  r.dpr = dpr
}

export function worldToScreen(r, p) {
  return { x: p.x * r.scale + r.ox, y: p.y * r.scale + r.oy }
}

export function screenToWorld(r, sx, sy) {
  return { x: (sx - r.ox) / r.scale, y: (sy - r.oy) / r.scale }
}

function roundRect(ctx, x, y, w, h, rad) {
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}

export function draw(r, state, aim) {
  const { ctx, pf } = r
  ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
  ctx.clearRect(0, 0, r.canvas.width, r.canvas.height)

  const o = worldToScreen(r, { x: 0, y: 0 })
  const s = r.scale

  // fundo fora do campo
  ctx.fillStyle = COL.wall
  ctx.fillRect(0, 0, r.canvas.width, r.canvas.height)

  // campo (retângulo arredondado)
  const fx = o.x + WALL * s
  const fy = o.y + WALL * s
  const fw = (pf.w - 2 * WALL) * s
  const fh = (pf.h - 2 * WALL) * s
  ctx.fillStyle = COL.fieldA
  roundRect(ctx, fx, fy, fw, fh, CORNER * s * 0.6)
  ctx.fill()

  // faixas (listras) p/ leitura de profundidade
  ctx.fillStyle = COL.fieldB
  const stripes = 8
  for (let i = 0; i < stripes; i += 2) {
    ctx.save()
    roundRect(ctx, fx, fy, fw, fh, CORNER * s * 0.6)
    ctx.clip()
    ctx.fillRect(fx, fy + (fh / stripes) * i, fw, fh / stripes)
    ctx.restore()
  }

  // linha central
  ctx.strokeStyle = COL.line
  ctx.lineWidth = Math.max(1, 2 * s)
  ctx.beginPath()
  ctx.moveTo(fx, o.y + (pf.h / 2) * s)
  ctx.lineTo(fx + fw, o.y + (pf.h / 2) * s)
  ctx.stroke()
  // círculo central
  ctx.beginPath()
  ctx.arc(o.x + (pf.w / 2) * s, o.y + (pf.h / 2) * s, 60 * s, 0, Math.PI * 2)
  ctx.stroke()

  // gols (aberturas)
  const gw = GOAL_WIDTH * s
  const gx = o.x + (pf.w / 2) * s - gw / 2
  ctx.fillStyle = COL.goal
  ctx.fillRect(gx, o.y, gw, WALL * s) // topo
  ctx.fillRect(gx, o.y + (pf.h - WALL) * s, gw, WALL * s) // base
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = Math.max(2, 3 * s)
  ctx.strokeRect(gx, o.y + 2, gw, (WALL - 2) * s)
  ctx.strokeRect(gx, o.y + (pf.h - WALL) * s, gw, (WALL - 2) * s)

  // pegs (jogadores estáticos): cor do time + número
  for (const p of state.pegs) {
    const sp = worldToScreen(r, p)
    const team = p.team === 'A' ? state.teamA : state.teamB
    ctx.beginPath()
    ctx.arc(sp.x, sp.y, p.radius * s, 0, Math.PI * 2)
    ctx.fillStyle = team.colorPrimary
    ctx.fill()
    ctx.lineWidth = Math.max(1, 2 * s)
    ctx.strokeStyle = '#0a0a0a'
    ctx.stroke()
    ctx.fillStyle = team.colorSecondary || contrastText(team.colorPrimary)
    ctx.font = `bold ${Math.round(p.radius * s)}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(p.number), sp.x, sp.y + 1)
  }

  // linha-guia de mira (no sentido do disparo)
  if (aim && aim.fired) {
    const bs = worldToScreen(r, state.ball)
    const len = (aim.power / 220) * 140 + 20
    ctx.strokeStyle = COL.guide
    ctx.lineWidth = Math.max(2, 4 * s)
    ctx.setLineDash([8 * s, 6 * s])
    ctx.beginPath()
    ctx.moveTo(bs.x, bs.y)
    ctx.lineTo(bs.x + aim.dir.x * len, bs.y + aim.dir.y * len)
    ctx.stroke()
    ctx.setLineDash([])
    // ponta da seta
    ctx.fillStyle = COL.guide
    const hx = bs.x + aim.dir.x * len
    const hy = bs.y + aim.dir.y * len
    ctx.beginPath()
    ctx.arc(hx, hy, 5 * s, 0, Math.PI * 2)
    ctx.fill()
  }

  // bola
  const bs = worldToScreen(r, state.ball)
  ctx.beginPath()
  ctx.arc(bs.x, bs.y, state.ball.radius * s, 0, Math.PI * 2)
  ctx.fillStyle = COL.ball
  ctx.fill()
  ctx.lineWidth = Math.max(1, 2 * s)
  ctx.strokeStyle = COL.ballEdge
  ctx.stroke()
}

// Texto contrastante simples (preto/branco) a partir de uma cor hex.
function contrastText(hex) {
  const c = hex.replace('#', '')
  if (c.length < 6) return '#000'
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.6 ? '#0a0a0a' : '#ffffff'
}
