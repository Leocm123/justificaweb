import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ensureFuncionarioOrdemColumn } from "@/lib/ensure-ordem-column"

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
    await ensureFuncionarioOrdemColumn()

    // Atualiza cada funcionário individualmente (mais robusto que transaction com array)
    for (let i = 0; i < ids.length; i++) {
      await prisma.funcionario.update({
        where: { slug: ids[i] },
        data: { ordem: i },
      })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Erro ao reordenar funcionários:", e)
    const msg = e instanceof Error ? e.message : "Erro ao reordenar"
    return NextResponse.json(
      { error: "Erro ao reordenar", details: msg },
      { status: 500 }
    )
  }
}
