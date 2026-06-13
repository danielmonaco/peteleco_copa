# Match Flow & UI Tasks

**Design**: `.specs/features/match-flow-ui/design.md`
**Testing**: `.specs/codebase/TESTING.md`
**Status**: Done (T1–T6; 44/44 unit verdes; jornada verificada no navegador incl. 320px, 2026-06-13)

---

## Execution Plan

### Phase 1 — Bases independentes (Parallel)

```
T1 [P] teams 48 + withDistinctColor
T2 [P] game.js motor (manageScreens/onGameOver)
T3 [P] index.html telas DOM + CSS acessível
```

### Phase 2 — Telas

```
(T1, T3) → T4 ui.js (menu/seleção/config/fim)
```

### Phase 3 — Orquestração

```
(T4, T2) → T5 app.js (flow + cor distinta + entry)
```

### Phase 4 — Verificação

```
T5 → T6 jornada + 320px + build
```

---

## Task Breakdown

### T1: Seleções (48 provisórias) + cor distinta [P]

**What**: expandir `teams.js` para 48 seleções reais (flag emoji + nome pt-BR + cores), provisórias/editáveis (B-01), e `withDistinctColor(team, takenColor)`.
**Where**: `src/teams.js`, `src/teams.test.js`
**Depends on**: None
**Reuses**: formato `Team` (PRD §10)
**Requirement**: FLOW-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] `TEAMS` tem 48 itens, todos com `code` único (3 letras), `name`, `flag`, `colorPrimary`.
- [ ] `getTeam(code)` retorna o time; fallback no 1º.
- [ ] `withDistinctColor` retorna um time com `colorPrimary` diferente de `takenColor`.
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 4 testes passam.

**Tests**: unit
**Gate**: quick
**Commit**: `feat(teams): 48 seleções provisórias + cor distinta p/ times iguais`

---

### T2: Núcleo como motor (manageScreens/onGameOver) [P]

**What**: `createGame(canvas, state, opts)` aceita `opts.manageScreens` (default true) e `opts.onGameOver`; com `false`, não desenha `drawConfig`/`drawGameOver` nem trata seus toques, e chama `onGameOver(winner)` uma vez ao entrar em `gameover`.
**Where**: `src/game.js` (modify)
**Depends on**: None
**Reuses**: loop/HUD existentes
**Requirement**: suporte a FLOW-01/04 (integração com app)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] Modo default (`manageScreens` ausente) mantém comportamento atual (seletor/fim no canvas).
- [ ] Com `manageScreens=false`: sem overlays de config/fim no canvas; `onGameOver` dispara 1× na vitória.
- [ ] HUD continua desenhando durante a partida.
- [ ] `npx vitest run` segue verde (sem regressão).

**Tests**: none (loop — verificação manual)
**Gate**: full
**Verify**: chamar com `manageScreens:false` e provocar vitória → callback dispara, sem overlay no canvas.
**Commit**: `feat(game): modo motor (manageScreens + onGameOver) p/ fluxo externo`

---

### T3: Telas DOM + CSS acessível [P]

**What**: em `index.html`, adicionar `#ui-root` com 4 telas (menu, seleção, config, fim) ocultáveis e CSS acessível (alvos ≥48px, fonte ≥18px, alto contraste, grade responsiva auto-fit).
**Where**: `index.html` (modify)
**Depends on**: None
**Reuses**: estilo dark existente
**Requirement**: FLOW-01, FLOW-05 (base)

**Tools**: MCP: NONE · Skill: `webapp-testing` (verificação visual)

**Done when**:
- [ ] Containers das 4 telas existem e alternam por classe/`hidden`.
- [ ] CSS garante alvos ≥48px e fonte de corpo ≥18px.
- [ ] Layout fluido em 320px sem rolagem horizontal.
- [ ] Console limpo.

**Tests**: none (manual)
**Gate**: full
**Verify**: abrir e inspecionar tamanhos/contraste; testar 320px.
**Commit**: `feat(ui): telas DOM (menu/seleção/config/fim) + CSS acessível`

---

### T4: `ui.js` — telas de menu, seleção, config e fim

**What**: `createUI(root, handlers)` controlando visibilidade e conteúdo: menu (Jogar), grade de seleção J1/J2 (48, flag+nome+code+swatch, 1 toque, destaque, "Continuar" só com ambos), config (toques 1/2/3, gols 3/5, dificuldade F/M/D, "Começar"), fim (vencedor+placar, "Jogar de novo", "Trocar times").
**Where**: `src/ui.js`
**Depends on**: T1, T3
**Reuses**: `teams.js`, `difficulty.js`
**Requirement**: FLOW-01, FLOW-02, FLOW-03, FLOW-05

**Tools**: MCP: NONE · Skill: `webapp-testing`

**Done when**:
- [ ] Grade lista 48 seleções; J1 e J2 escolhem em 1 toque com destaque.
- [ ] "Continuar" desabilitado até ambos escolherem.
- [ ] Config mostra toques/gols/dificuldade com padrões 3/5/Médio, botões grandes sem digitação.
- [ ] Tela de fim mostra vencedor (flag+nome) + placar e os 2 botões.
- [ ] Distinção de time mostra code (3 letras) além da cor (daltonismo).

