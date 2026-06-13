# Game Polish Specification

> Feature dos Milestones 2 (P1) e 3 (P2). Polimento que torna a brincadeira clara e gostosa, mas que não bloqueia o MVP jogável. Fonte: PRD §6 FR-012 a FR-016. Construir só depois do M1 (`core-gameplay` + `match-flow-ui`).

## Problem Statement

O MVP jogável funciona sem isto, mas a experiência fica seca: a criança pode não entender o gesto de peteleco, o gol passa sem comemoração, não há som nem como pausar. Esta feature adiciona as camadas de feedback e conforto — tutorial relâmpago, sons, comemoração de gol, pausa e vibração — calibradas para idades mistas.

## Goals

- [ ] O filho mais novo entende o gesto de peteleco na 1ª jogada sem ajuda.
- [ ] Gol tem feedback claro e comemorativo (≤ 2s, sem travar o fluxo).
- [ ] Som de peteleco/gol/apito, com mudo acessível.
- [ ] Dá para pausar e reiniciar sem sair do jogo.

## Out of Scope

| Feature | Reason |
|---|---|
| Núcleo jogável (física, turnos, gol, vitória) | `core-gameplay` (M1) — esta feature só reage a eventos dele |
| Telas, seleção, config, HUD, acessibilidade base | `match-flow-ui` (M1) |
| Música de fundo, narração, trilha | Não pedido no PRD; manter leve |

---

## User Stories

### P1: Tutorial relâmpago

**User Story**: Como filho mais novo, quero entender como petelecar na primeira jogada, para começar a jogar sozinho.

**Why P1 (não MVP)**: O jogo é jogável sem ele (o gesto é descobrível), mas o tutorial é o que garante "joga sozinho após 1 explicação" para o mais novo.

**Acceptance Criteria**:
1. WHEN a primeira jogada da partida começa THEN o sistema SHALL mostrar uma animação/dica curta do gesto de arrastar e soltar na bola.
2. WHEN a primeira jogada termina THEN a dica SHALL sumir.
3. WHEN o jogador toca no botão "?" THEN o sistema SHALL reexibir a dica a qualquer momento.

**Independent Test**: Iniciar partida nova e ver a dica de arrastar-soltar na 1ª jogada; confirmar que some depois e que o botão "?" a traz de volta. Cobre FR-012.

---

### P1: Efeitos sonoros

**User Story**: Como jogador, quero ouvir o peteleco, o gol e o apito, para o jogo ficar vivo.

**Why P1 (não MVP)**: Som é fast-follow (D-09); o jogo funciona mudo.

**Acceptance Criteria**:
1. WHEN um peteleco válido ocorre THEN o sistema SHALL tocar um som curto.
2. WHEN um gol é marcado THEN o sistema SHALL tocar um som de gol.
3. WHEN a partida termina THEN o sistema SHALL tocar o apito final.
4. WHEN o jogador aciona o botão de mudo THEN o sistema SHALL silenciar/retomar o áudio; o estado de áudio SHALL respeitar o silêncio do sistema quando possível.

**Independent Test**: Petelecar, fazer gol e terminar a partida ouvindo os três sons; ativar mudo e confirmar silêncio. Cobre FR-013.

---

### P1: Comemoração visual de gol

**User Story**: Como jogador, quero uma comemoração rápida ao marcar, para sentir que pontuei.

**Why P1 (não MVP)**: O sinal de gol já existe no `core-gameplay` (CORE-05); aqui é o enfeite.

**Acceptance Criteria**:
1. WHEN um gol é detectado THEN o sistema SHALL exibir uma animação de gol (ex.: "GOL!") com a cor/bandeira de quem marcou.
2. WHEN a comemoração roda THEN ela SHALL durar ≤ 2s e não travar o fluxo da partida.

**Independent Test**: Marcar um gol e ver "GOL!" com a cor do time por ≤2s, sem travar a reposição da bola. Cobre FR-014 (depende de CORE-05).

---

### P1: Pausar e reiniciar

**User Story**: Como jogador, quero pausar e reiniciar a partida, para resolver imprevistos sem perder o jogo.

**Why P1 (não MVP)**: Conforto; a partida roda sem pausa.

**Acceptance Criteria**:
1. WHEN o jogador toca no botão de pausa THEN o sistema SHALL abrir opções: continuar, reiniciar partida, sair para o menu.
2. WHEN o jogador escolhe reiniciar THEN o sistema SHALL zerar o placar mantendo times e config.

**Independent Test**: Pausar no meio da partida, ver as 3 opções; reiniciar e confirmar placar zerado com times/config mantidos. Cobre FR-015.

---

### P3: Vibração (haptics) no gol em touch

**User Story**: Como jogador em celular, quero uma leve vibração ao marcar, para um feedback tátil.

**Why P3**: Nice-to-have, dependente de API e de hardware.

**Acceptance Criteria**:
1. WHEN um gol é marcado em dispositivo touch com a Vibration API disponível THEN o sistema SHALL emitir uma vibração curta.
2. WHEN a Vibration API não está disponível THEN o sistema SHALL ignorar silenciosamente, sem erro.

**Independent Test**: Marcar gol em celular compatível e sentir a vibração; em ambiente sem a API, confirmar que nada quebra. Cobre FR-016.

---

## Edge Cases

- WHEN o áudio está em mudo THEN nenhuma das ações sonoras SHALL produzir som.
- WHEN a comemoração de gol roda THEN ela SHALL não bloquear a reposição da bola nem a troca de saída.
- WHEN a Vibration API não existe THEN o sistema SHALL degradar silenciosamente.
- WHEN o jogo está pausado THEN a física e a entrada de peteleco SHALL ficar suspensas até "continuar".

---

## Requirement Traceability

| Requirement ID | Origem PRD | Story | Prioridade | Phase | Status |
|---|---|---|---|---|---|
| POL-01 | FR-012 | Tutorial relâmpago | P1 | - | Pending |
| POL-02 | FR-013 | Efeitos sonoros | P1 | - | Pending |
| POL-03 | FR-014 | Comemoração de gol | P1 | - | Pending |
| POL-04 | FR-015 | Pausar e reiniciar | P1 | - | Pending |
| POL-05 | FR-016 | Vibração no gol (touch) | P3 | - | Pending |

**ID format:** `POL-NN`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 5 total, 0 mapeados a tasks, 0 verificados.

**Dependências:** POL-01 depende de CORE-03 (peteleco); POL-02 depende de CORE-03 e CORE-05; POL-03 e POL-05 dependem de CORE-05; POL-04 depende de CORE-06.

---

## Success Criteria

- [ ] Filho mais novo executa o 1º peteleco após ver a dica, sem ajuda.
- [ ] Gol tem som + comemoração ≤ 2s sem travar.
- [ ] Mudo silencia tudo; áudio respeita silêncio do sistema quando possível.
- [ ] Pausa oferece continuar/reiniciar/menu; reiniciar zera placar mantendo times/config.
- [ ] Haptics funciona onde há API e degrada em silêncio onde não há.
