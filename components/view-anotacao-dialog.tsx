"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Anotacao {
  id: number
  titulo: string
  descricao: string
  data_criacao: string
}

interface ViewAnotacaoDialogProps {
  anotacao: Anotacao | null
  onClose: () => void
}

export default function ViewAnotacaoDialog({ anotacao, onClose }: ViewAnotacaoDialogProps) {
  if (!anotacao) return null

  return (
    <Dialog open={!!anotacao} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-900">{anotacao.titulo}</DialogTitle>
          <p className="text-sm text-gray-500">
            Criada em: {new Date(anotacao.data_criacao).toLocaleDateString("pt-BR")} às{" "}
            {new Date(anotacao.data_criacao).toLocaleTimeString("pt-BR")}
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] py-4">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{anotacao.descricao}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
