# Core Gameplay Tasks

**Design**: `.specs/features/core-gameplay/design.md`
**Testing**: `.specs/codebase/TESTING.md`
**Status**: Done (T1–T11 implementados; 30/30 unit verdes; jornada verificada no navegador 2026-06-13)

---

## Execution Plan

### Phase 1 — Foundation (Sequential)

```
T1 → T2 → T3
```

### Phase 2 — Camadas independentes (Parallel)

Após T3, rodam em paralelo (arquivos isolados, unit parallel-safe):

```
        ┌→ T4 [P]  (física: integração/atrito)
T3 ─────┼→ T5 [P]  (input: mapeamento de peteleco)
        └→ T6 [P]  (render)
```

### Phase 3 — Cadeia de física (Sequential)

```
T4 ─→ T7 (colisões) ─→ T8 (detecção de gol)
```

### Phase 4 — Regras

```
T8 ─→ T9 (turnos/placar/vitória)
```

### Phase 5 — Integração e entrega (Sequential)

```
T9 ─→ T10 (loop + wiring) ─→ T11 (bundle + jornada)
```

---

## Task Breakdown

### T1: Scaffold do projeto

**What**: Estrutura mínima — `package.json` (Vitest), `vitest.config.js`, pasta `src/`, `index.html` shell com `<canvas>`, e `scripts/build.mjs` (bundle stub).
**Where**: `package.json`, `vitest.config.js`, `index.html`, `src/.gitkeep`, `scripts/build.mjs`
**Depends on**: None
**Reuses**: —
**Requirement**: (infra para CORE-01..06)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] `npm install` instala Vitest.
- [ ] `npx vitest run` roda (0 testes, exit 0).
- [ ] `npm run build` existe e gera/copia um `index.html` abrível no navegador.
- [ ] `index.html` mostra um `<canvas>` vazio sem erro de console.

**Tests**: none
**Gate**: build
**Verify**: `npm run build` → abrir `index.html` → canvas presente, console limpo.
**Commit**: `chore: scaffold projeto peteleco-da-copa (vitest + canvas shell)`

---

### T2: Modelo de estado `MatchState`

**What**: `state.js` com o enum de fases e uma factory `createMatchState(teamA, teamB, config)` que aplica defaults (touches=3, goals=5) e posiciona campos iniciais.
**Where**: `src/state.js`, `src/state.test.js`
**Depends on**: T1
**Reuses**: tipos do design (Ball, Peg, MatchState)
**Requirement**: CORE-04 (estado base p/ turnos), suporte a CORE-01..06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] `createMatchState` retorna `phase='playing'`, `scoreA/B=0`, `touchesLeft=touchesPerTurn`, `currentTeam` definido, `winner=null`.
- [ ] Defaults aplicados quando config omitida (3 toques, 5 gols).
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 3 testes passam (defaults, override, shape inicial).

**Tests**: unit
**Gate**: quick
**Commit**: `feat(state): MatchState factory com defaults de config`

---

### T3: Geometria da arena e pegs

**What**: `arena.js` — `buildArena(playfield)` (paredes/arcos + aberturas de gol), `buildPegs(playfield)` (5 por time, formação fixa espelhada, com número), `goalLine(side)`.
**Where**: `src/arena.js`, `src/arena.test.js`
**Depends on**: T2
**Reuses**: dimensões do playfield (600×900)
**Requirement**: CORE-01, base p/ CORE-02/CORE-05

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] `buildPegs` retorna exatamente 10 pegs (5 A + 5 B), com `number` único por time e posições espelhadas (A.y ↔ B.y).
- [ ] `goalLine('top'|'bottom')` retorna `{ y, xMin, xMax }` com `xMin < xMax` centrado no campo.
- [ ] `buildArena` expõe segmentos de parede e as duas aberturas de gol.
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 4 testes passam.

**Tests**: unit
**Gate**: quick
**Commit**: `feat(arena): geometria do campo, pegs espelhados e linhas de gol`

---

### T4: Física — integração, atrito e settle [P]

