"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Delete, Book, Mail, Phone, Download, Smartphone, Share } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Usuario {
  id: number
  nome: string
}

interface PinLoginProps {
  onLogin: (usuario: Usuario) => void
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PinLogin({ onLogin }: PinLoginProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar se é iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)

    // Detectar se já está instalado como PWA
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
                       (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setIsStandalone(standalone)

    // Capturar evento de instalação para Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    }
  }

  const handleInstallIOS = () => {
    setShowIOSInstructions(true)
  }

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num
      setPin(newPin)

      if (newPin.length === 6) {
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: newPin }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setTimeout(() => {
                onLogin(data.usuario)
              }, 200)
            } else {
              setError(true)
              setTimeout(() => {
                setPin("")
                setError(false)
              }, 500)
            }
          })
          .catch(() => {
            setError(true)
            setTimeout(() => {
              setPin("")
              setError(false)
            }, 500)
          })
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20">
          <Book className="w-20 h-20 text-pink-400" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <Mail className="w-16 h-16 text-rose-400" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Phone className="w-16 h-16 text-pink-400" />
        </div>
        <div className="absolute bottom-10 right-32 opacity-20">
          <Book className="w-24 h-24 text-rose-400" />
        </div>
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 tracking-wide font-serif">
            Serviço de Campo
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-pink-200 p-8">
          <div className="text-center space-y-3">
            <div className="mb-4">
              <div className="inline-block p-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-lg">
                <Book className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-rose-900">Digite seu PIN de 6 dígitos</h1>

            {/* PIN Dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    error ? "bg-red-500" : index < pin.length ? "bg-rose-500" : "bg-pink-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                onClick={() => handleNumberClick(num.toString())}
                className="h-14 text-xl font-semibold bg-white hover:bg-pink-50 border-pink-200 text-rose-900 shadow-sm"
              >
                {num}
              </Button>
            ))}
            <div />
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNumberClick("0")}
              className="h-14 text-xl font-semibold bg-white hover:bg-pink-50 border-pink-200 text-rose-900 shadow-sm"
            >
              0
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDelete}
              className="h-14 bg-white hover:bg-pink-50 border-pink-200 shadow-sm"
            >
              <Delete className="w-5 h-5 text-rose-700" />
            </Button>
          </div>

          {/* Botões de instalação PWA */}
          {!isStandalone && (
            <div className="mt-6 pt-4 border-t border-pink-200">
              <p className="text-sm text-center text-rose-700 mb-3 font-medium">
                Instale o aplicativo no seu dispositivo
              </p>
              <div className="flex gap-3">
                {/* Botão iOS */}
                <button
                  onClick={handleInstallIOS}
                  className="flex-1 h-14 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                    color: "white",
                  }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-sm font-bold">iPhone/iPad</span>
                </button>

                {/* Botão Android */}
                <button
                  onClick={isIOS ? handleInstallIOS : handleInstallAndroid}
                  className="flex-1 h-14 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                    color: "white",
                  }}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-bold">Android</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog com instruções para iOS */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="max-w-sm mx-4 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-rose-900">
              Instalar no iPhone/iPad
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
              <div className="flex items-center justify-center w-8 h-8 bg-rose-500 text-white rounded-full text-sm font-bold shrink-0">
                1
              </div>
              <div>
                <p className="text-sm text-rose-900">
                  Toque no botão <strong>Compartilhar</strong>
                </p>
                <div className="mt-1 flex items-center gap-1 text-rose-600">
                  <Share className="w-5 h-5" />
                  <span className="text-xs">na barra do Safari</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
              <div className="flex items-center justify-center w-8 h-8 bg-rose-500 text-white rounded-full text-sm font-bold shrink-0">
                2
              </div>
              <div>
                <p className="text-sm text-rose-900">
                  Role para baixo e toque em
                </p>
                <p className="text-sm font-semibold text-rose-700 mt-1">
                  &quot;Adicionar à Tela de Início&quot;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
              <div className="flex items-center justify-center w-8 h-8 bg-rose-500 text-white rounded-full text-sm font-bold shrink-0">
                3
              </div>
              <div>
                <p className="text-sm text-rose-900">
                  Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl">
              <p className="text-xs text-center text-rose-700">
                O aplicativo aparecerá na sua tela inicial como um app nativo!
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            Entendi
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
