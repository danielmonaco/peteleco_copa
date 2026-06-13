# Core Gameplay Specification

> Feature do Milestone 1. Cobre o núcleo jogável: render do campo, física da bola, mecânica de peteleco, turnos, gol e vitória. Fonte: PRD §6 FR-004 a FR-009, §11 e §13.

## Problem Statement

O coração do jogo é a mecânica de peteleco: petelecar a bola de alto atrito num campo visto de cima, com jogadores estáticos como obstáculos, em turnos com toques limitados, até alguém fazer os gols necessários. Sem essa malha (render + física + slingshot + turnos + gol + vitória) não há jogo. É o slice irredutível e a parte mais sensível de calibragem.

## Goals

- [ ] Bola se comporta como a pastilha do peteleco físico: para em ≤ 1,5s após peteleco médio (alto atrito).
- [ ] Mecânica estilingue precisa: a bola vai exatamente para onde a linha-guia aponta.
- [ ] Turnos corretos: N toques por vez, troca ao acabar, reset pós-gol com a saída de quem sofreu.
- [ ] Gol nunca é perdido por bola rápida; bola nunca atravessa parede/jogador nem sai da arena.
- [ ] ≥ 50 fps com bola em movimento e colisões em celular Android intermediário.

## Out of Scope

| Feature | Reason |
|---|---|
| Telas de menu, seleção e config | Pertencem a `match-flow-ui` (este spec recebe times + config já definidos) |
| HUD (placar/vez/toques visíveis) | `match-flow-ui` FR-010 — aqui só o estado de turno é mantido |
| Som, comemoração animada, tutorial, pausa, haptics | Polimento — `game-polish` (M2) |
| Goleiro, faltas, lateral, escanteio, relógio | Fora do MVP (D-05, D-08) |
| Movimento dos jogadores | Jogadores são estáticos por regra (D-01) |

---

## User Stories

### P1: Render do campo e arena ⭐ MVP

**User Story**: Como jogador, quero ver o campo de cima claro, com os dois gols e os 5 jogadores de cada time, para mirar minhas jogadas.

**Why P1**: Sem o campo desenhado não há onde jogar; é a base visual de toda a física e mira.

**Acceptance Criteria**:
1. WHEN a partida inicia THEN o sistema SHALL desenhar o campo em visão de cima (top-down), orientação retrato, com gols em cima e embaixo.
2. WHEN o campo é desenhado THEN o sistema SHALL posicionar 5 jogadores por time em formação fixa espelhada (estilo da foto — D-06).
3. WHEN times A e B estão em campo THEN o sistema SHALL distingui-los por cor **e** número da camisa juntos (seguro para daltonismo).
4. WHEN a bola está em campo THEN o sistema SHALL renderizá-la visível e contrastante com o campo e com os jogadores.
5. WHEN a viewport muda de tamanho ou orientação THEN o sistema SHALL reescalar o campo mantendo a proporção, sem cortar os gols e sem perder o estado da partida.

**Independent Test**: Abrir a partida com 2 times escolhidos e ver campo retrato, 10 jogadores distinguíveis (cor+número), 2 gols e 1 bola; redimensionar a janela e confirmar reescala sem corte. Cobre FR-004.

---

### P1: Física da bola de alto atrito ⭐ MVP

**User Story**: Como jogador, quero que a bola desacelere rápido e ricocheteie como a pastilha de madeira, para a jogada ser de precisão.

**Why P1**: A "sensação" do peteleco é a física; é o diferencial do produto frente a outros "futebol de dedo".

**Acceptance Criteria**:
1. WHEN a bola recebe um peteleco de força média THEN o sistema SHALL fazê-la parar em ≤ 1,5s (damping forte por passo de física).
2. WHEN a bola atinge uma parede da arena THEN o sistema SHALL ricocheteá-la com restituição perceptível, sem atravessar.
3. WHEN a bola atinge um jogador estático THEN o sistema SHALL desviá-la na colisão círculo-círculo, sem que o jogador se mova.
4. WHEN a velocidade da bola cai abaixo de um limiar pequeno por X frames THEN o sistema SHALL considerá-la parada e zerar a velocidade.
5. WHEN a bola se move em alta velocidade THEN o sistema SHALL impedir tunneling (atravessar parede/jogador) via passos de física pequenos / checagem contínua, e a bola SHALL nunca sair da arena nem ficar presa fora do campo.
6. WHEN o jogo roda em diferentes fps THEN a física SHALL usar timestep fixo (acumulador ~1/120s) para se comportar igual em qualquer aparelho.

