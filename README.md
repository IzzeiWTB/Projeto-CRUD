# Projeto CRUD - API Full-Stack com Node.js, React e Docker

Este projeto consiste em uma aplicacao full-stack composta por um backend desenvolvido em Node.js com Express e um frontend estruturado em React com Tailwind CSS. A aplicacao possui dois contextos de persistencia de dados distintos, controle de acesso seguro e roda inteiramente dentro de containers Docker.

## Tecnologias Utilizadas

### Backend
- Node.js e Express para a estrutura da API
- MongoDB (NoSQL) para armazenar os recursos Carros, Motos e Marcas de Roupa
- PostgreSQL (SQL) para gerenciar o cadastro e perfis de Usuarios
- Mongoose e Sequelize como intermediarios de banco de dados
- JSON Web Token (JWT) para autenticacao
- bcryptjs para criptografia de senhas
- Helmet, express-rate-limit e express-validator para seguranca (OWASP Top 10)
- Jest e Supertest para testes de integracao
- Swagger para documentacao da API

### Frontend
- React 18 e React Router DOM para a interface web
- Tailwind CSS para a estilizacao responsiva
- Axios para conexao com a API
- Nginx como servidor web e proxy reverso para encaminhamento das rotas de API

## Como Executar o Projeto

### Pre-requisitos
- Docker e Docker Compose instalados na maquina.

### Instrucoes de Execucao
1. Clone este repositorio.
2. Certifique-se de ter o arquivo .env criado na raiz do projeto (você pode copiar as variaveis do arquivo .env.example).
3. Suba todos os containers com o comando:
   docker-compose up --build -d

A aplicacao estara pronta para uso nos enderecos:
- Frontend (Interface Web): http://localhost
- Backend (API): http://localhost:3000
- Documentacao Swagger: http://localhost/api-docs

## Credenciais de Acesso

Ao iniciar, o backend insere automaticamente dois usuarios de teste no banco de dados caso a tabela de usuarios esteja vazia:

- Administrador (Acesso total, incluindo CRUD de usuarios):
  - E-mail: admin@exemplo.com
  - Senha: admin123
- Usuario Comum (Acesso apenas aos CRUDs de carros, motos e marcas):
  - E-mail: user@exemplo.com
  - Senha: user123

## Execucao dos Testes de Integracao

Para rodar os testes de integracao da aplicacao em ambiente isolado no container Docker, utilize o comando:
docker-compose run --rm -e NODE_ENV=development backend sh -c "npm install && npm test -- --runInBand"
