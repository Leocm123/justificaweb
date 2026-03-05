import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const justificativas = await prisma.justificativa.findMany({
      orderBy: { ordem: "asc" },
    })
    return NextResponse.json(justificativas.map((j) => j.texto))
  } catch {
    // Fallback se a coluna ordem não existir
    const justificativas = await prisma.justificativa.findMany({
      orderBy: { texto: "asc" },
    })
    return NextResponse.json(justificativas.map((j) => j.texto))
  }
}
