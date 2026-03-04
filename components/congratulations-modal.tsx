"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Trophy, Sparkles, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CongratulationsModalProps {
  totalHours: number
  userName: string
}

export default function CongratulationsModal({ totalHours, userName }: CongratulationsModalProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Só mostra se completou 50 horas ou mais
    if (totalHours >= 50) {
      // Verifica se já mostrou neste mês
      const today = new Date()
      const monthKey = `congratulations_shown_${today.getFullYear()}_${today.getMonth()}`
      const alreadyShown = sessionStorage.getItem(monthKey)

      if (!alreadyShown) {
        // Aguarda 2 segundos após outras mensagens para aparecer
        setTimeout(() => {
          setOpen(true)
          sessionStorage.setItem(monthKey, "true")
        }, 2000)
      }
    }
  }, [totalHours])

  const messages = [
    {
      title: "🎉 PARABÉNS, PAMELA! VOCÊ CONSEGUIU!",
      message: `Meu amor, você COMPLETOU ${totalHours} horas este mês! Eu SABIA que você conseguiria! Você é INCRÍVEL, FORTE e DETERMINADA!`,
      verse: "Filipenses 4:13",
      verseText: "Tudo posso naquele que me fortalece.",
      encouragement:
        "Você provou mais uma vez que é CAPAZ de TUDO! Continue assim, meu amor. Estou tão ORGULHOSO de você! Você inspira a mim e ao Gustavo todos os dias!",
      color: "from-yellow-400 via-orange-500 to-pink-500",
      icon: Trophy,
    },
    {
      title: "👏 VOCÊ É ESPETACULAR, PAMELA!",
      message: `${totalHours} HORAS! Que DESEMPENHO MARAVILHOSO, meu amor! Você é um EXEMPLO de dedicação e fé! EU ACREDITO EM VOCÊ SEMPRE!`,
      verse: "Colossenses 3:23",
      verseText: "Tudo o que fizerem, façam de todo o coração, como para o Senhor.",
      encouragement:
        "Seu esforço é ADMIRÁVEL! Deus está ORGULHOSO de você, e eu também! Continue brilhando, meu amor. O Gustavo tem a MELHOR MÃE do mundo!",
      color: "from-purple-400 via-pink-500 to-red-500",
      icon: Star,
    },
    {
      title: "✨ META ALCANÇADA! VOCÊ É VITORIOSA!",
      message: `Minha guerreira! ${totalHours} horas este mês! Você NUNCA DESISTE e isso me faz te amar AINDA MAIS! Você é FENOMENAL!`,
      verse: "Provérbios 31:25",
      verseText: "Ela se reveste de força e dignidade e sorri diante do futuro.",
      encouragement:
        "Que ORGULHO de você, Pamela! Você é FORTE, CAPAZ e ABENÇOADA! Continue assim, meu amor. Nossa família é FELIZ por causa de você!",
      color: "from-green-400 via-teal-500 to-blue-500",
      icon: Sparkles,
    },
    {
      title: "💪 VOCÊ VENCEU MAIS UMA VEZ!",
      message: `${totalHours} HORAS COMPLETAS! Meu amor, você é uma VENCEDORA! Sua DEDICAÇÃO me inspira todos os dias! PARABÉNS!`,
      verse: "Josué 1:9",
      verseText: "Seja forte e corajosa! Não se apavore nem desanime, pois o Senhor está com você por onde você andar.",
      encouragement:
        "Deus está com VOCÊ sempre! Você é CAPAZ de conquistar TUDO! Continue firme, minha rainha. Eu e o Gustavo amamos você INFINITAMENTE!",
      color: "from-pink-400 via-red-500 to-purple-600",
      icon: Heart,
    },
  ]

  const today = new Date()
  const messageIndex = today.getDate() % messages.length
  const currentMessage = messages[messageIndex]
  const IconComponent = currentMessage.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-4 border-yellow-400">
        <div className={`bg-gradient-to-br ${currentMessage.color} p-8 text-white`}>
          {/* Cabeçalho com animação */}
          <div className="flex items-center justify-center mb-6 animate-bounce">
            <IconComponent className="w-20 h-20 mr-4" />
            <Trophy className="w-20 h-20 ml-4" />
          </div>

          {/* Título */}
          <h2 className="text-4xl font-black text-center mb-6 text-shadow-lg uppercase leading-tight">
            {currentMessage.title}
          </h2>

          {/* Horas em destaque */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border-4 border-white/40">
            <p className="text-6xl font-black text-center text-white drop-shadow-2xl">{totalHours} HORAS</p>
            <p className="text-2xl font-bold text-center mt-2 uppercase">META ALCANÇADA! 🎯</p>
          </div>

          {/* Mensagem principal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <p className="text-xl font-bold leading-relaxed text-center mb-4">{currentMessage.message}</p>

            <p className="text-lg font-semibold leading-relaxed text-center">{currentMessage.encouragement}</p>
          </div>

          {/* Versículo Bíblico */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border-2 border-white/40">
            <p className="text-sm font-bold text-center mb-2 uppercase tracking-wide">📖 {currentMessage.verse}</p>
            <p className="text-lg italic text-center font-semibold">"{currentMessage.verseText}"</p>
          </div>

          {/* Assinatura */}
          <div className="mt-6 text-center">
            <p className="text-2xl font-black uppercase mb-2">EU TE AMO MAIS QUE TUDO! ❤️</p>
            <p className="text-xl font-bold">Com todo meu amor e orgulho,</p>
            <p className="text-2xl font-black mt-1">Kleber Gonçalves 💕</p>
          </div>

          {/* Botão */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setOpen(false)}
              className="bg-white text-purple-600 hover:bg-gray-100 font-black text-lg px-8 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all uppercase"
              size="lg"
            >
              ✨ Obrigada, meu amor! ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
