import { PrismaClient } from "@prisma/client"
import { prisma } from "@/lib/prisma"

const ALTER_SQL =
  'ALTER TABLE "Funcionario" ADD COLUMN IF NOT EXISTS "ordem" INTEGER NOT NULL DEFAULT 0'

/**
 * Garante que a coluna ordem existe na tabela Funcionario.
 * Tenta primeiro com o client principal; se falhar (ex: Neon pooled), tenta com DIRECT_URL.
 */
export async function ensureFuncionarioOrdemColumn() {
  try {
    await prisma.$executeRawUnsafe(ALTER_SQL)
    return
  } catch {
    // Ignorar - pode ser que a coluna já exista ou DDL não permitido na conexão pooled
  }

  const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!directUrl) return

  const prismaDirect = new PrismaClient({ datasources: { db: { url: directUrl } } })
  try {
    await prismaDirect.$executeRawUnsafe(ALTER_SQL)
  } catch (e) {
    console.warn("ensureFuncionarioOrdemColumn:", e)
  } finally {
    await prismaDirect.$disconnect()
  }
}
