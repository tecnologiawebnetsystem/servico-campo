import { type NextRequest, NextResponse } from "next/server"
import { getCartas, insertCarta, deleteCarta, updateCarta } from "@/lib/neon-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = Number.parseInt(searchParams.get("usuarioId") || "0")

    if (!usuarioId) {
      return NextResponse.json({ error: "usuarioId é obrigatório" }, { status: 400 })
    }

    const cartas = await getCartas(usuarioId)
    return NextResponse.json(cartas)
  } catch (error) {
    console.error("Erro ao buscar cartas:", error)
    return NextResponse.json({ error: "Erro ao buscar cartas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { usuarioId, titulo, texto } = await request.json()

    if (!usuarioId || !titulo || !texto) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const carta = await insertCarta(usuarioId, titulo, texto)
    return NextResponse.json(carta)
  } catch (error) {
    console.error("Erro ao criar carta:", error)
    return NextResponse.json({ error: "Erro ao criar carta" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, usuarioId, titulo, texto } = await request.json()

    if (!id || !usuarioId || !titulo || !texto) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const carta = await updateCarta(id, usuarioId, titulo, texto)
    return NextResponse.json(carta)
  } catch (error) {
    console.error("Erro ao atualizar carta:", error)
    return NextResponse.json({ error: "Erro ao atualizar carta" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")
    const usuarioId = Number.parseInt(searchParams.get("usuarioId") || "0")

    if (!id || !usuarioId) {
      return NextResponse.json({ error: "id e usuarioId são obrigatórios" }, { status: 400 })
    }

    await deleteCarta(id, usuarioId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar carta:", error)
    return NextResponse.json({ error: "Erro ao deletar carta" }, { status: 500 })
  }
}
