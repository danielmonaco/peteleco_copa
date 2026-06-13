# Match Flow & UI Specification

> Feature do Milestone 1. Cobre o fluxo de telas (início → seleção → config → partida → fim), o HUD durante a partida e a acessibilidade para idades mistas. Fonte: PRD §6 FR-001, FR-002, FR-003, FR-010, FR-011, §9.

## Problem Statement

O pai precisa abrir o jogo e entregar o aparelho pronto em poucos toques; as crianças precisam jogar sozinhas sem ler muito. Esta feature liga o núcleo jogável (`core-gameplay`) ao usuário: menu para começar, escolha das 48 seleções, ajuste de dificuldade, HUD sempre visível e um padrão de acessibilidade (alvos grandes, alto contraste, seguro para daltonismo) que atravessa todas as telas.

## Goals

- [ ] Do menu ao 1º peteleco em < 30s, sem cadastro/login/termos.
- [ ] Cada lado escolhe uma das 48 seleções em 1 toque, com bandeira + nome + cor.
- [ ] Dificuldade ajustável por botões grandes (toques 1/2/3, gols 3/5), sem digitação.
- [ ] HUD com placar, vez e toques restantes sempre visível, sem cobrir a área jogável.
- [ ] Usável pelo filho mais novo e pelo mais velho: alvos ≥ 48px, fonte ≥ 18px, alto contraste, seguro para daltonismo.

## Out of Scope

| Feature | Reason |
|---|---|
| Física, peteleco, turnos, gol, vitória | Pertencem a `core-gameplay` (M1) |
| Tutorial relâmpago, som, comemoração animada, pausa, haptics | Polimento — `game-polish` (M2) |
| Busca/filtro por nome na seleção | P1; com 48 itens a grade rolável basta no P0 (FR-002) |
| Lista oficial confirmada das 48 seleções | Bloqueada (B-01); usa config editável `teams.js` (D-13) |

---

## User Stories

### P1: Tela inicial e início de partida ⭐ MVP

**User Story**: Como pai, quero abrir o jogo e começar uma partida em poucos toques, para entregar o aparelho pronto para os filhos.

**Why P1**: É a porta de entrada; a meta de "< 30s até o 1º peteleco" começa aqui.

**Acceptance Criteria**:
1. WHEN a tela inicial carrega THEN o sistema SHALL mostrar um botão grande "Jogar" (alvo ≥ 48px de altura).
2. WHEN o jogador toca em "Jogar" THEN o sistema SHALL ir à seleção de times.
3. WHEN o jogo abre THEN o sistema SHALL não exigir cadastro, login nem aceite de termos para iniciar.
4. WHEN a tela inicial é exibida em celular padrão (360×640) THEN todo o conteúdo SHALL caber sem rolagem.

**Independent Test**: Abrir o jogo em 360×640, ver "Jogar" grande sem rolagem, tocar e cair na seleção — sem nenhuma barreira de cadastro. Cobre FR-001.

---

### P1: Seleção das seleções (times) ⭐ MVP

**User Story**: Como jogador, quero escolher meu país entre as 48 seleções, para torcer pelo meu time.

**Why P1**: Define a identidade visual (cores) que o `core-gameplay` usa para distinguir os times.

**Acceptance Criteria**:
1. WHEN a tela de seleção abre THEN o sistema SHALL mostrar uma grade rolável com as 48 seleções, cada uma com bandeira (emoji) e nome.
2. WHEN J1 e J2 escolhem THEN o sistema SHALL permitir times diferentes ou iguais; se iguais, SHALL forçar cores distintas para distingui-los.
3. WHEN um time é escolhido THEN o sistema SHALL derivar sua cor primária de camisa das cores nacionais (config `teams.js`).
4. WHEN um lado seleciona THEN a confirmação SHALL ocorrer em 1 toque por lado, com destaque visual na seleção escolhida.
5. WHEN nenhum dos dois escolheu THEN o botão "Continuar" SHALL ficar desabilitado; quando ambos escolheram, SHALL habilitar.

**Independent Test**: Escolher Brasil para J1 e Argentina para J2 (1 toque cada), ver destaque e "Continuar" habilitar; escolher o mesmo país dos dois lados e confirmar cores distintas forçadas. Cobre FR-002.

---

### P1: Configuração da partida ⭐ MVP

**User Story**: Como pai, quero ajustar toques por vez e gols para vencer, para equilibrar idades diferentes.

**Why P1**: É o mecanismo de equilíbrio entre o filho novo e o mais velho.

