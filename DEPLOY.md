# Deploy na Vercel

## Guia rápido (primeira vez)

1. **Crie o projeto na Vercel**  
   Acesse [vercel.com](https://vercel.com) → New Project → Import do seu repositório Git (GitHub, GitLab, Bitbucket).

2. **Configure as variáveis de ambiente** (Settings → Environment Variables):

   | Variável       | Valor                          |
   |----------------|--------------------------------|
   | `DATABASE_URL` | URL **pooled** do Neon         |
   | `DIRECT_URL`   | URL **direta** do Neon         |
   | `AUTH_SECRET`  | `openssl rand -base64 32`      |
   | `ADMIN_EMAIL`  | Seu email para login no admin  |
   | `ADMIN_PASSWORD` | Senha (mín. 8 caracteres)   |

3. **Deploy**  
   O deploy roda automaticamente. As migrations são aplicadas durante o build.

4. **Seed (primeira vez)**  
   Após o primeiro deploy, rode o seed para popular o banco:

   ```bash
   vercel env pull .env.local   # baixa as variáveis do projeto Vercel
   npm run db:seed              # popula funcionários, justificativas e admin
   ```

   O seed usa `.env.local` automaticamente. Ou use o **Neon SQL Editor** para rodar o schema manualmente.

---

## Desenvolvimento local

Antes de rodar localmente, crie um banco PostgreSQL gratuito no [Neon](https://neon.tech). Copie as URLs e configure no `.env`:

```
DATABASE_URL="postgresql://...?sslmode=require"
DIRECT_URL="postgresql://...?sslmode=require"
```

Depois rode as migrations e o seed:

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev
```

### Se as migrations falharem (histórico inconsistente)

Se aparecer erro como "Could not find migration file" ou "20260305181822_init" (migration inexistente), o histórico do banco está desatualizado. Resete o banco local:

```bash
npm run db:reset
```

Isso apaga todos os dados e reaplica as migrations do zero (o seed roda automaticamente após o reset). No deploy, o banco de produção será novo e as migrations aplicarão corretamente.

---

## 1. Banco de dados (Neon - gratuito)

Para o banco funcionar na Vercel, use um PostgreSQL hospedado:

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto
3. No dashboard, copie as **Connection strings**:
   - **Pooled connection** → use para `DATABASE_URL`
   - **Direct connection** → use para `DIRECT_URL`

## 2. Variáveis de ambiente na Vercel

No seu projeto na Vercel, vá em **Settings → Environment Variables** e adicione:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | URL pooled do Neon |
| `DIRECT_URL` | URL direta do Neon |
| `AUTH_SECRET` | Gere com `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Seu email de admin |
| `ADMIN_PASSWORD` | Senha (mínimo 8 caracteres) |

`NEXTAUTH_URL` e `AUTH_URL` são preenchidos automaticamente pela Vercel em produção.

## 3. Migrations e seed

- **Migrations**: rodam automaticamente durante o build (`prisma migrate deploy`).
- **Seed**: rode manualmente após o primeiro deploy (veja Guia rápido acima).

## 4. Deploy

Faça push para o repositório conectado à Vercel. O deploy será automático a cada push.

## Alternativa: Supabase

Se preferir Supabase em vez de Neon:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Em **Settings → Database**, copie a **Connection string** (URI)
3. Use a mesma URL para `DATABASE_URL` e `DIRECT_URL`
4. Para o modo pooler, use a porta 6543 em vez de 5432

---

## Checklist antes do deploy

- [ ] `.env` com `DATABASE_URL` e `DIRECT_URL` (Neon/Supabase)
- [ ] `AUTH_SECRET` gerado (`openssl rand -base64 32`)
- [ ] `ADMIN_EMAIL` e `ADMIN_PASSWORD` definidos
- [ ] Migrations aplicadas (`npx prisma migrate deploy`)
- [ ] Seed executado (`npm run db:seed`) — na primeira vez
- [ ] Build local OK (`npm run build`)
