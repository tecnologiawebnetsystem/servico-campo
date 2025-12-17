"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface AddAnotacaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuarioId: number
  onSuccess: () => void
}

export default function AddAnotacaoDialog({ open, onOpenChange, usuarioId, onSuccess }: AddAnotacaoDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      alert("Por favor, preencha todos os campos")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/anotacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          titulo: titulo.trim(),
          descricao: descricao.trim(),
        }),
      })

      if (res.ok) {
        setTitulo("")
        setDescricao("")
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao salvar anotação:", error)
      alert("Erro ao salvar anotação")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-900">Nova Anotação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Digite o título da anotação"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="border-purple-300 focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Digite suas anotações aqui..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={10}
              className="border-purple-300 focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
