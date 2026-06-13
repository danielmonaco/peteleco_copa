# Peteleco da Copa — Documento de Requisitos de Produto (PRD)

**Versão:** 1.0
**Data:** 2026-06-13
**Autor:** PM/PO do projeto
**Status:** Draft (MVP)

---

## 1. Resumo executivo

Peteleco da Copa é um jogo web (navegador) de futebol de peteleco em visão de cima, jogado por 2 pessoas no mesmo aparelho (hot-seat), pensado para os filhos do dono do produto brincarem em dias de chuva. Recria a mecânica do jogo de tabuleiro físico "Mundo de Peteleco": jogadores ficam estáticos no campo e a pessoa "petelecа" apenas a bola, que tem alto atrito e desacelera rápido, tentando fazer gol no time adversário. O MVP entrega uma única partida amistosa, com escolha de seleção entre as 48 da Copa 2026, configuração de toques por vez (1, 2 ou 3) e placar até 3 ou 5 gols. O resultado esperado é um jogo simples, divertido, acessível para idades mistas e que roda instantaneamente no navegador, sem instalação.

---

## 2. Problema

**Estado atual:** O jogo físico de peteleco depende do tabuleiro de madeira, das peças e de estar todo mundo no mesmo lugar com o material à mão. Em dia de chuva, com criança em casa, nem sempre o tabuleiro está acessível ou em bom estado.

**Dores:**
1. Falta uma versão digital simples do peteleco que rode na hora, sem baixar nada.
2. Jogos digitais de futebol costumam ser complexos demais para crianças menores e exigem leitura.
3. Versões digitais existentes de "futebol de dedo" raramente respeitam a mecânica real do peteleco (bola de alto atrito, jogadores estáticos, toques limitados por jogada).
4. Idades mistas em casa precisam de um jogo que o mais novo e o mais velho consigam jogar juntos de forma equilibrada.

**Impacto:** sem isso, o entretenimento em dia de chuva fica dependente de telas passivas (vídeo) em vez de um jogo ativo, competitivo e que os irmãos jogam juntos.

---

## 3. Objetivos e métricas de sucesso

Como é um produto pessoal/MVP, as métricas são de validação de diversão e usabilidade, não de receita.

| Objetivo | Métrica | Meta | Como medir |
|---|---|---|---|
| Jogo fácil de começar | Tempo do menu até o 1º peteleco | < 30 segundos | Observação/teste com os filhos |
| Mecânica gostosa | Partidas jogadas em sequência numa sessão | >= 2 | Observação |
| Acessível a idades mistas | Filho mais novo consegue jogar sozinho sem ajuda após 1 explicação | Sim | Teste de uso |
| Roda bem | Frames por segundo em celular Android intermediário | >= 50 fps | DevTools / contador de fps interno |
| Equilíbrio | Partidas que não terminam em goleada vexatória com ajuste de toques | Maioria | Observação |

---

## 4. Personas

#### Filho mais novo (criança)
- **Papel:** jogador casual, pode não ler bem ainda.
- **Objetivos:** se divertir, fazer gol, ganhar do irmão.
- **Dores:** texto demais, regras complexas, controles difíceis.
- **Proficiência técnica:** baixa.
- **Contexto de uso:** tablet ou celular touch, sentado, dia de chuva.

#### Filho mais velho (pré-adolescente)
- **Papel:** jogador competitivo.
- **Objetivos:** ganhar, dominar a mira e a força, jogar várias partidas.
- **Dores:** jogo "bebezão" demais, sem desafio, sem placar real.
- **Proficiência técnica:** média/alta.
- **Contexto de uso:** celular touch ou notebook com mouse.

#### Pai (dono do produto)
- **Papel:** organizador e juiz informal, eventualmente joga junto.
- **Objetivos:** que os filhos brinquem juntos sem briga e sem precisar dele o tempo todo.
- **Proficiência técnica:** alta.
- **Contexto de uso:** abre o jogo no navegador e entrega o aparelho.

---

