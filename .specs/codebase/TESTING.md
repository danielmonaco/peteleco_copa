# Testing — Peteleco da Copa

Greenfield. Toolchain: **Vitest** (D-14), JavaScript ESM (D-15). Estratégia segue PRD §12: unit nas regras do jogo (turnos, gol, mapeamento arrasto→força); física e "feel" por verificação manual/empírica; jornada E2E manual no MVP (sem Playwright por ora).

## Test types

- **unit** — funções puras testáveis em Node sem DOM (regras, geometria, mapeamento de força, integração numérica da bola via simulação).
- **manual** — verificação no navegador (física/feel, render no canvas, jornada E2E, performance). Sem framework automatizado no MVP.

## Test Coverage Matrix

| Code layer | Exemplos | Required test type | Parallel-Safe |
|---|---|---|---|
| Modelo de estado | `state.js` (factory `MatchState`, defaults) | unit | Yes |
| Geometria da arena | `arena.js` (`goalLine`, `buildPegs`) | unit | Yes |
| Física — integração/atrito | `physics.js` (`step`, damping, `isBallStopped`) | unit | Yes |
| Física — colisões | `physics.js` (reflexão parede/peg, anti-tunneling) | unit | Yes |
| Detecção de gol | `physics.js` (cruzamento de linha entre traves) | unit | Yes |
| Mapeamento de peteleco | `input.js` (`computeFlick`: dir/força/teto/min-drag) | unit | Yes |
| Regras de turno | `turns.js` (toques, troca, gol, saída, vitória) | unit | Yes |
| Render (canvas) | `render.js` (transform, draw) | manual (none) | — |
| Wiring de Pointer Events | `input.js` (attach pointerdown/move/up) | manual (none) | — |
| Loop / máquina de fases | `game.js` (`startMatch`, loop, transições) | manual (none) | — |
| Bundle / arquivo único | `build` → `index.html` | manual (none) | — |

> Funções puras isoladas por arquivo: testes unit são paralelo-seguros (Vitest isola por arquivo, sem estado mutável compartilhado).

## Gate Check Commands

| Gate | Comando | Quando |
|---|---|---|
| **quick** | `npx vitest run` | Tasks com camada unit; deve passar antes de concluir a task |
| **full** | `npx vitest run` + checklist manual da task (seção Verify) | Tasks que integram comportamento observável |
| **build** | `npm run build` (script de bundle gera `index.html`) + abrir no navegador | Tasks de scaffold/entrega |

## Parallelism Assessment

- Todas as camadas unit acima: **Parallel-Safe: Yes** (arquivos isolados, funções puras).
- Camadas `manual (none)`: sem teste automatizado; a verificação é manual e sequencial na integração.
