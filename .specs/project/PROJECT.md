# Peteleco da Copa

**Vision:** Jogo web de futebol de peteleco em visão de cima, 2 jogadores no mesmo aparelho (hot-seat), que recria a mecânica do tabuleiro físico "Mundo de Peteleco" e roda na hora no navegador, sem instalação.
**For:** Os filhos do dono do produto (idades mistas — criança + pré-adolescente) brincarem juntos em dias de chuva; o pai como organizador.
**Solves:** Falta de uma versão digital simples e fiel do peteleco, jogável sem ler muito, equilibrável entre idades, que abre instantaneamente.

## Goals

- **Começo rápido:** do menu ao 1º peteleco em < 30s (alvo de usabilidade do PRD).
- **Mecânica fiel e gostosa:** bola de alto atrito (para em ≤ 1,5s após peteleco médio), jogadores estáticos, toques limitados por jogada — sensação do tabuleiro físico.
- **Acessível a idades mistas:** o filho mais novo joga sozinho após 1 explicação; alvos ≥ 48px, fonte ≥ 18px, seguro para daltonismo.
- **Roda bem:** ≥ 50 fps em celular Android intermediário (alvo 60 fps), física com timestep fixo.
- **Equilíbrio ajustável:** toques por vez (1/2/3) e gols para vencer (3/5) reduzem goleadas.

## Tech Stack

**Core:**
- Plataforma: Web (navegador), 100% client-side, sem backend.
- Render: HTML5 `<canvas>` 2D nativo.
- Linguagem: JavaScript (TypeScript opcional, só para tipos).
- Entrada: Pointer Events (mouse + toque unificados).
- Física: implementação própria leve (círculo-círculo e círculo-parede); **sem** engine pesada (Matter.js/Box2D).

**Build / entrega:** arquivo único `index.html` com JS embutido, hospedável em qualquer host estático; funciona offline depois de carregado.

**Key dependencies:** nenhuma obrigatória. Canvas 2D + Pointer Events bastam.

## Scope

**v1 (MVP) inclui:**
- Partida única amistosa, hot-seat 2 jogadores.
- Escolha entre as 48 seleções da Copa 2026 (bandeira emoji + cores), 5 jogadores estáticos por time.
- Config: 1/2/3 toques por vez (padrão 3) e 3/5 gols para vencer (padrão 5).
- Física de alto atrito, mecânica de peteleco estilo estilingue, turnos, detecção de gol, vitória.
- Entrada por mouse e por toque, mesma mecânica; responsivo de 320px a desktop, retrato priorizado.

**Explicitamente fora de escopo:**
- Modo contra o computador (CPU/IA).
- Modo Copa / torneio / chaveamento.
- Online / multiplayer remoto.
- Contas, login, ranking, persistência de histórico.
- Goleiro controlável, faltas, escanteio, lateral, relógio.

## Constraints

- **Técnico:** sem backend, banco, rede ou analytics no MVP; entrega como arquivo único estático.
- **Privacidade:** sem coleta de dados pessoais (coerente com LGPD por não tratar dados).
- **Legal:** sem marcas oficiais FIFA nem emblema "Copa do Mundo 2026"; "Copa" usado de forma genérica; sem nomes/likeness de jogadores reais (só bandeira + cores).
- **Dados:** lista das 48 seleções da Copa 2026 a confirmar e manter em arquivo de config editável — não inventar no código.
