-- AlterTable (IF NOT EXISTS para ser idempotente caso a coluna já exista)
ALTER TABLE "Funcionario" ADD COLUMN IF NOT EXISTS "ordem" INTEGER NOT NULL DEFAULT 0;