## 5. Escopo do MVP (decisões travadas)

**Dentro do MVP:**
- Partida única amistosa (sem torneio, sem chaveamento, sem Copa completa).
- 2 jogadores no mesmo aparelho (hot-seat), alternando a vez.
- Escolha de seleção entre as 48 da Copa 2026 para cada lado.
- 5 jogadores estáticos por time (como na foto do tabuleiro físico).
- Configuração de 1, 2 ou 3 toques por vez (padrão: 3).
- Placar até 3 ou 5 gols (padrão: 5).
- Entrada por mouse (notebook) e por toque (tela touch), mesma mecânica.

**Fora do MVP (futuro):**
- Modo contra o computador (CPU/IA).
- Modo Copa / torneio com chaveamento.
- Online/multiplayer remoto.
- Contas, login, ranking, persistência de histórico.
- Goleiro controlável, faltas, escanteio, lateral.

**Decisões de regra travadas como padrão (ajustáveis, sinalizadas para redline):**
- Só a bola é petelecada; os 5 jogadores de cada time ficam estáticos como obstáculos.
- Arena oval fechada: a bola ricocheteia nas paredes; não há bola fora (sem lateral nem escanteio).
- Após gol: a bola volta ao centro e o time que **sofreu** o gol recomeça com a posse (saída).
- Sem gol: a bola fica onde parou e o oponente continua dali.
- Gol contra conta como gol para o adversário (mantém simples e divertido). `[default, ajustável]`
- Sem goleiro especial no MVP; a defesa é feita pelos jogadores estáticos e pela boca estreita do gol. `[default, ajustável]`
- Sem relógio; vitória só por número de gols. `[default, ajustável]`

---

## 6. Requisitos funcionais

#### FR-001: Tela inicial e fluxo de partida
**Descrição:** menu simples para iniciar uma partida amistosa.
**História:** Como pai, quero abrir o jogo e começar uma partida em poucos toques, para entregar o aparelho pronto para os filhos.
**Critérios de aceite:**
- [ ] A tela inicial mostra um botão grande "Jogar" (alvo >= 48px de altura).
- [ ] "Jogar" leva à seleção de times.
- [ ] Nenhum cadastro, login ou texto de termos bloqueia o início.
- [ ] Tudo cabe em uma tela sem rolagem em celular padrão (360x640).
**Prioridade:** P0
**Dependências:** nenhuma.

#### FR-002: Seleção de seleções (times)
**Descrição:** cada lado escolhe uma das 48 seleções da Copa 2026.
**História:** Como jogador, quero escolher meu país, para torcer pelo meu time.
**Critérios de aceite:**
- [ ] Lista/grade com as 48 seleções, cada uma com bandeira (emoji) e nome.
- [ ] Jogador 1 e Jogador 2 escolhem times diferentes (ou iguais, permitido, mas com cores distintas forçadas).
- [ ] Cada time tem cor primária de camisa derivada das cores nacionais.
- [ ] Busca/filtro por nome é P1 (com 48 itens, grade rolável basta no P0).
- [ ] Seleção confirma em 1 toque por lado.
**Prioridade:** P0
**Dependências:** dados das 48 seleções (ver seção 10).

#### FR-003: Configuração da partida
**Descrição:** antes de começar, define toques por vez e gols para vencer.
**História:** Como pai, quero ajustar a dificuldade, para equilibrar idades diferentes.
**Critérios de aceite:**
- [ ] Opção de toques por vez: 1, 2 ou 3 (padrão 3).
- [ ] Opção de gols para vencer: 3 ou 5 (padrão 5).
- [ ] Controles são botões grandes do tipo seletor, sem digitação.
- [ ] A configuração escolhida vale para a partida inteira.
**Prioridade:** P0
**Dependências:** FR-002.

