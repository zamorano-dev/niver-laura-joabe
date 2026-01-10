# Loja do Aniversário — Laura Ludovica & Joabe Lincoln

Marketplace de presentes de aniversário infantil com experiência estilo Amazon/Mercado Livre, compra redirecionada ao Mercado Pago e painel admin simples.

## Requisitos

- Node.js 18+
- NPM

## Configuração

Crie um arquivo `.env.local` na raiz com:

```
ADMIN_CPF=00000000000
ADMIN_PASSWORD=suasenha
SESSION_SECRET=uma-chave-opcional
```

## Rodar local

```
npm install
npm run dev
```

Acesse:

- Loja: http://localhost:3000
- Admin: http://localhost:3000/admin

## Mercado Pago

Cada produto possui um `paymentLink` fixo no Mercado Pago. Configure o link para retornar para:

```
/confirmacao?paid=true
```

A aplicação não processa pagamento, apenas simula a experiência.

## Produtos

Os produtos são armazenados em `src/data/products.json`. O painel admin grava diretamente nesse arquivo.

> Em deploy serverless (Vercel), escrita em arquivo pode não persistir. Para uso real, conecte um banco.
