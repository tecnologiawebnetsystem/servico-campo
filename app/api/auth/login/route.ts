import { NextResponse } from "next/server"
import { loginUsuario } from "@/lib/neon-db"

export async function POST(request: Request) {
  try {
    const { pin } = await request.json()

    const usuario = await loginUsuario(pin)

    if (!usuario) {
      return NextResponse.json({ error: "PIN inválido" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
      },
    })
  } catch (error) {
    console.error("[v0] Erro no login:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
