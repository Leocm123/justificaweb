import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const justificativas = await prisma.justificativa.findMany({
      orderBy: { ordem: "asc" },
    })
    return NextResponse.json(justificativas.map((j) => ({ id: j.id, texto: j.texto })))
  } catch {
    const justificativas = await prisma.justificativa.findMany({
      orderBy: { texto: "asc" },
    })
    return NextResponse.json(justificativas.map((j) => ({ id: j.id, texto: j.texto })))
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { texto } = body

  if (!texto?.trim()) {
    return NextResponse.json(
      { error: "texto é obrigatório" },
      { status: 400 }
    )
  }

  const maxOrdem = await prisma.justificativa.count()
  const justificativa = await prisma.justificativa.create({
    data: { texto: texto.trim().toUpperCase(), ordem: maxOrdem },
  })
  return NextResponse.json({ id: justificativa.id, texto: justificativa.texto })
}
