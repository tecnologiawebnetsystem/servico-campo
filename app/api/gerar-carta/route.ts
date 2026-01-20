import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { assunto, assuntoCustom } = await request.json()

    const tema = assuntoCustom || assunto

    if (!tema) {
      return NextResponse.json({ error: "Assunto é obrigatório" }, { status: 400 })
    }

    // Primeiro, gerar o título
    const tituloResponse = await generateText({
      model: "google/gemini-2.0-flash-001",
      prompt: `Crie um título curto e atraente (máximo 8 palavras) para uma carta sobre o tema: "${tema}". 
Retorne APENAS o título, sem aspas, sem explicações, sem pontuação final.`,
    })

    const titulo = tituloResponse.text.trim().replace(/^["']|["']$/g, "").replace(/\.$/, "")

    // Depois, gerar o texto da carta
    const textoResponse = await generateText({
      model: "google/gemini-2.0-flash-001",
      prompt: `Você é um assistente especializado em criar cartas de testemunho baseadas EXCLUSIVAMENTE em conteúdo do site jw.org (site oficial das Testemunhas de Jeová).

Crie uma carta sobre o tema: "${tema}"

REGRAS IMPORTANTES:
1. Use APENAS informações e ensinamentos encontrados em jw.org
2. Inclua versículos bíblicos relevantes ao tema (entre 2-3 versículos)
3. A carta deve ser respeitosa, amorosa e encorajadora
4. Comece com "Prezado(a) [nome]," ou similar
5. Termine com uma despedida amorosa e "[Seu nome]"
6. Tamanho: entre 200-350 palavras
7. Linguagem: português brasileiro, formal mas acessível

IMPORTANTE: Retorne APENAS o texto da carta, sem título, sem JSON, sem markdown, sem explicações adicionais. Apenas o corpo da carta pronto para uso.`,
    })

    // Limpar o texto removendo possíveis formatações indesejadas
    let texto = textoResponse.text.trim()
    
    // Remover possíveis marcações de código ou JSON que a IA possa ter adicionado
    texto = texto.replace(/^```[\w]*\n?/gm, "")
    texto = texto.replace(/```$/gm, "")
    texto = texto.replace(/^\{[\s\S]*"texto"\s*:\s*"/m, "")
    texto = texto.replace(/"\s*\}$/m, "")
    texto = texto.replace(/\\n/g, "\n")
    texto = texto.trim()

    return NextResponse.json({
      titulo: titulo || "Carta sobre " + tema,
      texto: texto,
      fonte: "Conteúdo baseado em pesquisas do site jw.org - Site oficial das Testemunhas de Jeová",
    })
  } catch (error) {
    console.error("Erro ao gerar carta:", error)
    return NextResponse.json({ error: "Erro ao gerar carta com IA" }, { status: 500 })
  }
}
