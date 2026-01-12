# Loja do Aniversário — Laura Ludovica & Joabe Lincoln

Marketplace de presentes de aniversário infantil com experiência estilo Amazon/Mercado Livre, parcelamentos inclusos e painel admin simples.

## Requisitos

- Node.js 18+
- NPM

## Configuração

Crie um arquivo `.env.local` na raiz com:

```
ADMIN_CPF=00000000000
ADMIN_PASSWORD=suasenha
SESSION_SECRET=uma-chave-opcional
# Preferencial: Vercel Redis
REDIS_URL=
# Opcional: Vercel KV para persistencia em producao
KV_REST_API_URL=
KV_REST_API_TOKEN=
STORAGE_NAMESPACE=niver-j-l
```

## Rodar local

```
npm install
npm run dev
```

Acesse:

- Loja: http://localhost:3000
- Admin: http://localhost:3000/admin

## Links externos

Cada produto possui um `paymentLink` fixo para um link externo. Configure o link para retornar para:

```
/confirmacao?paid=true
```

A aplicação apenas exibe presentes com parcelamentos inclusos e redireciona para um link externo.


## Produtos

Localmente os produtos sao armazenados em `src/data/products.json`. Em producao, se `REDIS_URL` estiver configurado, os dados sao gravados no Vercel Redis. Caso contrario, se `KV_REST_API_URL` e `KV_REST_API_TOKEN` estiverem configurados, os dados vao para o Vercel KV.
# niver-laura-joabe
# niver-laura-joabe