#### FR-004: Render do campo e arena (visão de cima)
**Descrição:** desenha o campo oval fechado, os dois gols e os 5 jogadores estáticos de cada time.
**História:** Como jogador, quero ver o campo de cima claro, para mirar minhas jogadas.
**Critérios de aceite:**
- [ ] Campo em visão de cima (top-down), orientação retrato (gols em cima e embaixo).
- [ ] 5 jogadores por time, posicionados de forma espelhada (formação fixa estilo da foto).
- [ ] Jogadores do time A e do time B claramente distinguíveis por cor + número.
- [ ] Bola visível e contrastante com o campo.
- [ ] Render escala para caber na viewport mantendo proporção, sem cortar gols.
**Prioridade:** P0
**Dependências:** FR-002.

#### FR-005: Física da bola de alto atrito
**Descrição:** a bola se move com forte desaceleração e colide com jogadores e paredes.
**História:** Como jogador, quero que a bola se comporte como a pastilha do peteleco físico, para a jogada ser de precisão.
**Critérios de aceite:**
- [ ] A bola, após um peteleco de força média, para em <= 1,5s (alto atrito).
- [ ] A bola colide e ricocheteia nas paredes da arena (restituição perceptível, sem atravessar).
- [ ] A bola colide com os jogadores estáticos e desvia (eles não se movem).
- [ ] A bola nunca sai da arena nem fica presa fora do campo.
- [ ] A bola é considerada "parada" quando a velocidade fica abaixo de um limiar pequeno.
**Prioridade:** P0
**Dependências:** FR-004.

#### FR-006: Mecânica de peteleco (mira + força, estilo estilingue)
**Descrição:** o jogador arrasta a partir da bola para definir direção e força, e solta para petelecar.
**História:** Como jogador, quero mirar e dosar a força com o dedo ou o mouse, para controlar a jogada.
**Critérios de aceite:**
- [ ] Pressionar/segurar na bola e arrastar mostra uma linha de mira e um indicador de força.
- [ ] A direção do disparo é oposta ao arrasto (puxa pra trás como estilingue); a linha-guia aponta para onde a bola vai.
- [ ] A força é proporcional ao tamanho do arrasto, com um teto máximo.
- [ ] Soltar dispara a bola; o resultado bate com a mira mostrada.
- [ ] Arrasto muito curto (< 15px) é ignorado e não consome toque (evita disparo acidental).
- [ ] Funciona igual com mouse (notebook) e com toque (tela touch).
- [ ] Durante o movimento da bola, a entrada fica bloqueada até a bola parar.
**Prioridade:** P0
**Dependências:** FR-005.

#### FR-007: Sistema de turnos (hot-seat com toques)
**Descrição:** os jogadores alternam a vez; cada vez tem até N toques (N = config).
**História:** Como jogador, quero saber de quem é a vez e quantos toques restam, para jogar na ordem certa.
**Critérios de aceite:**
- [ ] No início, a bola fica no centro e um time recebe a saída (aleatório ou Time A).
- [ ] Cada vez começa com N toques disponíveis (N = 1, 2 ou 3).
- [ ] Cada peteleco válido consome 1 toque; o próximo toque só é permitido depois que a bola para.
- [ ] Quando os N toques acabam sem gol, a vez passa ao oponente e a bola fica onde parou.
- [ ] O HUD mostra de quem é a vez (cor + bandeira + nome) e toques restantes.
**Prioridade:** P0
**Dependências:** FR-006.

#### FR-008: Detecção de gol, placar e reposição
**Descrição:** detecta gol, atualiza placar e recoloca a bola no centro.
**História:** Como jogador, quero que o gol seja contado e comemorado, para saber que pontuei.
**Critérios de aceite:**
- [ ] Gol é detectado quando o centro da bola cruza a linha do gol entre as traves.
- [ ] O placar do time correto incrementa em 1.
- [ ] Após gol, a bola volta ao centro e o time que sofreu recomeça com a saída.
- [ ] Gol contra (bola no próprio gol) conta para o adversário. `[default, ajustável]`
- [ ] Há feedback claro de gol (visual obrigatório; som é P1).
**Prioridade:** P0
**Dependências:** FR-005, FR-007.

