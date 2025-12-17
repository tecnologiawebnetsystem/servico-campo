import { NextResponse } from "next/server"
import { getRegistroHoras, insertRegistroHoras, deleteRegistroHoras, updateRegistroHoras } from "@/lib/neon-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuarioId")
    const mes = searchParams.get("mes")
    const ano = searchParams.get("ano")

    if (!usuarioId || !mes || !ano) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
    }

    const registros = await getRegistroHoras(Number(usuarioId), Number(mes), Number(ano))

    // Transformar para o formato esperado pelo frontend
    const registrosFormatados = registros.map((r) => ({
      id: r.id,
      usuario_id: r.usuario_id,
      dia: new Date(r.data).getDate(),
      horas: r.quantidade_horas,
      modalidade: r.modalidade,
      mes: r.mes,
      ano: r.ano,
      data_registro: r.created_at,
    }))

    return NextResponse.json(registrosFormatados)
  } catch (error) {
    console.error("[v0] Erro ao buscar horas:", error)
    return NextResponse.json({ error: "Erro ao buscar registros" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { usuarioId, dia, horas, modalidade, mes, ano } = await request.json()

    if (!usuarioId || !dia || !horas || !modalidade || mes === undefined || ano === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Criar data no formato YYYY-MM-DD
    const data = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`

    const registro = await insertRegistroHoras(
      Number(usuarioId),
      data,
      Number(mes),
      Number(ano),
      Number(horas),
      modalidade,
    )

    return NextResponse.json({ success: true, id: registro.id })
  } catch (error) {
    console.error("[v0] Erro ao adicionar horas:", error)
    return NextResponse.json({ error: "Erro ao adicionar registro" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, usuarioId, dia, horas, modalidade, mes, ano } = await request.json()

    if (!id || !usuarioId || !dia || !horas || !modalidade || mes === undefined || ano === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Criar data no formato YYYY-MM-DD
    const data = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`

    const registro = await updateRegistroHoras(
      Number(id),
      Number(usuarioId),
      data,
      Number(mes),
      Number(ano),
      Number(horas),
      modalidade,
    )

    return NextResponse.json({ success: true, registro })
  } catch (error) {
    console.error("[v0] Erro ao editar horas:", error)
    return NextResponse.json({ error: "Erro ao editar registro" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const usuarioId = searchParams.get("usuarioId")

    if (!id || !usuarioId) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
    }

    await deleteRegistroHoras(Number(id), Number(usuarioId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao deletar horas:", error)
    return NextResponse.json({ error: "Erro ao deletar registro" }, { status: 500 })
  }
}
