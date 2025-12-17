"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Delete, Book, Mail, Phone } from "lucide-react"

interface Usuario {
  id: number
  nome: string
}

interface PinLoginProps {
  onLogin: (usuario: Usuario) => void
}

export default function PinLogin({ onLogin }: PinLoginProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)

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

        <div className="grid grid-cols-3 gap-2">
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

        <p className="text-center text-xs text-rose-700">Serviço de Campo</p>
      </div>
    </div>
  )
}
