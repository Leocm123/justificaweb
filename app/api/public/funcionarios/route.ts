import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      orderBy: { ordem: "asc" },
    })
    return NextResponse.json(
      funcionarios.map((f) => ({ id: f.slug, nome: f.nome }))
    )
  } catch {
    // Fallback se a coluna ordem ainda não existir (migration pendente)
    const funcionarios = await prisma.funcionario.findMany({
      orderBy: { nome: "asc" },
    })
    return NextResponse.json(
      funcionarios.map((f) => ({ id: f.slug, nome: f.nome }))
    )
  }
}
