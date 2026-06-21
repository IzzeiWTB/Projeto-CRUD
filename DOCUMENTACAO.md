# Documentação do Projeto — API Full-Stack com Node.js e Frontend React

## 1. Visão Geral

Este projeto consiste em uma aplicação full-stack composta por um backend RESTful desenvolvido com Node.js e Express, e um frontend moderno construído com React e Tailwind CSS. A aplicação implementa um sistema de gestão com autenticação JWT, dois contextos de persistência de dados distintos, e é totalmente containerizada com Docker para facilitar a execução e implantação.

## 2. Arquitetura

A aplicação segue uma arquitetura de microsserviços containerizados, orquestrados pelo Docker Compose. São quatro serviços principais:

- **Backend (Node.js/Express)**: API RESTful na porta 3000, responsável por toda a lógica de negócio, autenticação e acesso aos bancos de dados.
- **Frontend (React/Nginx)**: Interface web servida pelo Nginx na porta 80, com proxy reverso para a API.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar os recursos de carros, motos e marcas de roupa.
- **PostgreSQL**: Banco de dados relacional SQL utilizado para o gerenciamento de usuários e autenticação.

## 3. Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**: Framework web para criação da API RESTful.
- **Mongoose**: ODM (Object Document Mapper) para interação com o MongoDB.
- **Sequelize**: ORM (Object Relational Mapper) para interação com o PostgreSQL.
- **JSON Web Token (JWT)**: Mecanismo de autenticação stateless, garantindo segurança nas comunicações.
- **bcryptjs**: Biblioteca para hash seguro de senhas antes do armazenamento.
- **express-validator**: Validação e sanitização de dados de entrada para prevenção de injeções.
- **Helmet**: Middleware que configura headers HTTP de segurança automaticamente.
- **express-rate-limit**: Proteção contra ataques de força bruta e DDoS.
- **swagger-jsdoc + swagger-ui-express**: Geração automática de documentação interativa da API.
- **Morgan**: Logger de requisições HTTP para auditoria.
- **Jest + Supertest**: Framework de testes e biblioteca para testes de integração HTTP.

### Frontend
- **React 18**: Biblioteca para construção de interfaces reativas e componentizadas.
- **Tailwind CSS v3**: Framework de estilização utility-first para design responsivo e moderno.
- **React Router DOM**: Gerenciamento de rotas SPA (Single Page Application).
- **Axios**: Cliente HTTP para comunicação com a API, com interceptors para JWT.
- **Vite**: Bundler moderno e rápido para desenvolvimento e build de produção.
- **Nginx**: Servidor web de alta performance para servir a build estática e atuar como proxy reverso.

### Infraestrutura
- **Docker**: Containerização de cada serviço da aplicação.
- **Docker Compose**: Orquestração dos quatro containers com redes, volumes e healthchecks.

## 4. Segurança — OWASP Top 10

O projeto implementa diversas medidas de segurança alinhadas com as recomendações da OWASP Top 10:

| Vulnerabilidade OWASP | Mitigação Implementada |
|------------------------|------------------------|
| A01 - Broken Access Control | Autenticação JWT obrigatória em rotas protegidas; autorização por roles (admin/user) |
| A02 - Cryptographic Failures | Senhas armazenadas com hash bcrypt (salt rounds 10); JWT com segredo configurável |
| A03 - Injection | Validação e sanitização de todas as entradas com express-validator; uso de ORMs/ODMs |
| A04 - Insecure Design | Rate limiting global e específico para login; limitação de tamanho do body (10kb) |
| A05 - Security Misconfiguration | Headers HTTP seguros via Helmet; CORS configurável via variável de ambiente |
| A07 - XSS | Sanitização de inputs; Content Security Policy via Helmet |
| A09 - Security Logging & Monitoring | Logs de todas as requisições HTTP via Morgan |

## 5. Estrutura dos CRUDs

### Recursos NoSQL (MongoDB)
- **Carros**: marca, modelo, ano, cor, preço
- **Motos**: marca, modelo, ano, cilindrada, preço
- **Marcas de Roupa**: nome, país, ano de fundação, segmento, website

### Recursos SQL (PostgreSQL)
- **Usuários**: nome, email, senha (hash), role (admin/user)

Todos os recursos possuem operações completas de CRUD (Create, Read, Update, Delete) com validação de dados e tratamento de erros.

## 6. Autenticação e Autorização

- O registro cria um novo usuário com senha hasheada e retorna um token JWT.
- O login valida as credenciais e retorna um token JWT válido por 24 horas.
- Todas as rotas de CRUD (exceto auth) exigem o token JWT no header `Authorization: Bearer <token>`.
- O CRUD de usuários é restrito a usuários com role `admin`.
- Os CRUDs de carros, motos e marcas de roupa são acessíveis a qualquer usuário autenticado.

## 7. Testes de Integração

Os testes são escritos com Jest e Supertest, cobrindo todos os endpoints da API:
- Testes de registro e login (sucesso e falhas)
- Testes de CRUD para cada recurso (criação, leitura, atualização, exclusão)
- Testes de autorização (acesso sem token, acesso com role insuficiente)
- Testes de validação (dados inválidos retornando 422)
- Testes de recursos inexistentes (retornando 404)

## 8. Documentação da API (Swagger)

A documentação interativa da API está disponível em `http://localhost:3000/api-docs` (ou `http://localhost/api-docs` via frontend). Ela é gerada automaticamente a partir de anotações JSDoc no código e permite testar os endpoints diretamente pelo navegador.

## 9. Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados na máquina.

### Passos para Execução

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd "Projeto API com nodejs e frontend"
```

2. Configure as variáveis de ambiente (opcional — valores padrão já estão definidos):
```bash
cp .env.example .env
```

3. Suba todos os serviços com Docker Compose:
```bash
docker-compose up --build
```

4. Acesse a aplicação:
   - **Frontend**: http://localhost
   - **API Backend**: http://localhost:3000
   - **Swagger (Documentação)**: http://localhost/api-docs

5. Para rodar os testes de integração:
```bash
docker-compose run --rm backend npm test
```

6. Para parar os serviços:
```bash
docker-compose down
```

7. Para parar e remover volumes (limpar dados):
```bash
docker-compose down -v
```

### Portas Utilizadas

| Serviço | Porta |
|---------|-------|
| Frontend (Nginx) | 80 |
| Backend (Express) | 3000 |
| MongoDB | 27017 |
| PostgreSQL | 5432 |

## 10. Decisões Técnicas

- **Dois bancos de dados**: A escolha de usar MongoDB para recursos simples (carros, motos, marcas) e PostgreSQL para usuários demonstra a versatilidade do Node.js em trabalhar com diferentes paradigmas de persistência. O PostgreSQL foi escolhido para usuários por sua robustez em manter integridade referencial e transações ACID.
- **Nginx como proxy reverso**: O frontend é servido como build estática pelo Nginx, que também atua como proxy reverso para a API, eliminando problemas de CORS em produção e simplificando a arquitetura.
- **JWT stateless**: A autenticação via JWT foi escolhida por ser stateless, escalável e adequada para APIs RESTful.
- **Docker como fluxo principal**: Toda a aplicação é projetada para rodar via Docker Compose, garantindo reprodutibilidade e eliminando dependência de ambiente local.
- **Tailwind CSS v3**: Escolhido pela produtividade no desenvolvimento de interfaces responsivas e pela facilidade de manutenção com classes utilitárias.
