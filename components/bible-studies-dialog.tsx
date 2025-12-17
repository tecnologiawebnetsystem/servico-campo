"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Minus, BookHeart } from "lucide-react"

interface BibleStudiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentMonth: number
  currentYear: number
  usuarioId: number
}

export default function BibleStudiesDialog({
  open,
  onOpenChange,
  currentMonth,
  currentYear,
  usuarioId,
}: BibleStudiesDialogProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (open) {
      fetchEstudos()
    }
  }, [currentMonth, currentYear, open])

  const fetchEstudos = async () => {
    try {
      const res = await fetch(`/api/estudos?usuarioId=${usuarioId}&mes=${currentMonth}&ano=${currentYear}`)
      const data = await res.json()
      setCount(data.quantidade)
    } catch (error) {
      console.error("[v0] Erro ao buscar estudos:", error)
    }
  }

  const saveCount = async (newCount: number) => {
    try {
      const res = await fetch("/api/estudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          mes: currentMonth,
          ano: currentYear,
          quantidade: newCount,
        }),
      })

      if (res.ok) {
        setCount(newCount)
      }
    } catch (error) {
      console.error("[v0] Erro ao salvar estudos:", error)
    }
  }

  const handleIncrement = () => {
    saveCount(count + 1)
  }

  const handleDecrement = () => {
    if (count > 0) {
      saveCount(count - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-pink-500" />
            Estudos Bíblicos
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Gerencie a quantidade de estudos bíblicos do mês
          </DialogDescription>
        </DialogHeader>
        <div className="py-8">
          <div className="flex items-center justify-center gap-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              className="h-14 w-14 rounded-full border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400 bg-transparent"
              disabled={count === 0}
            >
              <Minus className="w-6 h-6 text-gray-700" />
            </Button>
            <div className="text-center min-w-[100px]">
              <div className="text-5xl font-bold text-gray-900">{count}</div>
              <p className="text-sm text-gray-600 mt-1">estudos</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-14 w-14 rounded-full border-2 border-pink-400 hover:bg-pink-100 hover:border-pink-500 bg-transparent"
            >
              <Plus className="w-6 h-6 text-pink-600" />
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
