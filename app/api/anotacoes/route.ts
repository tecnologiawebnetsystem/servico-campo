import { type NextRequest, NextResponse } from "next/server"
import { getAnotacoes, insertAnotacao, deleteAnotacao } from "@/lib/neon-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuarioId")

    if (!usuarioId) {
      return NextResponse.json({ error: "usuarioId é obrigatório" }, { status: 400 })
    }

    const anotacoes = await getAnotacoes(Number.parseInt(usuarioId))

    return NextResponse.json(anotacoes)
  } catch (error) {
    console.error("Erro ao buscar anotações:", error)
    return NextResponse.json({ error: "Erro ao buscar anotações" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, titulo, descricao } = body

    if (!usuarioId || !titulo || !descricao) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const anotacao = await insertAnotacao(usuarioId, titulo, descricao)

    return NextResponse.json(anotacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar anotação:", error)
    return NextResponse.json({ error: "Erro ao criar anotação" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const usuarioId = searchParams.get("usuarioId")

    if (!id || !usuarioId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    await deleteAnotacao(Number.parseInt(id), Number.parseInt(usuarioId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar anotação:", error)
    return NextResponse.json({ error: "Erro ao deletar anotação" }, { status: 500 })
  }
}
