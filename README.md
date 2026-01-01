# zpErp

Sistema de Gestão Empresarial completo. Simples assim.

## O que é isso?

Um ERP moderno e minimalista para gerenciar todos os aspectos do seu negócio em um só lugar. Interface elegante em preto e branco, focada na experiência do usuário.

## Módulos

### Dashboard
- Visão geral de todas as métricas
- Ações rápidas para tarefas comuns
- Resumo financeiro e de atividades
- Cards com indicadores principais

### Financeiro
- Controle de receitas e despesas
- Gestão de contas bancárias
- Fluxo de caixa
- Previsão financeira

### Tarefas
- Lista de tarefas com filtros
- Status: Pendente, Em Andamento, Concluída
- Interface limpa e direta
- Produtividade em foco

### Clientes
- Cadastro completo de clientes
- Busca e filtros avançados
- Visualização em grid ou lista

### Produtos
- Gestão de produtos e estoque
- Categorização
- Controle de inventário

### Vendas
- Registro de vendas
- Status de pedidos
- Faturamento

### Relatórios
- Relatório de Vendas
- Relatório Financeiro
- Relatório de Clientes
- Relatório de Produtos
- Relatório Gerencial
- Relatórios Personalizados

### Configurações
- Gerenciamento de Usuários
- Dados da Empresa
- Configurações do Sistema
- Backup
- Integrações

## Stack

### Frontend
- Vue 3 (Composition API)
- TypeScript
- Vuetify 3 (componentes Material Design)
- Vite
- Pinia (gerenciamento de estado)
- pnpm

### Backend
- NestJS
- TypeScript
- Sequelize ORM
- JWT (autenticação)

### Banco
- MariaDB

## Como rodar

### Pré-requisitos
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose

### Setup

```bash
# Clona o repo
git clone https://github.com/seu-usuario/zperp.git
cd zperp

# Backend
cd server
pnpm install
pnpm run start:dev

# Frontend (em outro terminal)
cd client
pnpm install
pnpm run dev
```

## Estrutura

```
zperp/
├── client/              # Vue 3 + Vuetify
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── layouts/     # Layout principal
│   │   ├── views/       # Páginas
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── financeiro/
│   │   │   ├── tarefas/
│   │   │   ├── clientes/
│   │   │   ├── produtos/
│   │   │   ├── vendas/
│   │   │   ├── relatorios/
│   │   │   └── configuracoes/
│   │   ├── stores/      # Pinia stores
│   │   └── router/      # Rotas
│   └── ...
├── server/              # NestJS
│   ├── src/
│   │   ├── modules/     # Módulos da aplicação
│   │   ├── models/      # Models Sequelize
│   │   └── common/      # Decorators, guards, etc
│   └── ...
└── README.md
```

## Design

O sistema utiliza um tema **preto e branco** minimalista:
- Interface escura com detalhes em branco
- Ícones MDI (Material Design Icons)
- Tipografia: Sora (UI) + JetBrains Mono (dados)
- Cards com bordas sutis e animações suaves
- Layout responsivo

## Roadmap

- [x] Autenticação
- [x] Layout principal
- [x] Dashboard
- [ ] Módulo Financeiro completo
- [ ] Módulo Tarefas completo
- [ ] Módulo Clientes completo
- [ ] Módulo Produtos completo
- [ ] Módulo Vendas completo
- [ ] Relatórios dinâmicos
- [ ] Integrações

## Licença

MIT - faça o que quiser

---

Feito com café, música e tentativa e erro.