**What**: `physics.js` parcial — `applyImpulse`, integração da bola por timestep fixo com damping exponencial, e `isBallStopped` (limiar + STOP_FRAMES). Sem colisões ainda.
**Where**: `src/physics.js`, `src/physics.test.js`
**Depends on**: T2
**Reuses**: constantes de calibragem (placeholder, ajustável)
**Requirement**: CORE-02 (parcial)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] Simulação: bola com impulso "médio" para (v≈0) em ≤ 1,5s de tempo simulado.
- [ ] `isBallStopped` vira true só após `speed < V_STOP` por `STOP_FRAMES` passos.
- [ ] Integração usa dt fixo (independe da frequência de chamada).
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 3 testes passam.

**Tests**: unit
**Gate**: quick
**Commit**: `feat(physics): integração com atrito alto e detecção de bola parada`

---

### T5: Input — mapeamento de peteleco (slingshot) [P]

**What**: `input.js` — função pura `computeFlick(ballPos, pointerPos, opts)` retornando `{ dir, power, dragLen, fired }`: direção oposta ao arrasto, força proporcional com teto, e `fired=false` quando `dragLen < MIN_DRAG(15)`.
**Where**: `src/input.js`, `src/input.test.js`
**Depends on**: T2
**Reuses**: —
**Requirement**: CORE-03 (lógica pura; wiring de Pointer Events fica em T10)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] `dir` é unitário e oposto ao vetor de arrasto (puxa pra trás).
- [ ] `power` cresce com o arrasto e satura no teto `MAX_DRAG`.
- [ ] `dragLen < 15` → `fired=false` (não dispara).
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 4 testes passam (direção, teto, min-drag, proporção).

**Tests**: unit
**Gate**: quick
**Commit**: `feat(input): mapeamento puro arrasto→direção/força com teto e min-drag`

---

### T6: Render do campo, pegs e bola [P]

**What**: `render.js` — `resize(canvas)` (transform world→screen sem perder estado), `worldToScreen/screenToWorld`, `draw(state, alpha)` desenhando campo retrato, 2 gols, 10 pegs (cor+número) e bola contrastante; linha-guia de mira quando há arrasto.
**Where**: `src/render.js`
**Depends on**: T3
**Reuses**: `arena.js` (geometria), transform compartilhada
**Requirement**: CORE-01

**Tools**: MCP: NONE · Skill: `webapp-testing` (verificação visual manual)

**Done when**:
- [ ] Campo em retrato, gols em cima/embaixo, 10 pegs distinguíveis por cor **e** número.
- [ ] Bola visível e contrastante; linha-guia aponta no sentido do disparo.
- [ ] `resize` reescala mantendo proporção, sem cortar gols (testar 320px e desktop).
- [ ] Console limpo ao renderizar.

**Tests**: none (manual)
**Gate**: full
**Verify**: abrir no navegador, redimensionar para 320px e desktop; conferir distinção dos times e ausência de corte.
**Commit**: `feat(render): campo top-down, pegs com cor+número e bola`

---

### T7: Física — colisões parede e peg (anti-tunneling)

**What**: estender `physics.step` com substeps por distância (≤ radius/2), reflexão círculo-parede e círculo-peg com restituição e correção posicional; bola nunca atravessa nem sai da arena.
**Where**: `src/physics.js` (modify), `src/physics.test.js` (modify)
**Depends on**: T4, T3
**Reuses**: `arena.buildArena` (segmentos/arcos/aberturas)
**Requirement**: CORE-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] Bola lançada em alta velocidade contra parede ricocheteia e permanece dentro da arena (sem tunneling em simulação).
- [ ] Colisão com peg desvia a bola; peg não se move.
- [ ] Após N passos, a posição da bola está sempre dentro dos limites da arena.
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 4 testes passam (reflexão parede, reflexão peg, contenção, peg imóvel).

**Tests**: unit
**Gate**: quick
**Commit**: `feat(physics): colisões parede/peg com substeps anti-tunneling`

---

### T8: Detecção de gol no passo de física

**What**: no `physics.step`, detectar cruzamento do centro da bola pela `goalLine` entre as traves dentro do substep; retornar `GoalEvent { side }` ou null. Bola parando na boca sem cruzar não conta.
**Where**: `src/physics.js` (modify), `src/physics.test.js` (modify)
**Depends on**: T7, T3
**Reuses**: `arena.goalLine`
**Requirement**: CORE-05 (detecção)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] Bola rápida cruzando entre as traves retorna `GoalEvent` no passo (não é perdida).
- [ ] Bola que para na boca sem cruzar a linha retorna null.
- [ ] Cruzamento fora do intervalo `[xMin,xMax]` não conta.
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 3 testes passam.

