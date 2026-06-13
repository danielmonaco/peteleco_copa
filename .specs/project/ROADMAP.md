# Roadmap — Peteleco da Copa

Derivado do PRD v1.0 (2026-06-13). A ordem segue a "Ordem de construção" da seção 13 do PRD: o núcleo jogável primeiro, polimento depois.

## Milestone 1 — MVP Jogável (P0) 🎯

Objetivo: uma partida completa funciona do menu ao fim, com física fiel e turnos corretos. É o slice irredutível do jogo.

| Feature | Cobre (FR) | Status |
|---|---|---|
| **core-gameplay** — render do campo, física de alto atrito, peteleco (slingshot), turnos, gol, vitória | FR-004, FR-005, FR-006, FR-007, FR-008, FR-009 | ✅ Done (2026-06-13) |
| **match-flow-ui** — tela inicial, seleção das 48 seleções, configuração, HUD, acessibilidade | FR-001, FR-002, FR-003, FR-010, FR-011 | ✅ Done (2026-06-13) |

Dependência: `match-flow-ui` fornece menu/seleção/config que entram na partida de `core-gameplay`; a malha de estado (máquina de fases) é compartilhada. Construir o esqueleto de estado + render + física antes das telas, conforme PRD §13.

## Milestone 2 — Polimento (P1)

Objetivo: deixar a brincadeira gostosa e clara para crianças.

| Feature | Cobre (FR) | Status |
|---|---|---|
| **game-polish** — tutorial relâmpago, efeitos sonoros, comemoração de gol, pausar/reiniciar | FR-012, FR-013, FR-014, FR-015 | Pending |

## Milestone 3 — Extras (P2)

| Feature | Cobre (FR) | Status |
|---|---|---|
| **game-polish** (haptics) — vibração no gol em touch | FR-016 | Pending |

## Backlog / Pós-MVP (fora do escopo v1)

- Modo CPU/IA.
- Modo Copa / torneio com chaveamento.
- Online/multiplayer remoto.
- Contas, ranking, persistência.
- Goleiro controlável, faltas, escanteio, lateral, relógio.

## Distribuição de prioridade (PRD §6)

P0 = 11 FRs · P1 = 4 FRs · P2 = 1 FR. O núcleo jogável é irredutível (todo o P0 do M1); todo polimento foi rebaixado a P1/P2.
