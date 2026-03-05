import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { texto } = body

  if (!texto?.trim()) {
    return NextResponse.json({ error: "texto é obrigatório" }, { status: 400 })
  }

  try {
    const justificativa = await prisma.justificativa.update({
      where: { id },
      data: { texto: texto.trim().toUpperCase() },
    })
    return NextResponse.json({ id: justificativa.id, texto: justificativa.texto })
  } catch {
    return NextResponse.json({ error: "Justificativa não encontrada" }, { status: 404 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.justificativa.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Justificativa não encontrada" }, { status: 404 })
  }
}
