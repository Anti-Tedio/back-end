# 🚀 Anti-Tédio | Backend API

> API que sustenta o ecossistema **Anti-Tédio** — sugestões inteligentes de entretenimento baseadas em perfil, localização e orçamento, com curadoria por IA e integrações a serviços de mídia e pagamentos.

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Runtime | [Bun](https://bun.sh/) |
| Framework | [Hono](https://hono.dev/) |
| ORM | [Prisma](https://www.prisma.io/) — MySQL |
| Cache / Sessão | Redis / Valkey |
| Inteligência Artificial | Gemini Pro API |
| Pagamentos | Stripe & Mercado Pago |
| E-mail | Resend |

---

## 📋 Pré-requisitos

- [Bun](https://bun.sh/) instalado
- Instância de **MySQL** ativa
- Instância de **Redis** ou **Valkey** ativa

---

## 🔧 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/anti-tedio-backend.git
cd anti-tedio-backend

# 2. Instale as dependências
bun install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves

# 4. Gere o cliente Prisma e rode as migrations
bunx prisma generate
bunx prisma migrate dev
```

---

## 🏃 Executando

```bash
bun dev
```

O servidor sobe em `http://localhost:3000` com hot-reload ativo.

---

## 🔌 Ecossistema de APIs Externas

| API | Função |
|---|---|
| **Google Gemini Pro** | Motor de IA — analisa o contexto do usuário e gera sugestões personalizadas |
| **OMDB API** | Metadados, capas e notas de filmes e séries |
| **Google Books API** | Detalhes e sinopses de livros |
| **IsThereAnyDeal API** | Preços e promoções de jogos dentro do orçamento do usuário |
| **Google Cloud Translation** | Entrega do conteúdo no idioma de preferência do usuário |
| **Resend** | Envio de e-mails transacionais |

---

## 🪝 Configuração de Webhooks

### 💳 Stripe

Para testes locais, utilize o **Stripe CLI**:

```bash
stripe listen --forward-to localhost:3000/payments/webhook/stripe
```

A chave gerada (`whsec_...`) deve ser definida na variável `STRIPE_WEBHOOK_SECRET`.

### 💙 Mercado Pago

O Mercado Pago exige uma URL pública. Use **Localtunnel** ou **Ngrok** para expor seu servidor localmente:

```bash
npx localtunnel --port 3000
```

Configure a URL gerada no [painel de desenvolvedor do Mercado Pago](https://www.mercadopago.com.br/developers).

---

## 📂 Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha todos os campos. Abaixo, a referência completa:

### ⚙️ Configuração da Aplicação

| Variável | Descrição |
|---|---|
| `FRONTEND_URL` | URL do frontend (ex: `http://localhost:5173`) |
| `BACKEND_URL` | URL do backend (ex: `http://localhost:3000`) |
| `NODE_ENV` | Ambiente de execução (`development` / `production`) |

### 🗄️ Banco de Dados

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão MySQL — formato: `mysql://USER:PASSWORD@HOST:PORT/DATABASE` |

### ⚡ Cache & Sessões

| Variável | Descrição |
|---|---|
| `REDIS_URL` | URL de conexão Redis (ex: `redis://localhost:6379`) |
| `VALKEY_URL` | URL de conexão Valkey (alternativa ao Redis) |

### 🔐 Autenticação

| Variável | Descrição |
|---|---|
| `JWT_ACCESS_SECRET` | Chave de assinatura para tokens de acesso (gere uma string longa e aleatória) |
| `JWT_REFRESH_SECRET` | Chave de assinatura para tokens de refresh |

### 🌐 APIs Externas

| Variável | Descrição |
|---|---|
| `OMDB_API_KEY` | Chave da OMDB API |
| `ISTHEREANYDEAL_API_KEY` | Chave da IsThereAnyDeal API |
| `GEMINI_API_KEY` | Chave da Google Gemini Pro API |
| `RESEND_API_KEY` | Chave da Resend para envio de e-mails |
| `GOOGLE_BOOK_KEY` | Chave da Google Books API |
| `GOOGLE_CLOUD_TRANSLATION` | Chave do Google Cloud Translation |

### 🔑 OAuth — Google

| Variável | Descrição |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID do OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Client Secret do OAuth Google |
| `GOOGLE_REDIRECT_URI` | URI de callback (ex: `http://localhost:3000/auth/google/callback`) |

### 🔑 OAuth — Facebook

| Variável | Descrição |
|---|---|
| `FACEBOOK_CLIENT_ID` | Client ID do OAuth Facebook |
| `FACEBOOK_CLIENT_SECRET` | Client Secret do OAuth Facebook |
| `FACEBOOK_REDIRECT_URI` | URI de callback (ex: `http://localhost:3000/auth/facebook/callback`) |

### 💳 Pagamentos

| Variável | Descrição |
|---|---|
| `STRIPE_SECRET_KEY` | Chave privada Stripe para pagamentos internacionais |
| `STRIPE_WEBHOOK_SECRET` | Segredo de verificação de webhooks Stripe (`whsec_...`) |
| `MP_ACCESS_TOKEN` | Token de acesso Mercado Pago para pagamentos nacionais |
| `MP_PUBLIC_KEY` | Chave pública Mercado Pago |

---

## 🔒 Segurança

- **Validação** — todas as entradas de dados sensíveis são tipadas e validadas antes do processamento.
- **Autenticação** — sistema híbrido com OAuth 2.0 (Google e Facebook) e JWT para sessões seguras.
- **Variáveis de ambiente** — o arquivo `.env` **nunca** deve ser enviado ao controle de versão. Certifique-se de que ele está listado no `.gitignore`.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

© 2026 Anti Tédio. Distribuído sob a licença MIT.# back-end