**Acceptance Criteria**:
1. WHEN a config abre THEN o sistema SHALL oferecer seletor de toques por vez 1/2/3 com padrão 3.
2. WHEN a config abre THEN o sistema SHALL oferecer seletor de gols para vencer 3/5 com padrão 5.
3. WHEN a config abre THEN o sistema SHALL oferecer seletor de dificuldade Fácil/Médio/Difícil com padrão Médio (presets de tamanho de jogadores/goleiro e largura do gol — ver D-17; modelo já implementado em `src/difficulty.js`).
4. WHEN o jogador ajusta as opções THEN os controles SHALL ser botões grandes do tipo seletor, sem digitação.
5. WHEN a partida começa THEN a configuração escolhida SHALL valer para a partida inteira.

> Nota: um seletor tátil de dificuldade já existe como semente na fase `config` do core (`game.js`); a tela completa de config desta feature deve absorvê-lo junto com toques e gols.

**Independent Test**: Abrir config com 3 toques / 5 gols por padrão, trocar para 1 toque / 3 gols por botões, começar e confirmar que a partida respeita os valores. Cobre FR-003.

---

### P1: HUD durante a partida ⭐ MVP

**User Story**: Como jogador, quero acompanhar placar, vez e toques restantes sem perguntar, para jogar sozinho.

**Why P1**: Sem HUD a criança não sabe de quem é a vez nem quantos toques tem.

**Acceptance Criteria**:
1. WHEN a partida está em andamento THEN o sistema SHALL manter o placar dos dois times sempre visível no topo.
2. WHEN é a vez de um time THEN o sistema SHALL destacar o indicador de vez pela cor do time da vez (acompanhado de bandeira/nome).
3. WHEN há toques restantes THEN o sistema SHALL mostrá-los de forma icônica (ex.: bolinhas) além do número.
4. WHEN o HUD é renderizado THEN ele SHALL não cobrir a área jogável da bola.

**Independent Test**: Durante a partida, ver placar no topo, indicador de vez colorido, toques como ícones+número; confirmar que o HUD não sobrepõe a área de jogo. Cobre FR-010 (consome o estado de turno de `core-gameplay` CORE-04).

---

### P1: Acessibilidade para idades mistas ⭐ MVP

**User Story**: Como pai, quero que os dois filhos joguem sem ajuda, para evitar atrito.

**Why P1**: É um requisito transversal que define se o produto cumpre seu propósito (idades mistas).

**Acceptance Criteria**:
1. WHEN qualquer alvo interativo é renderizado THEN ele SHALL ter ≥ 48px e a fonte de corpo SHALL ser ≥ 18px.
2. WHEN elementos são exibidos THEN o sistema SHALL manter alto contraste entre bola, campo, jogadores e HUD.
3. WHEN cores de time são usadas THEN o sistema SHALL nunca depender só de vermelho/verde e SHALL sempre acompanhar número e/ou padrão (seguro para daltonismo).
4. WHEN ações principais são apresentadas THEN o sistema SHALL minimizar texto e torná-las reconhecíveis por ícone.
5. WHEN a partida ocorre THEN o sistema SHALL não impor pressão de tempo (sem relógio — D-08).

**Independent Test**: Inspecionar telas medindo alvos (≥48px) e fonte (≥18px); simular daltonismo e confirmar que time se distingue por número/padrão, não só cor. Cobre FR-011.

---

## Edge Cases

- WHEN os dois jogadores escolhem o mesmo país THEN o sistema SHALL permitir, mas forçar cores distintas para distinguir.
- WHEN nada foi escolhido na seleção THEN "Continuar" SHALL permanecer desabilitado.
- WHEN o aparelho vira (retrato/paisagem) THEN as telas SHALL reescalar sem perder o estado/seleção.
- WHEN exibido em 320px de largura THEN as telas SHALL permanecer usáveis sem quebra (armadilha comum PRD §13).

---

## Requirement Traceability

| Requirement ID | Origem PRD | Story | Phase | Status |
|---|---|---|---|---|
| FLOW-01 | FR-001 | Tela inicial e início | Design | Pending |
| FLOW-02 | FR-002 | Seleção das seleções | Design | Pending |
| FLOW-03 | FR-003 | Configuração da partida | Design | Pending |
| FLOW-04 | FR-010 | HUD durante a partida | Design | Pending |
| FLOW-05 | FR-011 | Acessibilidade idades mistas | Design | Pending |

**ID format:** `FLOW-NN`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 5 total, 0 mapeados a tasks (Tasks pendente), 0 verificados.

**Dependência cruzada:** FLOW-04 (HUD) consome o estado de turno de CORE-04; a fase do jogo (`menu/select/config/playing/ballMoving/goal/gameover`) é compartilhada com `core-gameplay`.

---

## Success Criteria

- [ ] Menu → seleção → config → 1º peteleco em < 30s observado.
- [ ] 48 seleções selecionáveis em 1 toque, com cores distintas garantidas quando iguais.
- [ ] Config de toques/gols por botões grandes, sem digitação, respeitada na partida.
- [ ] HUD sempre visível, não cobre a área jogável.
- [ ] Alvos ≥ 48px, fonte ≥ 18px, distinção de time não depende só de cor; usável em 320px.