**Tests**: unit
**Gate**: quick
**Commit**: `feat(physics): detecção de gol por cruzamento de linha no substep`

---

### T9: Regras de turno, placar, gol e vitória

**What**: `turns.js` — `consumeTouch`, `onBallSettled` (troca de vez quando toques=0, senão mantém), `attributeGoal` (gol contra → adversário), `registerGoal` (placar++, reposição no centro, saída de quem sofreu), `checkWin`.
**Where**: `src/turns.js`, `src/turns.test.js`
**Depends on**: T8, T3, T2
**Reuses**: `MatchState`, `GoalEvent`, centro do playfield
**Requirement**: CORE-04, CORE-05, CORE-06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:
- [ ] `consumeTouch` decrementa; `onBallSettled` troca de vez só quando `touchesLeft===0` (bola fica onde parou).
- [ ] `registerGoal` incrementa o time certo, recoloca a bola no centro e dá a saída a quem sofreu.
- [ ] `attributeGoal` credita gol contra ao adversário.
- [ ] `checkWin` retorna vencedor quando `score >= goalsToWin`; sem empate.
- [ ] Gate check passes: `npx vitest run`
- [ ] Test count: ≥ 6 testes passam.

**Tests**: unit
**Gate**: quick
**Commit**: `feat(turns): toques, troca de vez, gol/saída e condição de vitória`

---

### T10: Game loop, máquina de fases e wiring

**What**: `game.js` — `startMatch`/`restartMatch`, loop `requestAnimationFrame` com acumulador de timestep fixo (render interpolado), `setPhase`, e o wiring de Pointer Events (`pointerdown/move/up/cancel`) → `computeFlick` → `applyImpulse` → física → `turns`; bloqueio de entrada em `ballMoving`; entra em `gameover` na vitória.
**Where**: `src/game.js`, `src/input.js` (attach de pointer)
**Depends on**: T5, T6, T8, T9
**Reuses**: todos os módulos anteriores
**Requirement**: CORE-02..06 (integração)

**Tools**: MCP: NONE · Skill: `webapp-testing` / preview tools (smoke manual)

**Done when**:
- [ ] Loop roda física em timestep fixo e render interpolado (≥ 50 fps no alvo).
- [ ] Arrastar na bola e soltar dispara coerente com a mira; arrasto <15px não consome toque.
- [ ] Entrada bloqueada enquanto a bola se move; ao parar, turnos avançam corretamente.
- [ ] Gol conta, comemora (sinal visual mínimo), repõe no centro; vitória → tela/fase de fim; `restartMatch` mantém times/config.
- [ ] Gate check passes: `npx vitest run` (suite anterior continua verde)
- [ ] Console limpo durante uma partida completa.

**Tests**: none (integração manual)
**Gate**: full
**Verify**: jornada manual — iniciar partida, petelecar com mouse e com toque, marcar gol, atingir os gols configurados, "jogar de novo".
**Commit**: `feat(game): loop com timestep fixo, máquina de fases e wiring de input`

---

### T11: Bundle arquivo único e verificação de jornada

**What**: finalizar `scripts/build.mjs` para embutir todos os módulos `src/` em `index.html` (arquivo único, JS inline); rodar a jornada E2E manual e checar performance.
**Where**: `scripts/build.mjs`, `index.html` (gerado)
**Depends on**: T10
**Reuses**: pipeline de build do T1
**Requirement**: CORE-01..06 (entrega), NFR (arquivo único, offline, perf)

**Tools**: MCP: NONE · Skill: `webapp-testing` / preview tools

**Done when**:
- [ ] `npm run build` gera um único `index.html` autocontido (sem imports externos).
- [ ] `index.html` aberto direto do disco roda a partida completa (offline).
- [ ] Jornada menu→partida→gol→vitória→jogar de novo sem travar (smoke; menu/seleção entram com `match-flow-ui`, aqui stub mínimo se necessário).
- [ ] ≥ 50 fps com bola em movimento (contador/DevTools) no alvo.

**Tests**: none (manual)
**Gate**: build
**Verify**: `npm run build` → abrir `index.html` offline → jornada + fps.
**Commit**: `build: bundle de arquivo único e verificação de jornada do núcleo`