**Independent Test**: Disparar a bola e cronometrar parada (≤1,5s); disparar contra parede e contra jogador em ângulo e velocidade altos, confirmando ricochete sem atravessar e sem sair da arena. Cobre FR-005.

---

### P1: Mecânica de peteleco (slingshot: mira + força) ⭐ MVP

**User Story**: Como jogador, quero arrastar a partir da bola para mirar e dosar a força e soltar para petelecar, com o dedo ou o mouse.

**Why P1**: É o único controle do jogo; precisa ser intuitivo para crianças.

**Acceptance Criteria**:
1. WHEN o jogador pressiona/segura na bola e arrasta THEN o sistema SHALL mostrar uma linha de mira e um indicador de força.
2. WHEN o jogador arrasta THEN a direção do disparo SHALL ser oposta ao arrasto (puxa pra trás como estilingue) e a linha-guia SHALL apontar para onde a bola vai (sentido real do disparo).
3. WHEN o arrasto aumenta THEN a força SHALL ser proporcional ao comprimento do arrasto, limitada por um teto máximo.
4. WHEN o jogador solta THEN o sistema SHALL disparar a bola com resultado coerente com a mira mostrada.
5. WHEN o arrasto é menor que ~15px THEN o sistema SHALL ignorá-lo: não dispara e não consome toque (evita disparo acidental).
6. WHEN a entrada vem de mouse ou de toque THEN o sistema SHALL tratá-la igual via Pointer Events (nunca depender só de eventos de mouse).
7. WHEN a bola está em movimento (`phase === ballMoving`) THEN o sistema SHALL bloquear a entrada de peteleco até a bola parar.

**Independent Test**: Arrastar a partir da bola, ver linha-guia no sentido do disparo e indicador de força; soltar e confirmar trajetória coerente; testar arrasto <15px (nada acontece) e tentar petelecar com bola em movimento (bloqueado). Repetir com mouse e com toque. Cobre FR-006.

---

### P1: Sistema de turnos (hot-seat com toques) ⭐ MVP

**User Story**: Como jogador, quero saber de quem é a vez e quantos toques restam, para jogar na ordem certa.

**Why P1**: Define a alternância entre os dois jogadores; sem isso o jogo não tem regra de vez.

**Acceptance Criteria**:
1. WHEN a partida inicia THEN o sistema SHALL colocar a bola no centro e dar a saída a um time (aleatório ou Time A).
2. WHEN uma vez começa THEN o sistema SHALL conceder N toques disponíveis (N = config 1/2/3).
3. WHEN um peteleco válido ocorre THEN o sistema SHALL consumir 1 toque e só permitir o próximo depois que a bola parar.
4. WHEN os N toques acabam sem gol THEN o sistema SHALL passar a vez ao oponente e deixar a bola onde parou.
5. WHEN o estado de turno muda THEN o sistema SHALL manter de quem é a vez (cor+bandeira+nome) e os toques restantes disponíveis para o HUD consumir.

**Independent Test**: Configurar N=2, petelecar duas vezes sem gol e confirmar troca de vez com a bola parada no lugar; confirmar que o 2º toque só libera após a bola parar. Cobre FR-007.

---

### P1: Detecção de gol, placar e reposição ⭐ MVP

**User Story**: Como jogador, quero que o gol seja contado e a bola recolocada, para saber que pontuei e continuar.

**Why P1**: Sem gol contado não há objetivo nem progresso.

