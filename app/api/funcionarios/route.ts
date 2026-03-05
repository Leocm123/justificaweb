import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ensureFuncionarioOrdemColumn } from "@/lib/ensure-ordem-column"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

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

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { slug, nome } = body

  if (!slug?.trim() || !nome?.trim()) {
    return NextResponse.json(
      { error: "slug e nome são obrigatórios" },
      { status: 400 }
    )
  }

  const slugNormalizado = slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

  try {
    await ensureFuncionarioOrdemColumn()
    const maxOrdem = await prisma.funcionario.count()
    const funcionario = await prisma.funcionario.create({
      data: { slug: slugNormalizado, nome: nome.trim(), ordem: maxOrdem },
    })
    return NextResponse.json({ id: funcionario.slug, nome: funcionario.nome })
  } catch (e: unknown) {
    const isUniqueError =
      e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002"
    if (isUniqueError) {
      return NextResponse.json(
        { error: "Funcionário já existe com este slug" },
        { status: 409 }
      )
    }
    console.error("Erro ao criar funcionário:", e)
    return NextResponse.json(
      { error: "Erro ao criar funcionário. Tente novamente." },
      { status: 500 }
    )
  }
}
