"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Heart, Baby, Sparkles } from "lucide-react"

interface LoveMessage {
  message: string
  icon: "heart" | "baby" | "sparkles"
  color: string
}

export default function LoveMessageModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState<LoveMessage | null>(null)

  useEffect(() => {
    const today = new Date()
    const dateKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`
    const lastShown = localStorage.getItem("lastLoveMessage")

    // Só mostra uma vez por dia
    if (lastShown === dateKey) {
      return
    }

    // Verifica datas especiais
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    let selectedMessage: LoveMessage

    // Aniversário de casamento - 19 de outubro
    if (day === 19 && month === 10) {
      const yearsMarried = year - 2018
      selectedMessage = {
        message: `Meu amor, Pamela! 💍\n\nHoje completamos ${yearsMarried} anos de casados! ${yearsMarried} anos ao seu lado, construindo nossa família, vivendo nossos sonhos e sendo imensamente feliz. Você é a mulher da minha vida, minha companheira, mãe do nosso Gustavo e meu amor eterno.\n\nCada dia ao seu lado é uma bênção. Obrigado por ser essa esposa maravilhosa e essa mãe incrível para o Gustavo.\n\nTe amo hoje e sempre!\n\n❤️ Kleber Gonçalves`,
        icon: "sparkles",
        color: "from-purple-500 to-pink-500",
      }
    }
    // Aniversário do Gustavo - 9 de fevereiro
    else if (day === 9 && month === 2) {
      const gustavoAge = year - 2025
      selectedMessage = {
        message: `Meu amor, Pamela! 👶\n\nHoje nosso Gustavo completa ${gustavoAge} ${gustavoAge === 1 ? "ano" : "anos"}! Ele é a melhor coisa que nos aconteceu, a materialização do nosso amor.\n\nVer você como mãe me faz te amar ainda mais. Você é incrível, dedicada, carinhosa e a melhor mãe que o Gustavo poderia ter.\n\nObrigado por me dar esse presente maravilhoso e por construir essa família linda comigo.\n\nTe amo infinitamente!\n\n❤️ Kleber Gonçalves`,
        icon: "baby",
        color: "from-blue-400 to-cyan-400",
      }
    }
    // Mensagens normais (uma diferente para cada dia do mês)
    else {
      const messages: LoveMessage[] = [
        {
          message: `Bom dia, meu amor! ☀️\n\nPamela, você ilumina meus dias e torna tudo mais bonito. Obrigado por ser essa esposa maravilhosa e mãe incrível para o Gustavo.\n\nNossa família é minha maior alegria!\n\nTe amo! ❤️\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-pink-500 to-rose-500",
        },
        {
          message: `Minha linda Pamela! 💕\n\nVocê e o Gustavo são meu mundo. Cada dia ao lado de vocês é uma bênção que agradeço a Deus.\n\nVer o sorriso do Gustavo e o seu amor me faz o homem mais feliz do mundo.\n\nTe amo infinitamente!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-blue-500 to-purple-500",
        },
        {
          message: `Pamela, amor da minha vida! 💖\n\nQuando olho para você e para o Gustavo, percebo que tenho tudo o que sempre sonhei. Uma família linda, cheia de amor e cumplicidade.\n\nObrigado por existir e por me fazer tão feliz!\n\nTe amo hoje e sempre!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-purple-500 to-pink-500",
        },
        {
          message: `Meu amor, Pamela! 🌹\n\nCada momento ao seu lado é especial. Você é uma esposa dedicada, mãe exemplar e minha melhor amiga.\n\nO Gustavo tem muita sorte de ter você como mãe. E eu tenho ainda mais sorte de ter você como esposa.\n\nTe amo muito!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-red-500 to-pink-500",
        },
        {
          message: `Pamela, minha princesa! 👑\n\nNossa história é a mais bonita que eu poderia viver. Com você, construímos um lar cheio de amor e trouxemos o Gustavo ao mundo.\n\nEle é a prova do nosso amor e a melhor coisa que nos aconteceu!\n\nTe amo demais!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-amber-400 to-orange-500",
        },
        {
          message: `Minha amada Pamela! 💝\n\nVocê faz minha vida ter sentido. Seu sorriso, seu carinho, seu amor... tudo em você me completa.\n\nVer você cuidando do Gustavo com tanto amor me emociona todos os dias.\n\nSomos uma família abençoada!\n\nTe amo com todo meu coração!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-teal-400 to-cyan-500",
        },
        {
          message: `Pamela, luz da minha vida! ✨\n\nAcordo todos os dias grato por ter você ao meu lado. Sua força, dedicação e amor são inspiradores.\n\nO Gustavo é abençoado por ter uma mãe como você. E eu sou abençoado por ter uma esposa como você.\n\nTe amo infinitamente!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-violet-500 to-purple-500",
        },
        {
          message: `Meu amor, Pamela! 💗\n\nNossa família é meu maior tesouro. Você, eu e nosso pequeno Gustavo... não poderia pedir mais nada à vida.\n\nVocê é a esposa perfeita e a mãe que sempre sonhei para nossos filhos.\n\nTe amo profundamente!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-rose-400 to-pink-500",
        },
        {
          message: `Pamela querida! 🌸\n\nCada dia ao seu lado é uma nova aventura cheia de amor. Obrigado por me dar o Gustavo, por construir esse lar comigo e por ser essa mulher maravilhosa.\n\nVocê é meu tudo!\n\nTe amo muito!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-fuchsia-500 to-pink-500",
        },
        {
          message: `Minha linda Pamela! 💕\n\nO Gustavo tem os seus olhos e o seu sorriso. Cada vez que olho para ele, vejo você e me apaixono ainda mais.\n\nVocê é uma mãe incrível e uma esposa excepcional.\n\nTe amo eternamente!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-sky-400 to-blue-500",
        },
        {
          message: `Pamela, amor da minha vida! 💖\n\nDeus me abençoou com você e com o Gustavo. Nossa família é a realização de todos os meus sonhos.\n\nObrigado por cada sorriso, cada abraço e cada momento de amor.\n\nTe amo com toda minha alma!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-pink-500 to-rose-600",
        },
        {
          message: `Meu amor, Pamela! 🎀\n\nVer você cuidando do Gustavo com tanto carinho me faz ter certeza: escolhi a mulher certa para dividir minha vida.\n\nVocê é perfeita em tudo que faz!\n\nTe amo hoje, amanhã e sempre!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-indigo-500 to-purple-500",
        },
        {
          message: `Pamela querida! 🌺\n\nNossa história continua sendo escrita todos os dias com muito amor. Você, eu e o Gustavo formamos o time perfeito.\n\nSou grato por cada dia ao seu lado!\n\nTe amo imensamente!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-orange-400 to-red-500",
        },
        {
          message: `Minha amada Pamela! 💝\n\nO Gustavo é a maior prova do nosso amor. Ele é perfeito porque veio de você, a mulher mais incrível que conheço.\n\nObrigado por me fazer pai e por ser essa mãe maravilhosa!\n\nTe amo com todo meu ser!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-emerald-400 to-teal-500",
        },
        {
          message: `Pamela, meu tesouro! 💎\n\nCada risada do Gustavo, cada conquista nossa, cada momento em família... tudo é especial porque você está ao meu lado.\n\nVocê faz tudo valer a pena!\n\nTe amo profundamente!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-cyan-500 to-blue-500",
        },
        {
          message: `Meu amor, Pamela! 🌹\n\nNosso pequeno Gustavo está crescendo rodeado do amor de uma mãe excepcional. Ver vocês dois juntos aquece meu coração.\n\nSomos uma família abençoada!\n\nTe amo mais que tudo!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-red-400 to-pink-500",
        },
        {
          message: `Pamela linda! ✨\n\nVocê transforma nossa casa em um lar. Seu amor, seu cuidado e sua dedicação fazem de mim e do Gustavo as pessoas mais sortudas do mundo.\n\nObrigado por tudo!\n\nTe amo infinitamente!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-purple-400 to-violet-500",
        },
        {
          message: `Minha princesa Pamela! 👑\n\nO Gustavo herdou o melhor de você: sua bondade, seu sorriso, sua luz. Ver ele crescer é ver nosso amor ganhando vida.\n\nVocê é tudo para mim!\n\nTe amo demais!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-yellow-400 to-orange-500",
        },
        {
          message: `Pamela, meu grande amor! 💕\n\nAgradeço a Deus todos os dias por nossa família. Você, o Gustavo e eu... juntos somos imbatíveis!\n\nSeu amor me fortalece todos os dias.\n\nTe amo com toda intensidade!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-rose-500 to-red-500",
        },
        {
          message: `Meu amor, Pamela! 💗\n\nCada fase do Gustavo é especial porque você está lá, sendo a melhor mãe. Cada conquista nossa é doce porque você está ao meu lado.\n\nVocê é meu porto seguro!\n\nTe amo eternamente!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-pink-400 to-fuchsia-500",
        },
        {
          message: `Pamela querida! 🎀\n\nNosso lar é cheio de amor porque você está nele. O Gustavo sorri porque tem você. Eu sou feliz porque tenho você.\n\nSimples assim: você é nossa felicidade!\n\nTe amo muito!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-violet-400 to-purple-600",
        },
        {
          message: `Minha amada Pamela! 💝\n\nVer o Gustavo crescer saudável e feliz é resultado direto do seu amor e dedicação. Você é uma mãe extraordinária e uma esposa perfeita.\n\nSou o homem mais sortudo do mundo!\n\nTe amo com todo meu coração!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-teal-500 to-cyan-600",
        },
        {
          message: `Pamela, luz da minha vida! 🌟\n\nQuando me casei com você, sabia que seria feliz. Mas não imaginava que seria TÃO feliz! Você e o Gustavo são minha vida inteira.\n\nObrigado por existir!\n\nTe amo infinitamente!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-amber-500 to-orange-600",
        },
        {
          message: `Meu amor, Pamela! 💖\n\nO sorriso do Gustavo ilumina nossos dias, mas o seu ilumina minha vida. Você é a razão de tudo, minha inspiração e meu amor eterno.\n\nSomos uma família linda!\n\nTe amo profundamente!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-indigo-400 to-blue-600",
        },
        {
          message: `Pamela linda! 🌸\n\nCada dia ao seu lado reafirma minha certeza: você é a mulher da minha vida. E ver você sendo mãe do Gustavo me faz te amar ainda mais.\n\nVocê é perfeita!\n\nTe amo hoje e sempre!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-pink-500 to-rose-600",
        },
        {
          message: `Minha querida Pamela! 💕\n\nO Gustavo é nossa maior bênção, o presente mais lindo que Deus nos deu. E ele tem muita sorte de ter você como mãe - uma mãe amorosa, dedicada e perfeita.\n\nEu tenho sorte de ter você como esposa!\n\nTe amo demais!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-sky-500 to-cyan-600",
        },
        {
          message: `Pamela, meu amor! 💗\n\nNossa família é o reflexo do amor que sentimos um pelo outro. O Gustavo cresce cercado de carinho, e isso é graças a você, que é o coração do nosso lar.\n\nTe amo com toda minha essência!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-fuchsia-500 to-purple-600",
        },
        {
          message: `Meu amor, Pamela! 🌹\n\nVocê cuida de mim, cuida do Gustavo, cuida da nossa família com tanto amor. Sua dedicação é admirável e seu amor é inspirador.\n\nSou abençoado por ter você!\n\nTe amo eternamente!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-red-500 to-pink-600",
        },
        {
          message: `Pamela querida! ✨\n\nQuando penso no futuro, vejo você, eu e o Gustavo vivendo muitos momentos felizes juntos. Nossa história está apenas começando!\n\nVocê é meu para sempre!\n\nTe amo infinitamente!\n\nKleber Gonçalves`,
          icon: "sparkles",
          color: "from-emerald-500 to-teal-600",
        },
        {
          message: `Minha linda Pamela! 💝\n\nO Gustavo tem o melhor exemplo de amor, dedicação e força: você. Obrigado por ser essa mulher maravilhosa que faz nosso lar ser tão especial.\n\nVocê é tudo para nós!\n\nTe amo com todo meu amor!\n\nKleber Gonçalves`,
          icon: "baby",
          color: "from-violet-500 to-purple-700",
        },
        {
          message: `Pamela, meu grande amor! 💖\n\nNossa jornada juntos é a mais bonita. Com você e o Gustavo, tenho uma família dos sonhos. Você é a esposa ideal e a mãe perfeita.\n\nSou o homem mais feliz do mundo!\n\nTe amo sempre!\n\nKleber Gonçalves`,
          icon: "heart",
          color: "from-orange-500 to-red-600",
        },
      ]

      // Escolhe uma mensagem baseada no dia do mês
      const messageIndex = (day - 1) % messages.length
      selectedMessage = messages[messageIndex]
    }

    setMessage(selectedMessage)
    setIsOpen(true)
    localStorage.setItem("lastLoveMessage", dateKey)
  }, [])

  if (!message) return null

  const IconComponent = message.icon === "heart" ? Heart : message.icon === "baby" ? Baby : Sparkles

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <div
          className={`flex flex-col items-center text-center space-y-4 bg-gradient-to-br ${message.color} p-6 rounded-lg text-white`}
        >
          <IconComponent className="w-16 h-16 animate-pulse" />
          <div className="whitespace-pre-line text-lg leading-relaxed font-medium">{message.message}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