#### FR-009: Condição de vitória e tela de fim
**Descrição:** encerra a partida ao atingir o número de gols e oferece rejogar.
**História:** Como jogador, quero ver quem ganhou e jogar de novo, para a brincadeira continuar.
**Critérios de aceite:**
- [ ] A partida termina quando um time atinge o número de gols configurado (3 ou 5).
- [ ] A tela final mostra o time vencedor (bandeira + nome) e o placar.
- [ ] Botão "Jogar de novo" reinicia mantendo times e config.
- [ ] Botão "Trocar times" volta para a seleção.
**Prioridade:** P0
**Dependências:** FR-008.

#### FR-010: HUD durante a partida
**Descrição:** placar, vez atual e toques restantes sempre visíveis.
**História:** Como jogador, quero acompanhar o jogo sem precisar perguntar, para jogar sozinho.
**Critérios de aceite:**
- [ ] Placar dos dois times sempre visível no topo.
- [ ] Indicador de vez destacado pela cor do time da vez.
- [ ] Toques restantes mostrados de forma icônica (ex.: 3 bolinhas) além de número.
- [ ] HUD não cobre a área jogável da bola.
**Prioridade:** P0
**Dependências:** FR-007.

#### FR-011: Acessibilidade para idades mistas
**Descrição:** o jogo deve ser usável pelo filho mais novo e pelo mais velho.
**História:** Como pai, quero que os dois filhos joguem sem ajuda, para evitar atrito.
**Critérios de aceite:**
- [ ] Alvos de toque >= 48px; fonte de corpo >= 18px.
- [ ] Alto contraste entre bola, campo, jogadores e HUD.
- [ ] Cores dos times nunca dependem só de vermelho/verde; sempre acompanham número e/ou padrão (seguro para daltonismo).
- [ ] Texto mínimo; ações principais reconhecíveis por ícone.
- [ ] Sem pressão de tempo (sem relógio).
**Prioridade:** P0
**Dependências:** FR-001 a FR-010.

#### FR-012: Tutorial relâmpago
**Descrição:** uma dica rápida de "arrasta e solta na bola" na primeira jogada.
**História:** Como filho mais novo, quero entender como petelecar, para começar a jogar.
**Critérios de aceite:**
- [ ] Na primeira vez, uma animação/dica curta mostra o gesto de arrastar e soltar.
- [ ] A dica some após a primeira jogada e pode ser revista por um botão "?".
**Prioridade:** P1
**Dependências:** FR-006.

#### FR-013: Efeitos sonoros
**Descrição:** sons de peteleco, gol e apito de início/fim.
**Critérios de aceite:**
- [ ] Som curto ao petelecar, ao marcar gol e no apito final.
- [ ] Botão de mudo acessível; estado de áudio respeita o silêncio do sistema quando possível.
**Prioridade:** P1
**Dependências:** FR-006, FR-008.

#### FR-014: Comemoração visual de gol
**Descrição:** animação rápida de gol (ex.: "GOL!" com cor do time).
**Critérios de aceite:**
- [ ] Animação dura <= 2s e não trava o fluxo.
- [ ] Mostra a cor/bandeira de quem marcou.
**Prioridade:** P1
**Dependências:** FR-008.

#### FR-015: Pausar e reiniciar
**Descrição:** pausa a partida e permite reiniciar.
**Critérios de aceite:**
- [ ] Botão de pausa abre opções: continuar, reiniciar partida, sair para o menu.
- [ ] Reiniciar zera placar mantendo times e config.
**Prioridade:** P1
**Dependências:** FR-009.

#### FR-016: Vibração (haptics) no gol em touch
**Descrição:** leve vibração ao marcar gol em dispositivos touch compatíveis.
**Critérios de aceite:**
- [ ] Vibração curta no gol quando a API estiver disponível; ignora silenciosamente se não.
**Prioridade:** P2
**Dependências:** FR-008.

**Distribuição de prioridade:** P0 = 11, P1 = 4, P2 = 1. O núcleo jogável de um jogo é irredutível, por isso o P0 concentra a malha mínima para a partida funcionar; tudo que é polimento (som, tutorial, comemoração, pausa, haptics) foi rebaixado para P1/P2.

