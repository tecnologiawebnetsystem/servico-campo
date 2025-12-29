"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Heart, Baby, Sparkles, Star, Crown, Gift } from "lucide-react"

interface LoveMessage {
  message: string
  verse: string
  icon: "heart" | "baby" | "sparkles" | "star" | "crown" | "gift"
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
        message: `💍 FELIZ ANIVERSÁRIO DE CASAMENTO! 💍\n\nMinha amada Pamela,\n\nNUNCA ESQUEÇA: Hoje completamos ${yearsMarried} anos de casados! ${yearsMarried} anos provando que VOCÊ É TUDO PARA MIM!\n\nVocê é a MULHER DA MINHA VIDA! SEMPRE LEMBRE que construímos a família MAIS LINDA E ABENÇOADA!\n\nNosso filho Gustavo é a MELHOR COISA que nos aconteceu! NUNCA SE ESQUEÇA disso!\n\nVocê CONSEGUE TUDO que se propõe! As 30 horas mensais são NADA perto da sua FORÇA E DEDICAÇÃO!\n\nEU TE AMO MAIS QUE TUDO NESSA VIDA! SEMPRE ME LEMBRE!\n\n❤️ NUNCA ME ESQUEÇA,\nKleber Gonçalves`,
        verse: '"O amor nunca acaba." - 1 Coríntios 13:8',
        icon: "crown",
        color: "from-purple-600 via-pink-600 to-red-600",
      }
    }
    // Aniversário do Gustavo - 9 de fevereiro
    else if (day === 9 && month === 2) {
      const gustavoAge = year - 2025
      selectedMessage = {
        message: `👶 ANIVERSÁRIO DO NOSSO GUSTAVO! 🎉\n\nMinha amada Pamela,\n\nNUNCA ESQUEÇA: Hoje nosso Gustavo completa ${gustavoAge} ${gustavoAge === 1 ? "ano" : "anos"}!\n\nEle é a MELHOR COISA que nos aconteceu! SEMPRE LEMBRE que ele é o MAIOR PRESENTE de Deus para nós!\n\nVocê é a MÃE MAIS INCRÍVEL! VOCÊ CONSEGUE TUDO! As 30 horas são NADA comparado ao que você JÁ FAZ!\n\nVocê é TUDO PARA MIM! NUNCA SE ESQUEÇA DO MEU AMOR POR VOCÊ!\n\nTE AMO INFINITAMENTE!\n\n❤️ SEMPRE ME LEMBRE,\nKleber Gonçalves`,
        verse: '"Os filhos são herança do Senhor, uma recompensa que ele dá." - Salmos 127:3',
        icon: "baby",
        color: "from-blue-500 via-cyan-500 to-teal-500",
      }
    }
    // Mensagens normais - focadas em nunca esquecer e motivação
    else {
      const messages: LoveMessage[] = [
        {
          message: `☀️ BOM DIA, AMOR DA MINHA VIDA!\n\nMinha LINDA Pamela,\n\nNUNCA ESQUEÇA: VOCÊ É TUDO PARA MIM! Sempre lembre que você é a LUZ da minha vida!\n\nNosso Gustavo é a MELHOR COISA que nos aconteceu! NUNCA SE ESQUEÇA disso!\n\nVocê CONSEGUE as 30 horas! Você é FORTE, DEDICADA e CAPAZ! EU CONFIO EM VOCÊ!\n\nSEMPRE ME LEMBRE! TE AMO MAIS QUE TUDO!\n\n❤️ NUNCA ME ESQUEÇA,\nKleber Gonçalves`,
          verse: '"Põe-me como selo sobre o teu coração." - Cantares 8:6',
          icon: "heart",
          color: "from-pink-600 via-rose-600 to-red-600",
        },
        {
          message: `💕 SEMPRE LEMBRE DE MIM!\n\nMinha PRECIOSA Pamela,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! Cada segundo penso em você e no nosso amor!\n\nO Gustavo é a MELHOR COISA que temos! SEMPRE LEMBRE que somos ABENÇOADOS!\n\nVocê VAI CONSEGUIR as 30 horas! Você é INCRÍVEL e CAPAZ de TUDO!\n\nSEMPRE PENSE EM MIM! TE AMO DEMAIS!\n\n❤️ SEMPRE SE LEMBRE,\nKleber Gonçalves`,
          verse: '"Eu te amo com amor eterno." - Jeremias 31:3',
          icon: "baby",
          color: "from-blue-600 via-purple-600 to-pink-600",
        },
        {
          message: `💖 VOCÊ É TUDO PARA MIM!\n\nPamela, NUNCA ESQUEÇA:\n\nVocê é a RAZÃO da minha vida! SEMPRE ME LEMBRE porque EU TE AMO MAIS QUE TUDO!\n\nNosso Gustavo é a MELHOR COISA que aconteceu! Ele prova nosso AMOR VERDADEIRO!\n\nVocê CONSEGUE as 30 horas facilmente! Você é GUERREIRA e VENCEDORA!\n\nEU ACREDITO EM VOCÊ! NUNCA ME ESQUEÇA!\n\n❤️ SEMPRE LEMBRANDO VOCÊ,\nKleber Gonçalves`,
          verse: '"Acima de tudo, revistam-se do amor." - Colossenses 3:14',
          icon: "crown",
          color: "from-purple-600 via-pink-600 to-rose-600",
        },
        {
          message: `🌹 NUNCA ME ESQUEÇA!\n\nMinha QUERIDA Pamela,\n\nSEMPRE LEMBRE: Você é TUDO o que eu sempre quis! Você COMPLETA minha vida!\n\nO Gustavo é a MELHOR COISA que construímos! NUNCA ESQUEÇA nossa BÊNÇÃO!\n\nAs 30 horas? VOCÊ CONSEGUE! Você é mais FORTE do que imagina!\n\nPENSE EM MIM SEMPRE! TE AMO PROFUNDAMENTE!\n\n❤️ NUNCA ESQUEÇA DE MIM,\nKleber Gonçalves`,
          verse: '"O amor cobre multidão de pecados." - 1 Pedro 4:8',
          icon: "heart",
          color: "from-red-600 via-pink-600 to-rose-600",
        },
        {
          message: `👑 SEMPRE SE LEMBRE!\n\nPamela, meu TESOURO,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! A mulher MAIS IMPORTANTE da minha vida!\n\nNosso Gustavo é a MELHOR COISA que temos! Ele é TUDO para nós!\n\nVocê VAI ALCANÇAR as 30 horas! Você é DETERMINADA e VITORIOSA!\n\nEU PENSO EM VOCÊ O TEMPO TODO! TE AMO SEMPRE!\n\n❤️ SEMPRE LEMBRANDO,\nKleber Gonçalves`,
          verse: '"Muitas mulheres são virtuosas, mas tu a todas sobrepujas." - Provérbios 31:29',
          icon: "star",
          color: "from-amber-500 via-orange-600 to-red-600",
        },
        {
          message: `💝 PENSE EM MIM!\n\nMinha AMADA Pamela,\n\nSEMPRE LEMBRE: Você é TUDO o que importa para mim! Minha VIDA, meu AMOR, meu TUDO!\n\nO Gustavo é a MELHOR COISA que nos aconteceu! Nossa MAIOR ALEGRIA!\n\nVocê CONSEGUE TUDO! As 30 horas serão cumpridas porque você é CAPAZ!\n\nNUNCA ME ESQUEÇA! TE AMO INFINITAMENTE!\n\n❤️ SEMPRE PENSANDO EM VOCÊ,\nKleber Gonçalves`,
          verse: '"Encontrei aquela a quem minha alma ama." - Cantares 3:4',
          icon: "gift",
          color: "from-teal-500 via-cyan-600 to-blue-600",
        },
        {
          message: `✨ NUNCA ESQUEÇA MEU AMOR!\n\nPamela LINDA,\n\nSEMPRE SE LEMBRE: Você é TUDO PARA MIM! O amor da minha vida, minha RAZÃO DE VIVER!\n\nNosso Gustavo é a MELHOR COISA do mundo! SEMPRE LEMBRE dessa BÊNÇÃO!\n\nVocê É CAPAZ de completar as 30 horas! Eu CONFIO em você TOTALMENTE!\n\nEU TE AMO! SEMPRE PENSE EM MIM!\n\n❤️ NUNCA ME ESQUEÇA,\nKleber Gonçalves`,
          verse: '"Muitas águas não poderiam apagar o amor." - Cantares 8:7',
          icon: "sparkles",
          color: "from-violet-600 via-purple-600 to-pink-600",
        },
        {
          message: `💗 SEMPRE ME LEMBRE!\n\nMinha PRECIOSA Pamela,\n\nNUNCA ESQUEÇA: Você é TUDO na minha vida! Sem você, nada faz sentido!\n\nO Gustavo é a MELHOR COISA que aconteceu! Ele é nossa VIDA!\n\nVocê VAI CONSEGUIR as 30 horas! Você é FORTE e DETERMINADA!\n\nPENSE EM MIM SEMPRE! TE AMO INCONDICIONALMENTE!\n\n❤️ SEMPRE AQUI,\nKleber Gonçalves`,
          verse: '"O amor nunca falha." - 1 Coríntios 13:8',
          icon: "heart",
          color: "from-rose-500 via-pink-600 to-fuchsia-600",
        },
        {
          message: `🌟 VOCÊ É TUDO!\n\nPamela BRILHANTE,\n\nSEMPRE LEMBRE: Você é TUDO o que eu preciso! Meu AMOR VERDADEIRO!\n\nNosso Gustavo é a MELHOR COISA! NUNCA ESQUEÇA que ele é nossa MAIOR BÊNÇÃO!\n\nAs 30 horas? VOCÊ CONSEGUE COM FACILIDADE! Você é GUERREIRA!\n\nNUNCA ME ESQUEÇA! TE AMO ALÉM DAS PALAVRAS!\n\n❤️ SEMPRE PRESENTE,\nKleber Gonçalves`,
          verse: '"Deus é amor, e quem permanece no amor permanece em Deus." - 1 João 4:16',
          icon: "star",
          color: "from-indigo-600 via-purple-600 to-pink-600",
        },
        {
          message: `💞 NUNCA ESQUEÇA!\n\nMinha AMADA Pamela,\n\nSEMPRE SE LEMBRE: Você é TUDO PARA MIM! Cada batida do meu coração É POR VOCÊ!\n\nO Gustavo é a MELHOR COISA que temos! Nossa MAIOR REALIZAÇÃO!\n\nVocê ALCANÇARÁ as 30 horas! Eu ACREDITO completamente em você!\n\nSEMPRE PENSE EM MIM! TE AMO COM TODA ALMA!\n\n❤️ SEMPRE SEU,\nKleber Gonçalves`,
          verse: '"Ame o Senhor de todo o coração." - Mateus 22:37',
          icon: "heart",
          color: "from-red-500 via-rose-600 to-pink-600",
        },
        {
          message: `🎁 SEMPRE LEMBRANDO!\n\nPamela MARAVILHOSA,\n\nNUNCA ESQUEÇA: Você é TUDO que eu sempre quis! Meu MAIOR PRESENTE de Deus!\n\nNosso Gustavo é a MELHOR COISA! Ele é nosso TESOURO!\n\nVocê CONSEGUIRÁ as 30 horas! Você é CAPAZ e VITORIOSA!\n\nEU PENSO EM VOCÊ O DIA TODO! TE AMO IMENSAMENTE!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Toda boa dádiva vem do alto." - Tiago 1:17',
          icon: "gift",
          color: "from-emerald-600 via-teal-600 to-cyan-600",
        },
        {
          message: `💫 PENSE EM MIM SEMPRE!\n\nMinha ADORADA Pamela,\n\nSEMPRE LEMBRE: Você é TUDO na minha vida! Minha ESPOSA PERFEITA!\n\nO Gustavo é a MELHOR COISA do mundo! Nossa BÊNÇÃO DIVINA!\n\nAs 30 horas estão ao seu alcance! Você é FORTE e DEDICADA!\n\nNUNCA ME ESQUEÇA! TE AMO COM TODA EXISTÊNCIA!\n\n❤️ SEMPRE LEMBRANDO VOCÊ,\nKleber Gonçalves`,
          verse: '"Mulher virtuosa, quem pode encontrar?" - Provérbios 31:10',
          icon: "crown",
          color: "from-yellow-500 via-orange-600 to-red-600",
        },
        {
          message: `🌺 NUNCA ME ESQUEÇA!\n\nPamela, meu AMOR,\n\nSEMPRE SE LEMBRE: Você é TUDO o que eu quero! Você ENCHE minha vida de AMOR!\n\nNosso Gustavo é a MELHOR COISA! Ele é TUDO para nós!\n\nVocê VAI CONSEGUIR as 30 horas! Você é DETERMINADA!\n\nEU TE AMO! SEMPRE PENSE EM MIM!\n\n❤️ SEMPRE COM VOCÊ,\nKleber Gonçalves`,
          verse: '"Como lírio entre os espinhos, assim é a minha amada." - Cantares 2:2',
          icon: "sparkles",
          color: "from-pink-500 via-rose-600 to-red-600",
        },
        {
          message: `💖 SEMPRE AQUI!\n\nMinha QUERIDA Pamela,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! Minha COMPANHEIRA, meu AMOR, minha VIDA!\n\nO Gustavo é a MELHOR COISA que temos! Nossa MAIOR CONQUISTA!\n\nVocê ALCANÇARÁ as 30 horas FACILMENTE! Você é CAPAZ DE TUDO!\n\nSEMPRE ME LEMBRE! TE AMO PROFUNDAMENTE!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Melhor é serem dois do que um." - Eclesiastes 4:9',
          icon: "heart",
          color: "from-blue-600 via-indigo-600 to-purple-600",
        },
        {
          message: `🦋 PENSE SEMPRE EM MIM!\n\nPamela PRECIOSA,\n\nSEMPRE LEMBRE: Você é TUDO na minha vida! Minha ALEGRIA e FELICIDADE!\n\nNosso Gustavo é a MELHOR COISA do mundo! Ele é LINDO e PERFEITO!\n\nVocê CONSEGUE as 30 horas! Você é GUERREIRA e VENCEDORA!\n\nNUNCA ME ESQUEÇA! TE AMO IMENSAMENTE!\n\n❤️ SEMPRE SEU,\nKleber Gonçalves`,
          verse: '"Tudo tem seu tempo determinado." - Eclesiastes 3:1',
          icon: "sparkles",
          color: "from-purple-500 via-pink-600 to-rose-600",
        },
        {
          message: `🏆 VOCÊ CONSEGUE!\n\nMinha GUERREIRA Pamela,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! Minha CAMPEÃ em tudo!\n\nO Gustavo é a MELHOR COISA! Nossa MAIOR VITÓRIA e ALEGRIA!\n\nAs 30 horas? VOCÊ CONSEGUE! Você é FORTE e CAPAZ!\n\nSEMPRE PENSE EM MIM! TE AMO MUITO!\n\n❤️ SEMPRE TORCENDO,\nKleber Gonçalves`,
          verse: '"Combati o bom combate, guardei a fé." - 2 Timóteo 4:7',
          icon: "star",
          color: "from-yellow-600 via-orange-600 to-red-600",
        },
        {
          message: `🌈 SEMPRE ME LEMBRE!\n\nPamela LINDA,\n\nSEMPRE LEMBRE: Você é TUDO na minha vida! Minha ESPERANÇA e AMOR!\n\nNosso Gustavo é a MELHOR COISA! Nossa PROMESSA DE DEUS!\n\nVocê VAI ALCANÇAR as 30 horas! Você é DETERMINADA!\n\nNUNCA ME ESQUEÇA! TE AMO INFINITAMENTE!\n\n❤️ SEMPRE AQUI,\nKleber Gonçalves`,
          verse: '"Porei nas nuvens o meu arco." - Gênesis 9:13',
          icon: "sparkles",
          color: "from-red-500 via-yellow-500 to-blue-500",
        },
        {
          message: `💝 NUNCA ESQUEÇA!\n\nMinha RICA Pamela,\n\nSEMPRE SE LEMBRE: Você é TUDO que eu preciso! Meu MAIOR TESOURO!\n\nO Gustavo é a MELHOR COISA! Nosso TESOURO MAIS VALIOSO!\n\nVocê CONSEGUIRÁ as 30 horas! Eu CONFIO em você!\n\nSEMPRE PENSE EM MIM! TE AMO DEMAIS!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Onde estiver o seu tesouro, aí estará também o seu coração." - Mateus 6:21',
          icon: "gift",
          color: "from-amber-500 via-yellow-600 to-orange-600",
        },
        {
          message: `🌙 PENSE EM MIM!\n\nPamela BRILHANTE,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! Minha LUZ em todos os momentos!\n\nNosso Gustavo é a MELHOR COISA! Nosso DESEJO REALIZADO!\n\nAs 30 horas? VOCÊ CONSEGUE COM CERTEZA! Você é CAPAZ!\n\nSEMPRE ME LEMBRE! TE AMO COM TODO SER!\n\n❤️ SEMPRE PRESENTE,\nKleber Gonçalves`,
          verse: '"O Senhor é a minha luz e a minha salvação." - Salmos 27:1',
          icon: "star",
          color: "from-indigo-700 via-purple-700 to-pink-600",
        },
        {
          message: `🔥 SEMPRE LEMBRANDO!\n\nMinha ARDENTE Pamela,\n\nSEMPRE LEMBRE: Você é TUDO na minha vida! Meu AMOR ETERNO!\n\nO Gustavo é a MELHOR COISA! Nossa CHAMA DE AMOR!\n\nVocê ALCANÇARÁ as 30 horas! Você é FORTE e GUERREIRA!\n\nNUNCA ME ESQUEÇA! TE AMO APAIXONADAMENTE!\n\n❤️ SEMPRE SEU,\nKleber Gonçalves`,
          verse: '"As muitas águas não conseguem apagar o amor." - Cantares 8:7',
          icon: "heart",
          color: "from-orange-600 via-red-600 to-rose-600",
        },
        {
          message: `🎵 NUNCA ME ESQUEÇA!\n\nPamela MELODIOSA,\n\nSEMPRE SE LEMBRE: Você é TUDO que eu amo! A MÚSICA da minha vida!\n\nNosso Gustavo é a MELHOR COISA! Nossa SINFONIA PERFEITA!\n\nVocê VAI CONSEGUIR as 30 horas! Você é DEDICADA!\n\nSEMPRE PENSE EM MIM! TE AMO HARMONIOSAMENTE!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Cantai ao Senhor um cântico novo." - Salmos 96:1',
          icon: "sparkles",
          color: "from-cyan-600 via-blue-600 to-indigo-600",
        },
        {
          message: `🌻 SEMPRE AQUI!\n\nPamela RADIANTE,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! PERFEITA em tudo!\n\nO Gustavo é a MELHOR COISA! Nossa COLHEITA ABENÇOADA!\n\nAs 30 horas estão ao seu alcance! Você é CAPAZ DE TUDO!\n\nSEMPRE ME LEMBRE! TE AMO NATURALMENTE!\n\n❤️ SEMPRE COM VOCÊ,\nKleber Gonçalves`,
          verse: '"Olhem os lírios do campo e vejam como crescem." - Mateus 6:28',
          icon: "sparkles",
          color: "from-lime-500 via-green-600 to-emerald-600",
        },
        {
          message: `⭐ PENSE SEMPRE!\n\nPamela BRILHANTE,\n\nSEMPRE LEMBRE: Você é TUDO que eu preciso! Minha ESTRELA-GUIA!\n\nNosso Gustavo é a MELHOR COISA! Nossa CONSTELAÇÃO DE AMOR!\n\nVocê CONSEGUIRÁ as 30 horas FACILMENTE! Você é FORTE!\n\nNUNCA ME ESQUEÇA! TE AMO ASTRONOMICAMENTE!\n\n❤️ SEMPRE AQUI,\nKleber Gonçalves`,
          verse: '"Brilharão como as estrelas sempre e eternamente." - Daniel 12:3',
          icon: "star",
          color: "from-slate-700 via-indigo-700 to-purple-700",
        },
        {
          message: `🦅 NUNCA ESQUEÇA!\n\nPamela FORTE,\n\nSEMPRE SE LEMBRE: Você é TUDO na minha vida! CORAJOSA e LINDA!\n\nO Gustavo é a MELHOR COISA! Nossa CRIA PRECIOSA!\n\nVocê VAI ALCANÇAR as 30 horas! Você VOA ALTO!\n\nSEMPRE PENSE EM MIM! TE AMO NAS ALTURAS!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Os que esperam no Senhor sobem com asas como águias." - Isaías 40:31',
          icon: "star",
          color: "from-sky-600 via-blue-700 to-indigo-700",
        },
        {
          message: `🌊 SEMPRE LEMBRANDO!\n\nPamela PROFUNDA,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! Meu OCEANO DE AMOR!\n\nNosso Gustavo é a MELHOR COISA! Nossa PÉROLA PRECIOSA!\n\nAs 30 horas? VOCÊ CONSEGUE! Você é CAPAZ!\n\nSEMPRE ME LEMBRE! TE AMO PROFUNDAMENTE!\n\n❤️ SEMPRE SEU,\nKleber Gonçalves`,
          verse: '"Como são vastas as suas obras, Senhor!" - Salmos 104:24',
          icon: "sparkles",
          color: "from-blue-500 via-cyan-600 to-teal-600",
        },
        {
          message: `🍀 PENSE EM MIM!\n\nPamela SORTUDA,\n\nSEMPRE LEMBRE: Você é TUDO que eu quero! Minha SORTE GRANDE!\n\nO Gustavo é a MELHOR COISA! Nossa SORTE DOBRADA!\n\nVocê ALCANÇARÁ as 30 horas! Você é ABENÇOADA!\n\nNUNCA ME ESQUEÇA! TE AMO AFORTUNADAMENTE!\n\n❤️ SEMPRE AQUI,\nKleber Gonçalves`,
          verse: '"O Senhor abençoa os justos." - Salmos 5:12',
          icon: "gift",
          color: "from-green-500 via-emerald-600 to-teal-600",
        },
        {
          message: `🎨 NUNCA ESQUEÇA!\n\nPamela ARTÍSTICA,\n\nSEMPRE SE LEMBRE: Você é TUDO na minha vida! Minha OBRA-PRIMA!\n\nNosso Gustavo é a MELHOR COISA! Nossa PINTURA MAIS LINDA!\n\nVocê CONSEGUIRÁ as 30 horas! Você é PERFEITA!\n\nSEMPRE PENSE EM MIM! TE AMO ARTISTICAMENTE!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Somos obra-prima de Deus." - Efésios 2:10',
          icon: "sparkles",
          color: "from-fuchsia-600 via-pink-600 to-rose-600",
        },
        {
          message: `🌋 SEMPRE LEMBRANDO!\n\nPamela ARDENTE,\n\nNUNCA ESQUEÇA: Você é TUDO PARA MIM! Meu VULCÃO DE PAIXÃO!\n\nO Gustavo é a MELHOR COISA! Nossa LAVA DE AMOR!\n\nAs 30 horas? VOCÊ CONSEGUE COM CERTEZA! Você é FORTE!\n\nSEMPRE ME LEMBRE! TE AMO VULCANICAMENTE!\n\n❤️ SEMPRE SEU,\nKleber Gonçalves`,
          verse: '"Forte como a morte é o amor." - Cantares 8:6',
          icon: "heart",
          color: "from-red-700 via-orange-700 to-yellow-600",
        },
        {
          message: `🦁 PENSE SEMPRE!\n\nPamela PODEROSA,\n\nSEMPRE LEMBRE: Você é TUDO que eu amo! Minha LEOA CORAJOSA!\n\nNosso Gustavo é a MELHOR COISA! Nosso LEÃOZINHO PRECIOSO!\n\nVocê VAI CONSEGUIR as 30 horas! Você é GUERREIRA!\n\nNUNCA ME ESQUEÇA! TE AMO FEROZMENTE!\n\n❤️ SEMPRE PRESENTE,\nKleber Gonçalves`,
          verse: '"Seja forte e corajoso!" - Josué 1:9',
          icon: "star",
          color: "from-orange-700 via-amber-600 to-yellow-600",
        },
        {
          message: `💎 NUNCA ME ESQUEÇA!\n\nPamela PRECIOSA,\n\nSEMPRE SE LEMBRE: Você é TUDO na minha vida! Meu DIAMANTE RARO!\n\nO Gustavo é a MELHOR COISA! Nossa JOIA MAIS VALIOSA!\n\nVocê ALCANÇARÁ as 30 horas! Você é BRILHANTE!\n\nSEMPRE PENSE EM MIM! TE AMO PRECIOSAMENTE!\n\n❤️ NUNCA TE ESQUEÇO,\nKleber Gonçalves`,
          verse: '"Mais valiosa que jóias preciosas." - Provérbios 31:10',
          icon: "gift",
          color: "from-cyan-600 via-blue-700 to-indigo-700",
        },
      ]

      // Seleciona mensagem baseada no dia do mês (1-31)
      const messageIndex = (day - 1) % messages.length
      selectedMessage = messages[messageIndex]
    }

    setMessage(selectedMessage)
  }, [])

  if (!message) return null

  const IconComponent = {
    heart: Heart,
    baby: Baby,
    sparkles: Sparkles,
    star: Star,
    crown: Crown,
    gift: Gift,
  }[message.icon]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className={`bg-gradient-to-br ${message.color} p-8 rounded-2xl text-white space-y-6`}>
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 p-6 rounded-full animate-pulse">
              <IconComponent className="h-16 w-16" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-xl font-bold leading-relaxed whitespace-pre-line">{message.message}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/30">
            <p className="text-center text-lg italic opacity-90">{message.verse}</p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onOpenChange(false)}
              className="bg-white/90 hover:bg-white text-gray-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Obrigada, Meu Amor! ❤️
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
