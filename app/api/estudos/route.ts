import { NextResponse } from "next/server"
import { getEstudoBiblico, updateEstudoBiblico } from "@/lib/neon-db"

interface EstudoBiblico {
  id: number
  usuario_id: number
  mes: number
  ano: number
  quantidade: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuarioId")
    const mes = searchParams.get("mes")
    const ano = searchParams.get("ano")

    if (!usuarioId || mes === null || ano === null) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
    }

    const quantidade = await getEstudoBiblico(Number(usuarioId), Number(mes), Number(ano))

    return NextResponse.json({ quantidade })
  } catch (error) {
    console.error("[v0] Erro ao buscar estudos:", error)
    return NextResponse.json({ error: "Erro ao buscar estudos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { usuarioId, mes, ano, quantidade } = await request.json()

    if (!usuarioId || mes === undefined || ano === undefined || quantidade === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    await updateEstudoBiblico(Number(usuarioId), Number(mes), Number(ano), Number(quantidade))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao atualizar estudos:", error)
    return NextResponse.json({ error: "Erro ao atualizar estudos" }, { status: 500 })
  }
}
