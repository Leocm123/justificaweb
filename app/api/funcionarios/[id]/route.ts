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
  const { slug, nome } = body

  if (!nome?.trim()) {
    return NextResponse.json({ error: "nome é obrigatório" }, { status: 400 })
  }

  const slugNormalizado = slug
    ? slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : id

  try {
    const funcionario = await prisma.funcionario.update({
      where: { slug: id },
      data: { slug: slugNormalizado, nome: nome.trim() },
    })
    return NextResponse.json({ id: funcionario.slug, nome: funcionario.nome })
  } catch {
    return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
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
    await prisma.funcionario.delete({ where: { slug: id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
  }
}