---

## 7. Requisitos não funcionais

#### Performance
- 50 fps ou mais em celular Android intermediário; alvo 60 fps.
- Carregamento inicial < 2s em 4G; jogo funciona offline depois de carregado.
- Loop de física estável com timestep fixo (independente do fps de render).

#### Compatibilidade
- Navegadores: Chrome, Safari, Firefox e Edge atuais, mobile e desktop.
- Entrada: mouse e toque com a mesma mecânica; suporte a ponteiro via Pointer Events.
- Responsivo de 320px a desktop; orientação retrato priorizada, paisagem tolerada.

#### Segurança e privacidade
- Sem cadastro, sem coleta de dados pessoais, sem rede no MVP.
- Sem analytics de terceiros no MVP (privacidade por padrão; coerente com LGPD por não tratar dados pessoais).

#### Manutenibilidade
- Código em um único projeto front-end, sem backend.
- Dados das seleções em um arquivo de config separado, fácil de editar.

#### Disponibilidade
- Hospedagem estática simples (qualquer host de arquivos estáticos); sem servidor para manter.

---

## 8. Arquitetura técnica

#### Visão geral
Aplicação 100% client-side. Um loop de jogo desenha o campo num `<canvas>` em visão de cima, roda uma física 2D simples (bola com atrito alto colidindo com círculos estáticos e com a borda da arena) e uma máquina de estados de turno controla vez, toques, gols e vitória. Não há backend, banco de dados, API nem autenticação.

#### Stack sugerida
- **Frontend:** HTML5 + Canvas 2D + JavaScript (ou TypeScript). Sem framework pesado obrigatório.
- **Física:** implementação própria leve (círculo-círculo e círculo-parede). Bibliotecas de física completas são desnecessárias e pesadas para este escopo.
- **Build:** entregável como arquivo único (HTML com JS embutido) para rodar como artifact e ser hospedado em qualquer lugar.
- **Sem:** backend, banco, login, pacote de UI, rede.

#### Fluxo do sistema (em texto)
Menu inicial leva à seleção de times, depois à configuração (toques e gols), depois à partida. Na partida, o loop de jogo atualiza física e render a cada frame. A entrada (pointerdown na bola, drag, pointerup) gera um impulso na bola. Quando a bola para, a máquina de turnos decide: contou gol? acabaram os toques? troca a vez? Ao atingir o número de gols, vai para a tela de fim, que volta ao menu ou reinicia.

---

## 9. UI/UX por tela

#### Tela inicial
- **Objetivo:** começar rápido.
- **Elementos:** título "Peteleco da Copa", botão grande "Jogar", botão "?" (como jogar), botão de áudio.
- **Estados:** estática.

#### Seleção de times
- **Objetivo:** cada lado escolhe sua seleção.
- **Elementos:** rótulo "Jogador 1" e "Jogador 2"; grade de 48 bandeiras com nome; confirmação por lado; botão "Continuar".
- **Fluxo:** J1 escolhe, J2 escolhe, "Continuar".
- **Estados:** vazio (nada escolhido, botão desabilitado), escolhido (destaque na seleção).

#### Configuração
- **Objetivo:** ajustar dificuldade.
- **Elementos:** seletor de toques (1/2/3, padrão 3), seletor de gols (3/5, padrão 5), botão "Começar".

#### Partida
- **Objetivo:** jogar.
- **Elementos:** campo (canvas), HUD (placar, vez, toques restantes), botão pausa.
- **Fluxo:** arrasta na bola, vê mira e força, solta, bola corre e para, repete ou passa a vez.
- **Estados:** vez de cada time, bola em movimento (entrada bloqueada), comemoração de gol, pausa.

#### Fim de partida
- **Objetivo:** mostrar vencedor e rejogar.
- **Elementos:** vencedor (bandeira + nome), placar final, "Jogar de novo", "Trocar times".

