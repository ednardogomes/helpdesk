# 🎫 Helpdesk Multi-Tenancy & Multimódulo

Bem-vindo ao projeto **Helpdesk**, um sistema moderno de gestão de chamados (Ticketing) projetado com foco em arquitetura Multi-empresa (Multi-tenancy) e BDD (Behavior-Driven Development).

---

## 🎯 Objetivos do Projeto

O objetivo principal deste projeto é fornecer uma plataforma SaaS (Software as a Service) base para gestão de suporte e atendimento. Diferente de helpdesks tradicionais, este sistema permite que:

- **Múltiplos clientes (Empresas)** usem a mesma base de dados de forma totalmente isolada.
- **Setores Personalizados (Módulos)** sejam oferecidos sob demanda (ex: a "Empresa A" só tem contrato para abrir chamados de TI, enquanto a "Empresa B" pode acessar TI e RH).

## ✨ Funcionalidades Principais

O sistema foi arquitetado em 4 fases incrementais que cobrem os seguintes domínios:

1. **IAM (Gestão de Identidade e Acesso)**
   - Autenticação de usuários via JWT.
   - Segregação de acesso baseada em Perfis (`SUPER_ADMIN`, `ADMIN`, `AGENT`, `USER`).
   - Amarração rigorosa de Usuários às suas respectivas Empresas (`Companies`).

2. **Core Multimódulo (Roteamento de Setores)**
   - Criação de múltiplos canais de atendimento (`HelpdeskModules` como TI, Manutenção, Facilities).
   - "Fechadura" de Acesso: Tabela pivô de permissões onde o Admin decide quais empresas podem enxergar quais setores.

3. **Ticketing (Gestão de Chamados)**
   - Abertura de chamados vinculados ao setor escolhido.
   - Máquina de Estados de status rigorosa (`OPEN`, `IN_PROGRESS`, `RESOLVED`, etc).
   - Listagem com filtro automático (O usuário comum só enxerga seus próprios chamados; o atendente enxerga a fila de trabalho).

4. **Operação, Chat e Notificações**
   - Sistema de histórico (Comentários) em formato de Chat, permitindo que o Atendente marque notas como "Internas" (invisíveis ao cliente final).
   - Sistema de Alertas/Notificações assíncronas geradas via eventos (ex: "Seu chamado foi assumido pelo atendente X").

---

## 🏗️ Arquitetura e Stack Tecnológica

- **Backend:** [NestJS](https://nestjs.com/) (Node.js framework opinativo e estruturado).
- **ORM / Banco de Dados:** [TypeORM](https://typeorm.io/) com **PostgreSQL**.
- **Infraestrutura Local:** Docker Compose para subir o banco de dados.
- **Frontend:** SPA (Single Page Application).

---

## 🚀 Como Executar o Projeto Localmente

Para rodar o projeto do zero na sua máquina, siga os passos abaixo.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose instalados

### Passo 1: Subir o Banco de Dados

A infraestrutura do banco de dados já está configurada no Docker. Na raiz do projeto, rode:

```bash
docker compose up -d
```

_(Isso iniciará um container PostgreSQL com as credenciais padrões configuradas)._

### Passo 2: Configurar e Rodar o Backend

Navegue até a pasta do backend, instale as dependências e rode as migrations para criar a estrutura de tabelas:

```bash
cd backend
npm install

# Aplica a estrutura de tabelas no banco de dados (Migrations)
npm run migration:run

# Inicia o servidor em ambiente de desenvolvimento
npm run start:dev
```

A API estará rodando em `http://localhost:3000`.

### Passo 3: Executar o Frontend

Em uma nova aba do terminal, acesse a pasta do front-end e inicie a aplicação:

```bash
cd frontend
npm install
npm run dev  # ou 'npm start', dependendo do framework escolhido
```

---

## 🛡️ Migrations e Banco de Dados (Para Desenvolvedores)

Se você criar novas entidades (`.entity.ts`) no backend, precisará gerar novas migrations para refletir isso no PostgreSQL.

Para **gerar** uma migration baseada na alteração dos seus arquivos TypeScript:

```bash
cd backend
npm run migration:generate -- ./src/migrations/NomeDaSuaAlteracao
```

Para **aplicar** a migration gerada no banco de dados:

```bash
npm run migration:run
```