**Acceptance Criteria**:
1. WHEN o centro da bola cruza a linha do gol entre as traves THEN o sistema SHALL detectar gol no passo de física (não só ao fim do movimento — D-12).
2. WHEN um gol é detectado THEN o sistema SHALL incrementar em 1 o placar do time correto.
3. WHEN a bola entra no próprio gol THEN o sistema SHALL contar o gol para o adversário (gol contra — D-04 `[ajustável]`).
4. WHEN um gol é registrado THEN o sistema SHALL recolocar a bola no centro e dar a saída ao time que sofreu.
5. WHEN a bola para exatamente na boca do gol mas sem cruzar a linha THEN o sistema SHALL não contar gol e seguir a jogada.
6. WHEN um gol acontece THEN o sistema SHALL emitir um sinal de gol para feedback visual (comemoração detalhada é `game-polish`).

**Independent Test**: Fazer a bola cruzar a linha entre as traves em alta velocidade e confirmar +1 no placar correto e reposição no centro; fazer gol contra e confirmar ponto ao adversário; parar a bola na boca do gol sem cruzar e confirmar que não conta. Cobre FR-008.

---

### P1: Condição de vitória e tela de fim ⭐ MVP

**User Story**: Como jogador, quero ver quem ganhou e poder jogar de novo, para a brincadeira continuar.

**Why P1**: Fecha o loop da partida; sem fim a partida nunca termina.

**Acceptance Criteria**:
1. WHEN um time atinge o número de gols configurado (3 ou 5) THEN o sistema SHALL encerrar a partida (fase `gameover`).
2. WHEN a partida termina THEN o sistema SHALL mostrar o time vencedor (bandeira + nome) e o placar final.
3. WHEN o jogador escolhe "Jogar de novo" THEN o sistema SHALL reiniciar zerando o placar e mantendo times e config.
4. WHEN o jogador escolhe "Trocar times" THEN o sistema SHALL voltar para a seleção de times (`match-flow-ui`).

**Independent Test**: Jogar até um time atingir os gols configurados, ver tela de fim com vencedor+placar, usar "Jogar de novo" (placar zera, times mantidos) e "Trocar times" (volta à seleção). Cobre FR-009.

---

## Edge Cases

- WHEN o arrasto é curtíssimo (toque acidental < 15px) THEN o sistema SHALL ignorar: sem disparo, sem consumir toque.
- WHEN o jogador tenta petelecar com a bola em movimento THEN o sistema SHALL bloquear a entrada até a bola parar.
- WHEN a bola para encostada num jogador ou parede THEN o sistema SHALL permitir a jogada seguir normalmente do ponto atual.
- WHEN a bola fica oscilando com micro-velocidade THEN o sistema SHALL considerá-la parada ao cair abaixo do limiar por X frames.
- WHEN o placar não tem teto de tempo THEN o sistema SHALL não permitir empate — o jogo só acaba quando alguém atinge os gols.
- WHEN o aparelho gira (retrato/paisagem) THEN o sistema SHALL reescalar o campo sem perder o estado da partida.

---

## Requirement Traceability

| Requirement ID | Origem PRD | Story | Phase | Status |
|---|---|---|---|---|
| CORE-01 | FR-004 | Render do campo e arena | Done | Verified |
| CORE-02 | FR-005 | Física de alto atrito | Done | Verified |
| CORE-03 | FR-006 | Mecânica de peteleco (slingshot) | Done | Verified |
| CORE-04 | FR-007 | Sistema de turnos | Done | Verified |
| CORE-05 | FR-008 | Gol, placar e reposição | Done | Verified |
| CORE-06 | FR-009 | Vitória e tela de fim | Done | Verified |

**ID format:** `CORE-NN`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 6 total, 6 mapeados a tasks, 6 verificados.

---

## Success Criteria

- [ ] Bola para em ≤ 1,5s após peteleco médio (medido).
- [ ] Bola nunca atravessa parede/jogador nem sai da arena em testes de alta velocidade.
- [ ] Gol entre as traves sempre conta, inclusive com bola rápida; gol contra vai ao adversário.
- [ ] Turnos consomem toques corretamente e trocam de vez; reset pós-gol com saída de quem sofreu.
- [ ] Partida fecha ao atingir os gols configurados, com tela de fim e rejogar.
- [ ] ≥ 50 fps com bola em movimento e colisões em celular Android intermediário.
