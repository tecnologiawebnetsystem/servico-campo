"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Target, Zap } from "lucide-react"

interface MotivationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hoursRemaining: number
}

const motivationalMessages = [
  {
    icon: Sparkles,
    title: "Você está quase lá!",
    message: "Faltam apenas {hours} para completar sua meta de 30 horas! Continue assim, você é incrível!",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Progresso Fantástico!",
    message: "Uau! Só mais {hours} e você atinge 30 horas! Seu esforço está valendo a pena!",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Na Reta Final!",
    message: "Você está a apenas {hours} da sua meta! A dedicação de vocês é inspiradora!",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Quase Conquistado!",
    message: "Incrível! Faltam só {hours} para completar 30 horas! Continue com essa energia!",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Sparkles,
    title: "Você é um Exemplo!",
    message: "Parabéns! Mais {hours} e você completa sua meta mensal. Jeová está orgulhoso!",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Target,
    title: "Foco Total!",
    message: "Sensacional! Apenas {hours} separam você das 30 horas. A linha de chegada está logo ali!",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Determinação Exemplar!",
    message: "Que dedicação! Só mais {hours} e você alcança as 30 horas. Continue firme!",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Empolgante!",
    message: "Você está arrasando! Faltam {hours} para a meta. Seu zelo no ministério é admirável!",
    color: "from-amber-500 to-orange-500",
  },
]

export function MotivationModal({ open, onOpenChange, hoursRemaining }: MotivationModalProps) {
  // Seleciona uma mensagem aleatória baseada na data para ter variedade
  const messageIndex = Math.floor(Math.random() * motivationalMessages.length)
  const selectedMessage = motivationalMessages[messageIndex]
  const Icon = selectedMessage.icon

  const formatHours = (decimal: number) => {
    const hours = Math.floor(decimal)
    const minutes = Math.round((decimal - hours) * 60)
    if (minutes > 0) {
      return `${hours}h${minutes.toString().padStart(2, "0")}`
    }
    return `${hours}h`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedMessage.color} flex items-center justify-center mx-auto mb-4 animate-pulse`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">{selectedMessage.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground text-lg leading-relaxed">
            {selectedMessage.message.replace("{hours}", formatHours(hoursRemaining))}
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-center text-purple-900 font-medium">
              "Não desista de fazer o que é bom, pois, no tempo certo, colheremos se não desanimarmos." - Gálatas 6:9
            </p>
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full" size="lg">
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
