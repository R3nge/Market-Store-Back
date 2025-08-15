🛍️ Market Store - Backend

Backend desenvolvido em Node.js + TypeScript para uma loja de roupas online, com autenticação segura, gerenciamento de produtos e integração com banco de dados via Prisma ORM.

🚀 Tecnologias Utilizadas

Node.js – Ambiente de execução JavaScript no servidor

Express – Framework para criação de APIs

TypeScript – Tipagem estática e melhor organização do código

Prisma ORM – Acesso ao banco de dados de forma simples e tipada

Knex.js – Migrations e queries SQL

SQLite – Banco de dados leve e rápido para desenvolvimento

JWT (JSON Web Token) – Autenticação de usuários

Bcrypt – Criptografia de senhas

Zod – Validação de dados

Dotenv – Configuração de variáveis de ambiente

📂 Estrutura do Projeto
src/
 ├── controllers/   # Lógica de controle das rotas
 ├── middlewares/   # Middlewares para autenticação e validação
 ├── routes/        # Definição das rotas da API
 ├── prisma/        # Configurações do Prisma ORM
 ├── server.ts      # Inicialização do servidor
 └── ...

⚙️ Instalação e Uso
# Clonar o repositório
git clone https://github.com/R3nge/Market-Store-Back.git

# Acessar a pasta do projeto
cd Market-Store-Back

# Instalar as dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar o servidor em modo desenvolvimento
npm run dev

🔑 Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto com as variáveis necessárias:

DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta"
PORT=3000

📌 Funcionalidades Implementadas

Cadastro e login de usuários com autenticação JWT

Criptografia de senhas com Bcrypt

CRUD de produtos

Integração com banco de dados via Prisma ORM

Validação de entrada de dados com Zod

Suporte a SQLite (dev) e outros bancos em produção

🖥️ Scripts Disponíveis
npm run dev          # Rodar o servidor em desenvolvimento
npm run vercel-build # Build para deploy no Vercel
npm run database     # Executar migrations do banco

📄 Licença

Este projeto está licenciado sob a licença ISC.