---

## 10. Modelo de dados (estado em memória)

Sem banco. O estado vive em memória durante a partida.

#### Seleção (Team) — dado de config
| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| code | string | Sim | Código curto (ex.: "BRA") |
| name | string | Sim | Nome exibido (ex.: "Brasil") |
| flag | string | Sim | Emoji da bandeira (ex.: "🇧🇷") |
| colorPrimary | string (hex) | Sim | Cor principal da camisa |
| colorSecondary | string (hex) | Não | Cor secundária/numero |

> Dado a preencher: a lista oficial das 48 seleções da Copa 2026 deve ser confirmada e inserida nesse formato. Os países-sede (EUA, México, Canadá) são vaga garantida; o restante depende da classificação. Não inventar a lista no código: usar um array de config editável.

#### Bola (Ball)
| Campo | Tipo | Descrição |
|---|---|---|
| x, y | number | Posição |
| vx, vy | number | Velocidade |
| radius | number | Raio de colisão |

#### Jogador estático (Peg)
| Campo | Tipo | Descrição |
|---|---|---|
| x, y | number | Posição fixa |
| radius | number | Raio de colisão |
| team | "A" \| "B" | Time dono |
| number | number | Número da camisa |

#### Estado da partida (MatchState)
| Campo | Tipo | Descrição |
|---|---|---|
| teamA, teamB | Team | Seleções escolhidas |
| scoreA, scoreB | number | Placar |
| goalsToWin | 3 \| 5 | Config de vitória |
| touchesPerTurn | 1 \| 2 \| 3 | Config de toques |
| currentTeam | "A" \| "B" | Vez atual |
| touchesLeft | number | Toques restantes na vez |
| phase | enum | menu, select, config, playing, ballMoving, goal, gameover |

---

## 11. Casos de borda e tratamento

| Cenário | Comportamento esperado |
|---|---|
| Arrasto curtíssimo (toque acidental) | Ignora, não consome toque, não dispara |
| Jogador tenta petelecar com a bola em movimento | Entrada bloqueada até a bola parar |
| Bola para encostada em jogador ou parede | Jogada segue normalmente do ponto atual |
| Bola para exatamente no centro do gol mas sem cruzar a linha | Não é gol; continua |
| Gol contra | Conta para o adversário `[default, ajustável]` |
| Bola "presa" oscilando com micro-velocidade | Considerar parada ao cair abaixo do limiar por X frames |
| Empate quando placar não tem teto de tempo | Não existe empate; jogo só acaba quando alguém atinge os gols |
| Os dois escolhem o mesmo país | Permitido, mas força cores distintas para distinguir |
| Aparelho vira (retrato/paisagem) | Reescala o campo sem perder estado da partida |

---

## 12. Requisitos de teste

#### Lógica (unidade)
- Máquina de turnos: consumo de toques, troca de vez, reset pós-gol, vitória.
- Detecção de gol: dentro das traves conta, fora não conta, gol contra atribui ao adversário.
- Mapeamento arrasto -> força/direção, incluindo teto de força e arrasto mínimo.

#### Física (integração)
- Bola para em <= 1,5s após peteleco médio.
- Colisão bola-parede e bola-jogador não permite atravessar nem sair da arena.

#### Jornada (E2E)
- Menu -> seleção -> config -> partida -> gol -> vitória -> jogar de novo, sem travar.

#### Performance
- 50+ fps com bola em movimento e colisões em celular Android intermediário.

---

## 13. Notas de implementação para IA (crítico)

#### Ordem de construção
1. Estado e máquina de fases (menu, select, config, playing, gameover).
2. Render do campo, jogadores estáticos e bola no canvas (visão de cima, retrato).
3. Física da bola: integração com atrito alto e timestep fixo.
4. Colisões círculo-círculo (bola vs jogadores) e bola vs borda da arena (use retângulo arredondado com aberturas de gol; é mais simples e estável que elipse verdadeira).
5. Mecânica de peteleco (pointerdown na bola, drag para mira/força, pointerup dispara).
6. Sistema de turnos com toques e bloqueio de entrada durante o movimento.
7. Detecção de gol, placar, reposição no centro, saída do time que sofreu.
8. Condição de vitória e telas de seleção/config/fim.
9. HUD e acessibilidade.
10. Polimento P1/P2: tutorial, som, comemoração, pausa, haptics.

