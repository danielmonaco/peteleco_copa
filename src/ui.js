// Telas DOM do fluxo: menu, seleção (48), config e fim de jogo. FLOW-01,02,03,05.
import { TEAMS, getTeam } from './teams.js'
import { DIFFICULTY_ORDER, getDifficulty } from './difficulty.js'

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v
    else if (k === 'text') node.textContent = v
    else if (k === 'html') node.innerHTML = v
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v)
    else if (v != null) node.setAttribute(k, v)
  }
  for (const c of [].concat(children)) if (c) node.appendChild(c)
  return node
}

export function createUI(root, handlers = {}) {
  const sel = { A: null, B: null }
  const cfg = { touchesPerTurn: 3, goalsToWin: 5, difficulty: 'medio' }
  const screens = {}

  // --- Menu ---
  screens.menu = el('section', { class: 'screen', hidden: 'true' }, [
    el('div', { class: 'spacer' }),
    el('h1', { class: 'title', text: '⚽ Peteleco da Copa' }),
    el('p', { class: 'subtitle', text: '2 jogadores no mesmo aparelho' }),
    el('div', { class: 'center' }, [
      el('button', { class: 'btn btn-primary', style: 'min-width:200px', text: '▶ Jogar', onclick: () => showSelect() }),
      el('button', { class: 'btn', text: '? Como jogar', onclick: () => toggleHint() }),
      el('p', { class: 'subtitle', id: 'menu-hint', hidden: 'true', text: 'Arraste a partir da bola e solte para petelecar — como um estilingue. A bola tem atrito alto e para rápido.' }),
    ]),
    el('div', { class: 'spacer' }),
  ])
  const menuHint = screens.menu.querySelector('#menu-hint')
  function toggleHint() {
    if (menuHint.hasAttribute('hidden')) menuHint.removeAttribute('hidden')
    else menuHint.setAttribute('hidden', 'true')
  }

  // --- Seleção de times ---
  const continueBtn = el('button', { class: 'btn btn-primary', disabled: 'true', text: 'Continuar →', onclick: () => showConfig() })
  const sideA = buildSide('A', 'Jogador 1')
  const sideB = buildSide('B', 'Jogador 2')
  screens.select = el('section', { class: 'screen', hidden: 'true' }, [
    el('h1', { class: 'title', text: 'Escolha as seleções' }),
    el('div', { class: 'sides' }, [sideA.node, sideB.node]),
    el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn', text: '← Voltar', onclick: () => showMenu() }),
      continueBtn,
    ]),
  ])

  function buildSide(side, labelText) {
    const chosen = el('span', { class: 'chosen', text: '—' })
    const grid = el('div', { class: 'grid' })
    for (const t of TEAMS) {
      const card = el('button', {
        class: 'team-card', 'data-code': t.code, 'aria-pressed': 'false',
        title: t.name,
        onclick: () => pick(side, t.code),
      }, [
        el('span', { class: 'flag', text: t.flag }),
        el('span', { class: 'code', text: t.code }),
        el('span', { class: 'name', text: t.name }),
        el('span', { class: 'swatch', style: `background:${t.colorPrimary}` }),
      ])
      grid.appendChild(card)
    }
    const node = el('div', { class: 'side' }, [
      el('h2', { html: `${labelText}: <span class="chosen-wrap"></span>` }),
      grid,
    ])
    node.querySelector('.chosen-wrap').appendChild(chosen)
    return { node, grid, chosen }
  }

  function pick(side, code) {
    sel[side] = code
    const s = side === 'A' ? sideA : sideB
    for (const card of s.grid.children) {
      const on = card.getAttribute('data-code') === code
      card.classList.toggle('selected', on)
      card.setAttribute('aria-pressed', on ? 'true' : 'false')
    }
    const t = getTeam(code)
    s.chosen.textContent = `${t.flag} ${t.name}`
    continueBtn.disabled = !(sel.A && sel.B)
  }

  // --- Config ---
  const segTouches = buildSeg([['2', 2], ['3', 3], ['4', 4]], cfg.touchesPerTurn, (v) => (cfg.touchesPerTurn = v))
  const segGoals = buildSeg([['3 gols', 3], ['5 gols', 5]], cfg.goalsToWin, (v) => (cfg.goalsToWin = v))
  const segDiff = buildSeg(
    DIFFICULTY_ORDER.map((k) => [getDifficulty(k).label, k]),
    cfg.difficulty,
    (v) => (cfg.difficulty = v),
  )
  screens.config = el('section', { class: 'screen', hidden: 'true' }, [
    el('h1', { class: 'title', text: 'Configuração' }),
    el('div', { class: 'center' }, [
      el('div', { class: 'config-list' }, [
        field('Toques por vez', segTouches.node),
        field('Gols para vencer', segGoals.node),
        field('Dificuldade', segDiff.node),
      ]),
    ]),
    el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn', text: '← Voltar', onclick: () => showSelect() }),
      el('button', { class: 'btn btn-primary', text: 'Começar ⚽', onclick: () => start() }),
    ]),
  ])

  function field(labelText, control) {
    return el('div', { class: 'field' }, [el('label', { text: labelText }), control])
  }

  function buildSeg(options, initial, onChange) {
    const buttons = []
    const node = el('div', { class: 'seg' })
    for (const [label, value] of options) {
      const b = el('button', {
        text: label, 'aria-pressed': value === initial ? 'true' : 'false',
        onclick: () => {
          onChange(value)
          for (const bb of buttons) bb.setAttribute('aria-pressed', bb === b ? 'true' : 'false')
        },
      })
      buttons.push(b)
      node.appendChild(b)
    }
    return { node }
  }

  // --- Fim de jogo ---
  const overBody = el('div', { class: 'over-card' })
  screens.over = el('section', { class: 'screen', hidden: 'true' }, [
    el('div', { class: 'spacer' }),
    el('h1', { class: 'title', text: 'Fim de jogo' }),
    el('div', { class: 'center' }, [overBody]),
    el('div', { class: 'actions' }, [
      el('button', { class: 'btn btn-primary', text: '↻ Jogar de novo', onclick: () => handlers.onRematch && handlers.onRematch() }),
      el('button', { class: 'btn', text: '⇄ Trocar times', onclick: () => { showSelect(); handlers.onChangeTeams && handlers.onChangeTeams() } }),
    ]),
    el('div', { class: 'spacer' }),
  ])

  for (const s of Object.values(screens)) root.appendChild(s)

  // --- Controle de visibilidade ---
  function hideAll() {
    for (const s of Object.values(screens)) s.setAttribute('hidden', 'true')
  }
  function show(key) { hideAll(); screens[key].removeAttribute('hidden') }
  function showMenu() { show('menu') }
  function showSelect() { show('select') }
  function showConfig() { show('config') }
  function start() {
    hideAll()
    if (handlers.onStart) handlers.onStart(sel.A, sel.B, { ...cfg })
  }
  function showGameOver(winner, scoreA, scoreB, teamA, teamB) {
    const win = winner === 'A' ? teamA : teamB
    overBody.replaceChildren(
      el('div', { class: 'over-winner', style: `color:${win.colorPrimary}`, text: `${win.flag} ${win.name}` }),
      el('div', { class: 'over-score', text: `${scoreA} × ${scoreB}` }),
    )
    show('over')
  }

  return { showMenu, showSelect, showConfig, showGameOver, hideAll }
}
