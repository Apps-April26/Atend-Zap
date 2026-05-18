# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto: Atendimentos WhatsApp v3.0

Sistema SaaS de pré-atendimento WhatsApp para PMEs do Rio de Janeiro. 4 nichos: Materiais de Construção, Gastronomia, Produtos Médicos, PetShop/Vet. Involves: página pública com agentes WhatsApp, CRM com gráficos regionais e horário, matriz de permissão, editor de conteúdo, webhook com autenticação.

## Stack Tecnológica

| Ferramenta | Uso |
|---|---|
| React + Node.js | Frontend, backend, lógica |
| Supabase | Banco de dados + autenticação + RLS |
| Hostinger | Hospedagem + domínio + SSL |
| Claude Code + Minimax | Construção e manutenção |
| GPT Maker (R$87/mês) | 5 agentes WhatsApp |
| IMask.js | Máscaras de campo (sem jQuery) |
| Chart.js | Gráficos: barras, donut, heatmap, linha do tempo |
| Leaflet.js | Mapa coroplético do RJ por bairro/região |

## Fases de Desenvolvimento

| Fase | Entregável |
|---|---|
| 1 | Página inicial pública + links WhatsApp (wa.me) + HTTPS |
| 2 | Supabase: banco completo + RLS + webhook com token |
| 3 | CRM: tabela + filtros + exportar CSV + logs de acesso |
| 4 | Gráficos: heatmap + donut + barras + linha do tempo |
| 5 | Mapa coroplético do RJ por bairro/região |
| 6 | Matriz de permissão + login + editor de conteúdo |
| 7 | Testes, segurança final, LGPD e deploy |

## Arquitetura do Banco de Dados

### Tabela principal: `atendimentos`

**Campos base:**
- `id` (UUID) — identificador único
- `data_hora` (TIMESTAMP) — data/hora da interação
- `nome` (TEXT) — nome do cliente (3–100 chars)
- `telefone` (TEXT) — somente números, 10–11 dígitos
- `nicho` (ENUM) — construcao | gastronomia | medico | petshop
- `resumo_conversa` (TEXT) — gerado pela IA
- `produtos_citados` (TEXT) — produtos/serviços mencionados
- `transferido_para` (TEXT) — nome do atendente (se transferido)
- `status` (ENUM) — encerrado | transferido | pendente
- `lembrete` (TEXT) — máx 300 chars
- `lembrete_data` (TIMESTAMP)

**Campos v2 — Agendamento e Logística:**
- `data_agendamento` (DATE)
- `hora_agendamento` (TIME)
- `tipo_atendimento` (ENUM) — entrega | consulta | retirada | presencial
- `endereco_entrega` (TEXT)
- `numero_endereco` (TEXT)
- `complemento` (TEXT)
- `bairro_entrega` (TEXT) — chave para gráfico regional
- `regiao_entrega` (ENUM) — Zona Norte | Sul | Oeste | Centro | Baixada | Grande RJ
- `cep_entrega` (TEXT) — somente 8 números
- `status_entrega` (ENUM) — agendado | confirmado | em_rota | entregue | cancelado
- `observacao_entrega` (TEXT) — máx 300 chars

### Tabela de logs de acesso ao CRM
- `user_id`, `acao`, `data_hora`

### Perfis de acesso (matriz de permissão)
- Administrador: acesso total (CRUD agentes, permissões, exportação)
- Usuário Comum: visualiza atendimentos, cria lembretes próprios, atualiza status entrega

## Segurança — Implementar DESDE O INÍCIO

- **HTTPS** — redirecionar HTTP → HTTPS em toda aplicação (SSL já incluso na Hostinger)
- **RLS (Row Level Security)** — ativar em todas as tabelas; cada cliente só enxerga próprios dados
- **Webhook auth** — endpoint receptor exige token secreto no header (GPT Maker → sistema)
- **Sanitização de inputs** — nenhum dado do WhatsApp entra no banco sem tratamento (remover HTML/scripts)
- **Variáveis de ambiente** — chaves API (Anthropic, Supabase, GPT Maker) nunca no código, sempre em `.env`
- **Força bruta** — bloquear após 5 tentativas erradas de login (Supabase Auth)
- **Logs de acesso** — registrar user_id, ação, data_hora de cada acesso ao CRM

## Fluxo Principal

1. Cliente acessa link público → vê 4 botões de nicho
2. Clica no agente → wa.me abre com mensagem pré-definida
3. GPT Maker + IA coleta dados (nome, telefone, endereço, data/hora, tipo)
4. Webhook (com token auth) envia dados para Supabase
5. Equipe visualiza no CRM: atendimento, agendamento, endereço, região
6. Gráficos mostram demanda por bairro, região e horário

## Design System

- **Fundo página:** #0A0A0A (preto)
- **Colunas:** border-radius 26px, iluminadas internamente, textos #FFFFFF
- **Fontes:** Poppins 800 (nomes), Inter 500/700 (labels, botões)
- **Paletas por nicho:**
  - Construção: âmbar (#F59E0B)
  - Gastronomia: laranja (#FB923C)
  - Produtos Médicos: azul (#38BDF8)
  - PetShop: verde (#22C55E)

## Telas do Sistema

1. Página Inicial (pública) — 4 botões de agente + link CRM
2. Agente Materiais / Gastronomia / Produtos Médicos / PetShop — WhatsApp
3. CRM / Dashboard — tabela + mapa calor + gráficos regionais
4. Matriz de Permissão — login + gerenciamento de perfis
5. Editor de Conteúdo — edição de agentes

## LGPD (Obrigatório desde o lançamento)

- Aviso de coleta visível na página inicial e no agente
- "Seus dados serão usados apenas para atendimento"
- Primeira mensagem do agente inclui consentimento
- Botão no CRM para exclusão de dados (somente Administrador)
- Política de privacidade pública

## Regras Técnicas

- JavaScript puro + IMask.js (sem jQuery)
- Chart.js para gráficos
- Leaflet.js para mapa coroplético
- Temas light/dark/blue
- Desenvolver fase por fase

## Custos Operacionais

- Claude Pro + Minimax: R$110/mês (operação)
- GPT Maker (5 agentes): R$87/mês
- Hostinger: R$45/mês
- **Total operação: R$242/mês**
