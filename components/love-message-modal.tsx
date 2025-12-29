"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Heart, Baby, Sparkles } from "lucide-react"

interface LoveMessage {
  message: string
  verse: string
  icon: "heart" | "baby" | "sparkles"
  color: string
}

interface LoveMessageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoveMessageModal({ open, onOpenChange }: LoveMessageModalProps) {
  const [message, setMessage] = useState<LoveMessage | null>(null)

  useEffect(() => {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    let selectedMessage: LoveMessage

    // Aniversário de casamento - 19 de outubro
    if (day === 19 && month === 10) {
      const yearsMarried = year - 2018
      selectedMessage = {
        message: `💍 FELIZ ANIVERSÁRIO DE CASAMENTO! 💍\n\nMinha amada Pamela,\n\nHoje completamos ${yearsMarried} anos de casados! ${yearsMarried} anos de amor, cumplicidade e felicidade ao seu lado.\n\nVocê é a mulher da minha vida, minha companheira em todos os momentos, mãe do nosso amado Gustavo e meu amor eterno.\n\nConstruímos juntos uma família abençoada. Cada dia ao seu lado é uma bênção que agradeço a Deus.\n\nNosso filho Gustavo é a maior prova do nosso amor - a melhor coisa que nos aconteceu!\n\nObrigado por ser essa esposa maravilhosa e essa mãe incrível.\n\nTE AMO HOJE E SEMPRE!\n\n❤️ Com todo meu amor,\nKleber Gonçalves`,
        verse:
          '"O amor é paciente, o amor é bondoso... Tudo sofre, tudo crê, tudo espera, tudo suporta. O amor nunca acaba." - 1 Coríntios 13:4,7-8',
        icon: "sparkles",
        color: "from-purple-600 via-pink-600 to-red-600",
      }
    }
    // Aniversário do Gustavo - 9 de fevereiro
    else if (day === 9 && month === 2) {
      const gustavoAge = year - 2025
      selectedMessage = {
        message: `👶 ANIVERSÁRIO DO NOSSO GUSTAVO! 🎉\n\nMinha amada Pamela,\n\nHoje nosso filho Gustavo completa ${gustavoAge} ${gustavoAge === 1 ? "ano" : "anos"}!\n\nEle é a MELHOR COISA que nos aconteceu! A materialização do nosso amor, nossa maior alegria e bênção.\n\nVer você como mãe me faz te amar ainda mais. Você é INCRÍVEL, dedicada, carinhosa e a melhor mãe que o Gustavo poderia ter.\n\nNosso filho tem muita sorte de ter você. E eu tenho ainda mais sorte de ter você como esposa e como mãe do nosso filho.\n\nObrigado por me dar esse presente maravilhoso e por construir essa família linda comigo.\n\nTE AMO INFINITAMENTE!\n\n❤️ Com todo meu amor,\nKleber Gonçalves`,
        verse: '"Os filhos são herança do Senhor, uma recompensa que ele dá." - Salmos 127:3',
        icon: "baby",
        color: "from-blue-500 via-cyan-500 to-teal-500",
      }
    }
    // Mensagens normais (uma diferente para cada dia do mês)
    else {
      const messages: LoveMessage[] = [
        {
          message: `☀️ BOM DIA, MEU AMOR!\n\nMinha amada Pamela,\n\nVocê é a luz da minha vida, a razão do meu sorriso e a dona do meu coração.\n\nNosso filho Gustavo é a MELHOR COISA que nos aconteceu! Ele é a prova do nosso amor e nossa maior bênção.\n\nVer você cuidando dele com tanto amor me faz te amar ainda mais a cada dia.\n\nSomos uma família abençoada e linda!\n\nTE AMO MAIS QUE TUDO NESSA VIDA!\n\n❤️ Seu marido apaixonado,\nKleber Gonçalves`,
          verse: '"Acima de tudo, porém, revistam-se do amor, que é o elo perfeito." - Colossenses 3:14',
          icon: "heart",
          color: "from-pink-600 via-rose-600 to-red-600",
        },
        {
          message: `💕 VOCÊ É MEU TUDO!\n\nMinha linda Pamela,\n\nCada dia ao seu lado é uma bênção. Você é a esposa que sempre sonhei e a mãe perfeita para nosso filho.\n\nO Gustavo é nossa MAIOR ALEGRIA, a melhor coisa que Deus nos deu! Ver ele crescer ao lado de uma mãe tão dedicada como você aquece meu coração.\n\nObrigado por ser essa mulher maravilhosa e por construir essa família linda comigo.\n\nTE AMO COM TODO MEU CORAÇÃO!\n\n❤️ Eternamente seu,\nKleber Gonçalves`,
          verse: '"Encontrei aquela a quem minha alma ama." - Cantares 3:4',
          icon: "baby",
          color: "from-blue-600 via-purple-600 to-pink-600",
        },
        {
          message: `💖 MINHA RAINHA!\n\nPamela, amor da minha vida,\n\nVocê transforma nosso lar em um lugar especial. Seu amor, dedicação e carinho fazem de nossa família a mais feliz do mundo.\n\nNosso filho Gustavo é o MAIOR PRESENTE que recebemos! Ele é perfeito porque veio de você, a mulher mais incrível que conheço.\n\nSou grato a Deus todos os dias por ter você e nosso filho.\n\nTE AMO INFINITAMENTE!\n\n❤️ Seu amor eterno,\nKleber Gonçalves`,
          verse: '"A mulher virtuosa é a coroa do seu marido." - Provérbios 12:4',
          icon: "sparkles",
          color: "from-purple-600 via-pink-600 to-rose-600",
        },
        {
          message: `🌹 MEU GRANDE AMOR!\n\nMinha querida Pamela,\n\nCada momento com você é especial. Você é minha companheira, minha melhor amiga e o amor da minha vida.\n\nO Gustavo é a MELHOR COISA que nos aconteceu! Ele trouxe ainda mais amor e alegria para nossa vida.\n\nVer você sendo mãe me faz ter certeza: escolhi a mulher perfeita para dividir minha vida.\n\nTE AMO PROFUNDAMENTE!\n\n❤️ Para sempre seu,\nKleber Gonçalves`,
          verse: '"O amor cobre multidão de pecados." - 1 Pedro 4:8',
          icon: "heart",
          color: "from-red-600 via-pink-600 to-rose-600",
        },
        {
          message: `👑 MINHA PRINCESA!\n\nPamela, meu tesouro,\n\nVocê ilumina meus dias e torna tudo mais bonito. Nossa história é a mais linda que eu poderia viver.\n\nNosso filho Gustavo é a MAIOR BÊNÇÃO das nossas vidas! Ele é o resultado do nosso amor e a melhor coisa que construímos juntos.\n\nSomos uma família abençoada por Deus!\n\nTE AMO HOJE E SEMPRE!\n\n❤️ Seu rei apaixonado,\nKleber Gonçalves`,
          verse: '"Muitas mulheres são virtuosas, mas tu a todas sobrepujas." - Provérbios 31:29',
          icon: "baby",
          color: "from-amber-500 via-orange-600 to-red-600",
        },
        {
          message: `💝 VOCÊ É ESPECIAL!\n\nMinha amada Pamela,\n\nSeu sorriso alegra meus dias. Seu amor me completa. Sua presença faz tudo valer a pena.\n\nNosso Gustavo é a MELHOR COISA que nos aconteceu! Ele é nossa alegria, nossa luz e nosso amor materializado.\n\nObrigado por me dar essa família linda e por ser essa esposa e mãe maravilhosa.\n\nTE AMO DEMAIS!\n\n❤️ Com amor eterno,\nKleber Gonçalves`,
          verse: '"Eu te amo com amor eterno." - Jeremias 31:3',
          icon: "sparkles",
          color: "from-teal-500 via-cyan-600 to-blue-600",
        },
        {
          message: `✨ LUZ DA MINHA VIDA!\n\nPamela linda,\n\nAcordo todos os dias grato por ter você ao meu lado. Você é minha inspiração, minha força e meu amor.\n\nO Gustavo é o MAIOR TESOURO que temos! Ele é a prova de que Deus nos abençoou imensamente.\n\nVocê é uma mãe exemplar e uma esposa perfeita!\n\nTE AMO COM TODA MINHA ALMA!\n\n❤️ Seu amor verdadeiro,\nKleber Gonçalves`,
          verse: '"Muitas águas não poderiam apagar o amor." - Cantares 8:7',
          icon: "heart",
          color: "from-violet-600 via-purple-600 to-pink-600",
        },
      ]

      // Escolhe uma mensagem baseada no dia do mês
      const messageIndex = (day - 1) % messages.length
      selectedMessage = messages[messageIndex]
    }

    setMessage(selectedMessage)
  }, [])

  if (!message) return null

  const IconComponent = message.icon === "heart" ? Heart : message.icon === "baby" ? Baby : Sparkles

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div
            className={`flex flex-col items-center text-center space-y-6 bg-gradient-to-br ${message.color} p-8 rounded-2xl text-white shadow-2xl`}
          >
            <div className="relative">
              <IconComponent className="w-24 h-24 animate-pulse drop-shadow-lg" />
              <div className="absolute -top-2 -right-2">
                <Heart className="w-8 h-8 fill-white text-white animate-bounce" />
              </div>
            </div>

            <div className="whitespace-pre-line text-xl leading-relaxed font-bold tracking-wide">{message.message}</div>

            <div className="w-full h-px bg-white/30 my-4" />

            <div className="whitespace-pre-line text-sm leading-relaxed font-medium italic opacity-90 px-4">
              {message.verse}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