#### Estrutura de arquivos sugerida (single-file friendly)
```
/peteleco-da-copa
  index.html        (entrega final em arquivo único, JS embutido)
  /src
    game.js         (loop e máquina de fases)
    physics.js      (integração + colisões)
    input.js        (pointer events, slingshot)
    render.js       (canvas)
    turns.js        (turnos, toques, gol, vitória)
    teams.js        (config das 48 seleções)
    ui.js           (menus, HUD, telas)
```

#### Detalhes críticos de implementação
- **Timestep fixo** para a física (ex.: acumulador de 1/120s), render interpolado, para o jogo se comportar igual em qualquer fps.
- **Atrito alto:** aplicar damping forte por passo (ex.: v *= ~0.90 por frame de física, calibrar) e zerar a velocidade abaixo de um limiar para a bola "assentar" rápido, imitando a pastilha de madeira.
- **Slingshot:** direção de disparo = vetor da posição atual do arrasto até a bola (puxar pra trás), magnitude proporcional ao comprimento do arrasto, com teto. Desenhar linha-guia no sentido do disparo para não confundir as crianças.
- **Arrasto mínimo** de ~15px para não disparar por toque acidental.
- **Bloqueio de entrada** enquanto `phase === ballMoving`.
- **Gol:** detectar cruzamento da linha de gol entre as traves no passo de física, não só no fim do movimento, para não perder gol de bola rápida.
- **Pointer Events** unificados para mouse e toque; nunca depender só de eventos de mouse.
- **Cores e número** sempre juntos para distinguir times (acessibilidade/daltonismo).

#### Bibliotecas a usar
- Nenhuma obrigatória. Canvas 2D nativo e Pointer Events bastam.
- Se quiser tipos, TypeScript; opcional.

#### Bibliotecas a evitar
- Engines de física pesadas (Matter.js, Box2D): excesso para colisões de círculos estáticos; aumentam peso e complexidade.
- Frameworks de UI pesados para os menus: o jogo é pequeno e mobile-first.

#### Armadilhas comuns
- Bola atravessando parede/jogador em alta velocidade: usar passos de física pequenos ou checagem de colisão contínua simples.
- Confusão na direção do slingshot: sempre mostrar a linha-guia no sentido real do disparo.
- Gol perdido por bola rápida: detectar gol dentro do passo de física.
- Quebra em telas pequenas: testar em 320px de largura desde cedo.

#### Abordagem de testes
- Priorizar testes de turnos e detecção de gol (regras do jogo).
- Testes manuais de física e sensação do peteleco (calibragem é empírica).
- Pular testes de UI estática.

---

## 14. Premissas e questões em aberto

**Premissas adotadas:**
- Jogo client-side, sem backend, entregue como arquivo único.
- Sem coleta de dados; logo, sem implicação relevante de LGPD no MVP.
- Seleções representadas por bandeira (emoji) + cores, sem nomes/likeness de jogadores reais.
- Sem uso de marcas oficiais da FIFA nem do emblema "Copa do Mundo 2026"; o produto usa "Copa" de forma genérica para evitar risco de marca.

**Questões em aberto (para você decidir antes do build):**
1. Gol contra conta para o adversário? (padrão: sim)
2. Sem goleiro especial está ok, ou quer uma trave/defensor central reforçado? (padrão: sem goleiro)
3. Formação fixa dos 5 jogadores: usar a da foto, ou quer testar 2 formações? (padrão: uma formação fixa estilo foto)
4. Padrão de toques: 3 está bom como default para idades mistas? (padrão: 3)
5. Quer som no MVP ou pode ficar para o fast-follow P1? (sugestão: P1)