**Tests**: none (DOM — manual)
**Gate**: full
**Verify**: percorrer as telas; conferir 1-toque, destaque e habilitação do "Continuar".
**Commit**: `feat(ui): controlador de telas (seleção 48, config, fim)`

---

### T5: `app.js` — orquestrador do fluxo

**What**: `app.js` mantém `appState`, liga `ui` ↔ `game`: menu→select→config→cria `createGame(..., {manageScreens:false, onGameOver})`→fim→(rematch|trocar times). Aplica `withDistinctColor` quando os dois escolhem igual. Troca o entry de `main.js` para `app.js` no `index.html`.
**Where**: `src/app.js`, `index.html` (script)
**Depends on**: T4, T2
**Reuses**: `createGame`, `createMatchState`, `withDistinctColor`
**Requirement**: FLOW-01..05 (integração)

**Tools**: MCP: NONE · Skill: `webapp-testing`

**Done when**:
- [ ] Fluxo completo navega menu→seleção→config→partida→fim e volta.
- [ ] Mesmo país nos dois lados → cores distintas na partida.
- [ ] "Jogar de novo" mantém times+config; "Trocar times" volta à seleção; partida anterior é parada (sem loop duplicado).
- [ ] `npx vitest run` segue verde.

**Tests**: none (integração — manual)
**Gate**: full
**Verify**: jornada completa no navegador, incl. mesmo país e os dois botões de fim.
**Commit**: `feat(app): orquestrador do fluxo de telas + integração com o motor`

---

### T6: Verificação de jornada + responsivo + build

**What**: jornada E2E manual (menu→…→fim→rematch/trocar), conferência 320px, e regerar `dist/index.html`.
**Where**: — (verificação), `scripts/build.mjs` (reuso)
**Depends on**: T5
**Reuses**: pipeline de build
**Requirement**: FLOW-01..05 (entrega)

**Tools**: MCP: NONE · Skill: `webapp-testing`

**Done when**:
- [ ] Jornada completa sem travar nem erro de console.
- [ ] 320px usável (sem rolagem horizontal; alvos ≥48px).
- [ ] `npm run build` gera `dist/index.html` autocontido com o fluxo completo.

**Tests**: none (manual)
**Gate**: build
**Verify**: jornada no preview + `npm run build` + abrir dist offline.
**Commit**: `build: jornada match-flow-ui verificada + bundle atualizado`

---

## Parallel Execution Map

```
Phase 1 (Parallel):  T1 [P]  T2 [P]  T3 [P]
Phase 2:             T4         (precisa T1 + T3)
Phase 3:             T5         (precisa T4 + T2)
Phase 4:             T6         (precisa T5)
```

T1/T2/T3 tocam arquivos distintos (teams.js / game.js / index.html) — sem estado compartilhado, paralelo-seguro.

---

## ✅ Pre-Approval Validation

### Check 1 — Task Granularity

| Task | Escopo | Status |
|---|---|---|
| T1 teams 48 | 1 módulo de dados + helper | ✅ Granular |
| T2 game motor | 1 ajuste coeso em 1 arquivo | ✅ Granular |
| T3 DOM+CSS | 1 arquivo (index.html) | ✅ Granular |
| T4 ui.js | 1 módulo (telas) | ✅ Coeso |
| T5 app.js | 1 módulo (orquestração) | ✅ Coeso |
| T6 verificação | jornada + build | ✅ Granular |

### Check 2 — Diagram ↔ Definition Cross-Check

| Task | Depends on (corpo) | Diagrama | Status |
|---|---|---|---|
| T1 | None | Phase 1 [P] | ✅ |
| T2 | None | Phase 1 [P] | ✅ |
| T3 | None | Phase 1 [P] | ✅ |
| T4 | T1, T3 | (T1,T3)→T4 | ✅ |
| T5 | T4, T2 | (T4,T2)→T5 | ✅ |
| T6 | T5 | T5→T6 | ✅ |

### Check 3 — Test Co-location Validation

| Task | Camada | Matrix exige | Task diz | Status |
|---|---|---|---|---|
| T1 | Dados/config (teams) | unit | unit | ✅ |
| T2 | Loop/motor | manual(none) | none | ✅ |
| T3 | UI/DOM | manual(none) | none | ✅ |
| T4 | UI/DOM | manual(none) | none | ✅ |
| T5 | Integração/orquestração | manual(none) | none | ✅ |
| T6 | Build/E2E | manual(none) | none | ✅ |

Todas as checagens passam.

---

## Requirement Traceability (tasks)

| Req | Tasks | Status |
|---|---|---|
| FLOW-01 | T3, T4, T5 | Verified |
| FLOW-02 | T1, T4, T5 | Verified |
| FLOW-03 | T4 | Verified |
| FLOW-04 | T2 (HUD já em core) | Verified |
| FLOW-05 | T3, T4 | Verified |

**Coverage:** 5/5 mapeados a tasks. 5 verificados (unit teams + verificação manual no navegador).
