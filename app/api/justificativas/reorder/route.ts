import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { ids } = body as { ids: string[] }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids deve ser um array não vazio" }, { status: 400 })
  }

  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.justificativa.update({
          where: { id },
          data: { ordem: index },
        })
      )
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erro ao reordenar" }, { status: 500 })
  }
}
