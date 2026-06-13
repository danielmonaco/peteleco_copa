# STATE — Peteleco da Copa

Memória persistente entre sessões: decisões, blockers, lições, todos, ideias adiadas.

## Decisions

Regras travadas no PRD §5 e questões em aberto §14 resolvidas com os defaults:

- **D-01** — Só a bola é petelecada; os 5 jogadores de cada time ficam estáticos como obstáculos. (PRD §5)
- **D-02** — Arena oval fechada (modelada como retângulo arredondado com aberturas de gol, por estabilidade — PRD §13); a bola ricocheteia nas paredes; sem bola fora, sem lateral, sem escanteio.
- **D-03** — Após gol: bola volta ao centro e o time que **sofreu** recomeça com a posse (saída). Sem gol: a bola fica onde parou, oponente segue dali.
- **D-04** — Gol contra conta para o adversário. `[ajustável]` (Q14.1 = sim)
- **D-05** — Sem goleiro especial; defesa pelos jogadores estáticos + boca estreita do gol. `[ajustável]` (Q14.2)
- **D-06** — Uma formação fixa dos 5 jogadores, espelhada, estilo da foto do tabuleiro. `[ajustável]` (Q14.3)
- **D-07** — Padrão de toques por vez = 3; gols para vencer = 5. (Q14.4)
- **D-08** — Sem relógio; vitória só por número de gols; não existe empate. `[ajustável]`
- **D-09** — Som fica no P1 (fast-follow), não bloqueia o MVP jogável. (Q14.5)
- **D-10** — Stack: Canvas 2D nativo + Pointer Events, sem framework nem engine de física; entrega como arquivo único `index.html`. (PRD §8)
- **D-11** — Física com timestep fixo (acumulador ~1/120s), render interpolado; atrito alto por damping forte por passo + zerar velocidade abaixo de limiar. (PRD §13)
- **D-12** — Detecção de gol dentro do passo de física (cruzamento da linha entre as traves), não só ao fim do movimento, para não perder gol de bola rápida. (PRD §13)
- **D-13** — Lista das 48 seleções fica em arquivo de config editável (`teams.js`); não inventar a lista no código de jogo. (PRD §10)
- **D-14** — Toolchain de teste: **Vitest** (`npx vitest run`); unit nas regras (turnos, gol), física/feel ficam em verificação manual/empírica (PRD §12). (escolha do usuário 2026-06-13)
- **D-15** — Linguagem: **JavaScript ESM** (sem TS, sem build step de tipos). (escolha do usuário 2026-06-13)
- **D-16** — Desenvolver em módulos `/src`; um script de bundle concatena/embute tudo em `index.html` (arquivo único) ao final. (escolha do usuário 2026-06-13)
- **D-17** — Níveis de dificuldade (Fácil/Médio/Difícil) como presets de `{goalWidth, pegRadius, keeperRadius}` em `src/difficulty.js`; padrão **Médio**. Render e física leem de `state.arena`/`peg.radius`, então adaptam sozinhos. Selecionável antes da partida (seletor tátil na fase `config`) e via "Mudar dificuldade" no fim de jogo. É uma dimensão da Configuração (FR-003/FLOW-03) — o modelo já vive no core; a tela de config de `match-flow-ui` deve incorporá-lo. (pedido do usuário 2026-06-13)

## Blockers

- **B-01** — Lista oficial das 48 seleções da Copa 2026 ainda não confirmada (depende da classificação; só EUA/México/Canadá garantidos como sede). Mitigação: placeholder editável em `teams.js` com as seleções conhecidas + slots a confirmar; não trava o build do núcleo.

## Lessons

- **L-01** — Calibragem inicial (em `src/constants.js`): `DAMP=0.965`, `V_STOP=5`, `STOP_FRAMES=6`, `MAX_SPEED=1800`, `MAX_DRAG=220px`, `MIN_DRAG=15px`. Com isso, peteleco médio (700 u/s) para em ~1,2s (≤1,5s ✓). Atrito alto faz tiro do meio-campo **não** alcançar o gol adversário num toque só — o esperado (jogo de toques encadeados).
- **L-02** — O peg central de cada time (nº1, "goleiro") em (cx, 80)/(cx, h-80) bloqueia o chute reto pelo meio do gol. Bom para defesa, mas mira de gol exige ângulo. Ajustar posição/raio se ficar difícil demais para o filho mais novo (formação é `[ajustável]` D-06).
- **L-05** — Calibragem de dificuldade (feedback "gol fácil demais", 2026-06-13): evoluiu para os 3 presets de D-17. Medição de taxa de gol em chutes de fora da área (centrado, força total): **Fácil 62% · Médio 31% · Difícil 0%** (desse ponto; das pontas mirando o canto continua marcável). `src/constants.js` (`PEG_RADIUS=25`, `GOAL_WIDTH=150`) virou só **fallback** — o jogo ativo sempre passa os `diffParams` do preset. Ajustar os presets em `src/difficulty.js` após playtest humano se necessário.
- **L-03** — Colisão da arena usa retângulo (não elipse/arcos); cantos são só visuais no render. Estável e suficiente; revisitar se a bola parecer "quadrada" nos cantos.
- **L-04** — `computeFlick` mede o arrasto em **px de tela** (não world units) para feel consistente entre escalas; a velocidade resultante é aplicada em world u/s.

## Todos

- [ ] Confirmar/inserir as 48 seleções com code, name, flag, colorPrimary, colorSecondary.
- [ ] Calibrar empiricamente: damping de atrito, teto de força do slingshot, limiar de "bola parada".
- [ ] Testar em 320px de largura desde cedo (armadilha comum do PRD §13).

## Deferred ideas

- Som no MVP (adiado para P1 — D-09).
- Busca/filtro por nome na seleção de times (P1; com 48 itens a grade rolável basta no P0 — FR-002).
- Testar 2 formações de jogadores (adiado; 1 fixa no MVP — D-06).

## Preferences

_(vazio)_
