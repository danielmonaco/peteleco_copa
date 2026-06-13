// Loop do jogo, máquina de fases e wiring de Pointer Events. CORE-02..06 (integração).
import { FIXED_DT } from './constants.js'
import { step, applyImpulse, isBallStopped } from './physics.js'
import { computeFlick, isPointerOnBall } from './input.js'
import { consumeTouch, onBallSettled, registerGoal } from './turns.js'
import { resetBall } from './state.js'
import { createRenderer, resize, draw, worldToScreen, screenToWorld } from './render.js'

export function createGame(canvas, state) {
  const r = createRenderer(canvas)

  let raf = 0
  let last = 0
  let acc = 0
  let goalFlash = 0 // segundos restantes de comemoração mínima
  let goalScorer = null

  // estado de mira (em px de tela, p/ feel consistente entre escalas)
  let aiming = false
  let ballScreenAtStart = null
  let pointerScreen = null

  function currentAim() {
    if (!aiming || !pointerScreen) return null
    return computeFlick(ballScreenAtStart, pointerScreen)
  }

  function update(dt) {
    if (goalFlash > 0) goalFlash = Math.max(0, goalFlash - dt)
    if (state.phase !== 'ballMoving') return
    const goal = step(state, dt)
    if (goal) {
      goalScorer = registerGoal(state, goal) // repõe bola, define saída, vitória
      goalFlash = 1.4
    } else if (isBallStopped(state.ball)) {
      onBallSettled(state)
    }
  }

  function frame(ts) {
    if (!last) last = ts
    let dt = (ts - last) / 1000
    last = ts
    if (dt > 0.25) dt = 0.25
    acc += dt
    while (acc >= FIXED_DT) {
      update(FIXED_DT)
      acc -= FIXED_DT
    }
    draw(r, state, currentAim())
    drawHud()
    if (goalFlash > 0) drawGoalFlash()
    if (state.phase === 'gameover') drawGameOver()
    raf = requestAnimationFrame(frame)
  }

  // --- Pointer Events (mouse + toque unificados) ---
  function toScreen(e) {
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onDown(e) {
    if (state.phase === 'gameover') {
      restart()
      return
    }
    if (state.phase !== 'playing') return // bloqueia durante ballMoving
    const sp = toScreen(e)
    const wp = screenToWorld(r, sp.x, sp.y)
    if (isPointerOnBall(state.ball, wp)) {
      aiming = true
      ballScreenAtStart = worldToScreen(r, state.ball)
      pointerScreen = sp
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId)
      e.preventDefault()
    }
  }

  function onMove(e) {
    if (!aiming) return
    pointerScreen = toScreen(e)
    e.preventDefault()
  }

  function onUp(e) {
    if (!aiming) return
    aiming = false
    const sp = toScreen(e)
    const flick = computeFlick(ballScreenAtStart, sp)
    pointerScreen = null
    if (flick.fired) {
      applyImpulse(state.ball, flick.vx, flick.vy)
      consumeTouch(state)
      state.phase = 'ballMoving'
    }
    e.preventDefault()
  }

  function restart() {
    state.scoreA = 0
    state.scoreB = 0
    state.winner = null
    state.currentTeam = 'A'
    state.touchesLeft = state.touchesPerTurn
    resetBall(state.ball, state.playfield)
    state.phase = 'playing'
    goalFlash = 0
  }

  // --- HUD mínimo (verificação do núcleo; HUD completo é match-flow-ui / FLOW-04) ---
  function drawHud() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
    const W = canvas.clientWidth
    const turnTeam = state.currentTeam === 'A' ? state.teamA : state.teamB
    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillStyle = state.teamA.colorPrimary
    ctx.fillText(`${state.teamA.flag} ${state.scoreA}`, 12, 10)
    ctx.textAlign = 'right'
    ctx.fillStyle = state.teamB.colorPrimary
    ctx.fillText(`${state.scoreB} ${state.teamB.flag}`, W - 12, 10)
    // vez + toques
    ctx.textAlign = 'center'
    ctx.fillStyle = turnTeam.colorPrimary
    const dots = '●'.repeat(state.touchesLeft) + '○'.repeat(state.touchesPerTurn - state.touchesLeft)
    ctx.fillText(`${turnTeam.flag} ${turnTeam.name}  ${dots}`, W / 2, 12)
  }

  function drawGoalFlash() {
    const ctx = r.ctx
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const team = goalScorer === 'A' ? state.teamA : state.teamB
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${Math.round(Math.min(W, H) * 0.16)}px system-ui, sans-serif`
    ctx.fillStyle = team.colorPrimary
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 4
    ctx.strokeText('GOL!', W / 2, H / 2)
    ctx.fillText('GOL!', W / 2, H / 2)
  }

  function drawGameOver() {
    const ctx = r.ctx
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    ctx.fillStyle = 'rgba(0,0,0,0.62)'
    ctx.fillRect(0, 0, W, H)
    const win = state.winner === 'A' ? state.teamA : state.teamB
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px system-ui, sans-serif'
    ctx.fillText('FIM DE JOGO', W / 2, H / 2 - 70)
    ctx.font = `bold ${Math.round(Math.min(W, H) * 0.1)}px system-ui, sans-serif`
    ctx.fillStyle = win.colorPrimary
    ctx.fillText(`${win.flag} ${win.name}`, W / 2, H / 2 - 10)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 28px system-ui, sans-serif'
    ctx.fillText(`${state.scoreA} × ${state.scoreB}`, W / 2, H / 2 + 40)
    ctx.font = '18px system-ui, sans-serif'
    ctx.fillText('Toque para jogar de novo', W / 2, H / 2 + 90)
  }

  function start() {
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', () => { aiming = false; pointerScreen = null })
    window.addEventListener('resize', () => resize(r))
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    cancelAnimationFrame(raf)
  }

  return { start, stop, restart, renderer: r }
}