---

## Parallel Execution Map

```
Phase 1 (Sequential):  T1 → T2 → T3
Phase 2 (Parallel after T3):
    ├── T4 [P]   física: integração/atrito
    ├── T5 [P]   input: mapeamento
    └── T6 [P]   render
Phase 3 (Sequential):  T7 → T8        (T7 precisa de T4+T3)
Phase 4:               T9             (precisa de T8+T3+T2)
Phase 5 (Sequential):  T10 → T11      (T10 precisa de T5+T6+T8+T9)
```

**Parallelism constraint:** T4/T5/T6 não compartilham estado mutável (arquivos distintos) e seus testes unit são parallel-safe (TESTING.md). T6 é manual (render) e pode correr junto sem conflito de arquivos.

---

## ✅ Pre-Approval Validation

### Check 1 — Task Granularity

| Task | Escopo | Status |
|---|---|---|
| T1 Scaffold | setup coeso (config + shell) | ✅ Coeso |
| T2 state.js | 1 módulo/factory | ✅ Granular |
| T3 arena.js | 1 módulo (geometria) | ✅ Granular |
| T4 physics (integração) | 1 arquivo, 1 conceito | ✅ Granular |
| T5 input (computeFlick) | 1 função pura | ✅ Granular |
| T6 render.js | 1 módulo (canvas) | ✅ Granular |
| T7 physics (colisões) | extensão coesa do mesmo arquivo | ✅ Granular |
| T8 physics (gol) | extensão coesa do mesmo arquivo | ✅ Granular |
| T9 turns.js | 1 módulo (regras) | ✅ Granular |
| T10 game.js + attach | integração coesa | ✅ Coeso |
| T11 bundle | 1 script + verificação | ✅ Granular |

### Check 2 — Diagram ↔ Definition Cross-Check

| Task | Depends on (corpo) | Diagrama mostra | Status |
|---|---|---|---|
| T1 | None | (raiz) | ✅ |
| T2 | T1 | T1→T2 | ✅ |
| T3 | T2 | T2→T3 | ✅ |
| T4 | T2 | T3→T4 [P]* | ✅* |
| T5 | T2 | T3→T5 [P]* | ✅* |
| T6 | T3 | T3→T6 [P] | ✅ |
| T7 | T4, T3 | T4→T7 | ✅ |
| T8 | T7, T3 | T7→T8 | ✅ |
| T9 | T8, T3, T2 | T8→T9 | ✅ |
| T10 | T5, T6, T8, T9 | T9→T10 | ✅ |
| T11 | T10 | T10→T11 | ✅ |

\* T4/T5 dependem formalmente de T2; o diagrama as ancora após T3 só para marcar o início da Phase 2 (T3 é o último da fase sequencial). Como T3 depende de T2, a ordem topológica é respeitada — nenhuma das três paralelas depende uma da outra.

### Check 3 — Test Co-location Validation

| Task | Camada criada/modificada | Matrix exige | Task diz | Status |
|---|---|---|---|---|
| T1 | Bundle/tooling | none | none | ✅ |
| T2 | Modelo de estado | unit | unit | ✅ |
| T3 | Geometria arena | unit | unit | ✅ |
| T4 | Física integração | unit | unit | ✅ |
| T5 | Mapeamento input | unit | unit | ✅ |
| T6 | Render (canvas) | manual(none) | none | ✅ |
| T7 | Física colisões | unit | unit | ✅ |
| T8 | Detecção de gol | unit | unit | ✅ |
| T9 | Regras de turno | unit | unit | ✅ |
| T10 | Loop/wiring | manual(none) | none | ✅ |
| T11 | Bundle | manual(none) | none | ✅ |

Todas as checagens passam — nenhuma reestruturação necessária.

---

## Requirement Traceability (tasks)

| Req | Tasks | Status |
|---|---|---|
| CORE-01 | T3, T6 | Verified |
| CORE-02 | T4, T7 | Verified |
| CORE-03 | T5, T10 | Verified |
| CORE-04 | T2, T9 | Verified |
| CORE-05 | T8, T9 | Verified |
| CORE-06 | T9, T10 | Verified |

**Coverage:** 6/6 requisitos mapeados a tasks. 6 verificados (unit + verificação manual no navegador).
