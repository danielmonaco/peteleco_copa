// Loop do jogo, máquina de fases e wiring de Pointer Events. CORE-02..06 (integração).
import { FIXED_DT } from './constants.js'
import { step, applyImpulse, isBallStopped } from './physics.js'
import { computeFlick, isPointerOnBall } from './input.js'
import { consumeTouch, onBallSettled, registerGoal } from './turns.js'
import { resetBall, setDifficulty } from './state.js'
import { DIFFICULTY_ORDER, getDifficulty } from './difficulty.js'
import { createRenderer, resize, draw, worldToScreen, screenToWorld } from './render.js'
import { playFlick, playGoal, playWhistle, isMuted, toggleMute } from './audio.js'

export function createGame(canvas, state, opts = {}) {
  const r = createRenderer(canvas)
  const manageScreens = opts.manageScreens !== false // default true (modo standalone)
  const onGameOver = typeof opts.onGameOver === 'function' ? opts.onGameOver : null
  const onMenuRequest = typeof opts.onMenuRequest === 'function' ? opts.onMenuRequest : null

  let raf = 0
  let last = 0
  let acc = 0
  let goalFlash = 0       // segundos restantes de comemoração
  let goalScorer = null
  let gameOverFired = false

  // Pausa (FR-015)
  let paused = false

  // Tutorial (FR-012): mostra na 1ª jogada; pode ser revisto via "?"
  let showTutorial = true
  let tutorialTimer = 0   // segundos restantes do re-show via "?"

  // estado de mira (em px de tela, p/ feel consistente entre escalas)
  let aiming = false
  let ballScreenAtStart = null
  let pointerScreen = null

  function currentAim() {
    if (!aiming || !pointerScreen) return null
    return computeFlick(ballScreenAtStart, pointerScreen)
  }

  function update(dt) {
    if (paused) return
    if (goalFlash > 0) goalFlash = Math.max(0, goalFlash - dt)
    if (tutorialTimer > 0) tutorialTimer = Math.max(0, tutorialTimer - dt)
    if (state.phase !== 'ballMoving') return
    const goal = step(state, dt)
    if (goal) {
      goalScorer = registerGoal(state, goal)
      goalFlash = 1.4
      playGoal()
      if (state.phase === 'gameover' && onGameOver && !gameOverFired) {
        gameOverFired = true
        setTimeout(playWhistle, 600) // apito um pouco depois da fanfarra de gol
        onGameOver(state.winner)
      }
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
    if (state.phase === 'config') {
      if (manageScreens) drawConfig()
    } else {
      drawHud()
      if (goalFlash > 0) drawGoalFlash()
      if (showTutorial || tutorialTimer > 0) drawTutorial()
      if (paused) drawPauseOverlay()
      if (manageScreens && state.phase === 'gameover') drawGameOver()
    }
    raf = requestAnimationFrame(frame)
  }

  // --- Pointer Events (mouse + toque unificados) ---
  function toScreen(e) {
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onDown(e) {
    const sp = toScreen(e)

    // Overlay de pausa: só os botões de pausa respondem
    if (paused) {
      const hit = hitButton(pauseButtons(), sp)
      if (hit) handlePauseButton(hit.key)
      return
    }

    if (state.phase === 'config') {
      if (!manageScreens) return
      const hit = hitButton(difficultyButtons(), sp)
      if (hit) { setDifficulty(state, hit.key); restart() }
      return
    }
    if (state.phase === 'gameover') {
      if (!manageScreens) return
      const hit = hitButton(gameOverButtons(), sp)
      if (hit && hit.key === 'difficulty') state.phase = 'config'
      else restart()
      return
    }

    // Botões do HUD (só durante jogo ativo)
    if (state.phase === 'playing' || state.phase === 'ballMoving') {
      const hit = hitButton(hudActionButtons(), sp)
      if (hit) {
        if (hit.key === 'pause') { paused = true }
        else if (hit.key === 'mute') { toggleMute() }
        else if (hit.key === 'help') { tutorialTimer = 3.0 }
        return
      }
    }

    if (state.phase !== 'playing') return
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
      playFlick()
      showTutorial = false // FR-012: dispensa tutorial na 1ª jogada
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
    gameOverFired = false
    paused = false
    showTutorial = true
    tutorialTimer = 0
  }

  // --- Layout de botões ---

  function hudActionButtons() {
    const W = canvas.clientWidth
    const sz = 36
    const gap = 6
    const top = 8
    const buttons = [{ key: 'pause', label: '⏸', x: W - 44, y: top, w: sz, h: sz }]
    buttons.push({ key: 'mute', label: isMuted() ? '🔇' : '🔊', x: W - 44 - sz - gap, y: top, w: sz, h: sz })
    if (!showTutorial) {
      buttons.push({ key: 'help', label: '?', x: W - 44 - 2 * (sz + gap), y: top, w: sz, h: sz })
    }
    return buttons
  }

  function difficultyButtons() {
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const bw = Math.min(W * 0.74, 340)
    const bh = 66
    const gap = 18
    const total = DIFFICULTY_ORDER.length * bh + (DIFFICULTY_ORDER.length - 1) * gap
    const x = (W - bw) / 2
    let y = H / 2 - total / 2 + 20
    return DIFFICULTY_ORDER.map((key) => {
      const d = getDifficulty(key)
      const b = { key, label: d.label, x, y, w: bw, h: bh }
      y += bh + gap
      return b
    })
  }

  function gameOverButtons() {
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const bw = Math.min(W * 0.74, 320)
    const bh = 60
    const gap = 14
    const x = (W - bw) / 2
    const y0 = H / 2 + 70
    return [
      { key: 'replay', label: '↻ Jogar de novo', x, y: y0, w: bw, h: bh },
      { key: 'difficulty', label: '⚙ Mudar dificuldade', x, y: y0 + bh + gap, w: bw, h: bh },
    ]
  }

  function pauseButtons() {
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const bw = Math.min(W * 0.74, 320)
    const bh = 58
    const gap = 14
    const x = (W - bw) / 2
    let y = H / 2 - (3 * bh + 2 * gap) / 2 + 30
    return [
      { key: 'continue', label: '▶ Continuar', x, y, w: bw, h: bh },
      { key: 'restart', label: '↻ Reiniciar partida', x, y: (y += bh + gap, y), w: bw, h: bh },
      { key: 'menu', label: '⇦ Sair para o menu', x, y: (y += bh + gap, y), w: bw, h: bh },
    ]
  }

  function handlePauseButton(key) {
    if (key === 'continue') {
      paused = false
    } else if (key === 'restart') {
      restart()
    } else if (key === 'menu') {
      paused = false
      stop()
      if (onMenuRequest) onMenuRequest()
    }
  }

  function hitButton(buttons, p) {
    return buttons.find((b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) || null
  }

  // --- Funções de desenho ---

  function drawButton(b, active) {
    const ctx = r.ctx
    ctx.fillStyle = active ? '#ffd83d' : 'rgba(255,255,255,0.12)'
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 14)
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = active ? '#ffd83d' : 'rgba(255,255,255,0.6)'
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 14)
    ctx.stroke()
    ctx.fillStyle = active ? '#10240f' : '#ffffff'
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2)
  }

  function drawHudButton(b) {
    const ctx = r.ctx
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 10)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1.5
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 10)
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.font = `${b.key === 'help' ? 'bold ' : ''}18px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2)
  }

  function roundRectPath(ctx, x, y, w, h, rad) {
    ctx.beginPath()
    ctx.moveTo(x + rad, y)
    ctx.arcTo(x + w, y, x + w, y + h, rad)
    ctx.arcTo(x + w, y + h, x, y + h, rad)
    ctx.arcTo(x, y + h, x, y, rad)
    ctx.arcTo(x, y, x + w, y, rad)
    ctx.closePath()
  }

  function drawConfig() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, W, H)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 26px system-ui, sans-serif'
    ctx.fillText('Escolha a dificuldade', W / 2, H / 2 - difficultyButtons().length * 44 - 6)
    for (const b of difficultyButtons()) drawButton(b, state.difficulty === b.key)
  }

  function drawHud() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const s = r.scale
    const pf = state.playfield
    const fieldTop = r.oy
    const fieldBot = r.oy + pf.h * s
    // resize() garante r.oy >= BADGE_V: sempre há espaço fora do campo para os badges.
    const yTop = fieldTop / 2
    const yBottom = fieldBot + (H - fieldBot) / 2
    drawTeamBadge(W / 2, yTop, state.teamB, state.scoreB, state.currentTeam === 'B')
    drawTeamBadge(W / 2, yBottom, state.teamA, state.scoreA, state.currentTeam === 'A')
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '13px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(getDifficulty(state.difficulty).label, 12, 12)
    // Botões de ação (pausa, mudo, ajuda)
    if (state.phase === 'playing' || state.phase === 'ballMoving') {
      for (const b of hudActionButtons()) drawHudButton(b)
    }
  }

  function drawTeamBadge(cx, y, team, score, active) {
    const ctx = r.ctx
    const dots = active
      ? '  ' + '●'.repeat(state.touchesLeft) + '○'.repeat(state.touchesPerTurn - state.touchesLeft)
      : ''
    const label = `${team.flag} ${team.name}  ${score}${dots}`
    ctx.font = `bold ${active ? 19 : 16}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const w = ctx.measureText(label).width + 26
    const h = 32
    ctx.fillStyle = active ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.42)'
    roundRectPath(ctx, cx - w / 2, y - h / 2, w, h, 16)
    ctx.fill()
    if (active) {
      ctx.strokeStyle = team.colorPrimary
      ctx.lineWidth = 2.5
      roundRectPath(ctx, cx - w / 2, y - h / 2, w, h, 16)
      ctx.stroke()
    }
    ctx.fillStyle = active ? '#ffffff' : 'rgba(255,255,255,0.85)'
    ctx.fillText(label, cx, y)
  }

  // FR-014: comemoração com painel animado, bandeira e nome do time
  function drawGoalFlash() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const team = goalScorer === 'A' ? state.teamA : state.teamB
    const prog = goalFlash / 1.4
    const alpha = prog < 0.15 ? prog / 0.15 : 1.0
    const scale = prog > 0.85 ? 1 + (prog - 0.85) / 0.15 * 0.28 : 1.0

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(W / 2, H / 2)
    ctx.scale(scale, scale)

    const bw = Math.min(W * 0.72, 310)
    const bh = 110
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    roundRectPath(ctx, -bw / 2, -bh / 2, bw, bh, 18)
    ctx.fill()
    ctx.strokeStyle = team.colorPrimary
    ctx.lineWidth = 3
    roundRectPath(ctx, -bw / 2, -bh / 2, bw, bh, 18)
    ctx.stroke()

    const golSize = Math.round(Math.min(W, H) * 0.13)
    ctx.font = `bold ${golSize}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = team.colorPrimary
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 4
    ctx.strokeText('GOL!', 0, -20)
    ctx.fillText('GOL!', 0, -20)

    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.fillStyle = '#fff'
    ctx.lineWidth = 0
    ctx.fillText(`${team.flag} ${team.name}`, 0, 26)

    ctx.restore()
  }

  // FR-012: tutorial relâmpago (anel pulsante + texto)
  function drawTutorial() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const t = Date.now() / 1000
    const pulse = 0.5 + 0.5 * Math.sin(t * 3)
    const alpha = tutorialTimer > 0 && !showTutorial ? Math.min(1, tutorialTimer / 0.4) : 1

    const bs = worldToScreen(r, state.ball)
    const br = state.ball.radius * r.scale

    ctx.save()
    ctx.globalAlpha = alpha

    // Anel pulsante ao redor da bola
    ctx.beginPath()
    ctx.arc(bs.x, bs.y, br + 7 + pulse * 5, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,220,50,${0.45 + pulse * 0.45})`
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Linha tracejada animada sugerindo o gesto de arrastar
    const cycle = (t % 1.0) / 1.0
    const dragLen = 44 * Math.min(cycle * 2.5, 1)
    const dx = -dragLen * 0.7071
    const dy = -dragLen * 0.7071
    ctx.save()
    ctx.strokeStyle = 'rgba(255,220,50,0.8)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(bs.x, bs.y)
    ctx.lineTo(bs.x + dx, bs.y + dy)
    ctx.stroke()
    ctx.restore()

    // Caixa de texto na base da tela
    const text = '👆 Arraste a bola e solte!'
    ctx.font = 'bold 15px system-ui, sans-serif'
    const tw = ctx.measureText(text).width
    const bw = tw + 22
    const bh = 32
    const ty = H - 54
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    roundRectPath(ctx, W / 2 - bw / 2, ty - bh / 2, bw, bh, 10)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, W / 2, ty)

    ctx.restore()
  }

  // FR-015: overlay de pausa
  function drawPauseOverlay() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    ctx.fillStyle = 'rgba(0,0,0,0.68)'
    ctx.fillRect(0, 0, W, H)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 26px system-ui, sans-serif'
    const btns = pauseButtons()
    ctx.fillText('⏸ PAUSA', W / 2, btns[0].y - 42)
    for (const b of btns) drawButton(b, false)
  }

  function drawGameOver() {
    const ctx = r.ctx
    ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0)
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
    ctx.fillText(`${state.scoreA} × ${state.scoreB}`, W / 2, H / 2 + 30)
    for (const b of gameOverButtons()) drawButton(b, false)
  }

  const onCancel = () => { aiming = false; pointerScreen = null }
  const onResize = () => resize(r)

  function start() {
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onCancel)
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    cancelAnimationFrame(raf)
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onCancel)
    window.removeEventListener('resize', onResize)
  }

  return { start, stop, restart, state, renderer: r }
}
