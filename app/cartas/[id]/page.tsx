"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Copy, Check, Mail } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Carta {
  id: number
  titulo: string
  texto: string
}

export default function CartaViewPage() {
  const params = useParams()
  const id = params.id as string

  const [carta, setCarta] = useState<Carta | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const usuarioId = "1"

  useEffect(() => {
    fetchCarta()
  }, [id])

  const fetchCarta = async () => {
    try {
      setLoading(true)
      console.log("[v0] Buscando carta com ID:", id)
      const res = await fetch(`/api/cartas?usuarioId=${usuarioId}`)
      const data = await res.json()
      console.log("[v0] Cartas recebidas:", data)
      const cartaEncontrada = data.find((c: Carta) => c.id === Number.parseInt(id))
      console.log("[v0] Carta encontrada:", cartaEncontrada)
      setCarta(cartaEncontrada || null)
    } catch (error) {
      console.error("Erro ao buscar carta:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!carta) return

    try {
      await navigator.clipboard.writeText(carta.texto)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-indigo-600 text-lg">Carregando...</div>
      </div>
    )
  }

  if (!carta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-12 text-center border-indigo-200">
          <Mail className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
          <p className="text-indigo-600 font-medium mb-4">Carta não encontrada</p>
          <Link href="/cartas">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
              Voltar para Cartas
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-6">
      <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-3 items-center">
            <Link href="/cartas">
              <Button variant="ghost" size="icon" className="text-indigo-700 hover:bg-indigo-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-indigo-900">Visualizar Carta</h1>
                <p className="text-xs md:text-sm text-indigo-700">Leia e copie o conteúdo</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCopy}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Texto
              </>
            )}
          </Button>
        </div>

        {/* Carta Content */}
        <Card className="p-6 md:p-8 border-indigo-200 bg-white/70 backdrop-blur shadow-xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">{carta.titulo}</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
            <div className="prose prose-indigo max-w-none">
              <p className="text-base md:text-lg text-indigo-800 leading-relaxed whitespace-pre-wrap">{carta.texto}</p>
            </div>
          </div>
        </Card>

        {/* Footer com botão copiar para mobile */}
        <div className="flex justify-center md:hidden">
          <Button
            onClick={handleCopy}
            className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Texto Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Texto Completo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
