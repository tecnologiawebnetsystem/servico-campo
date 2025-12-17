"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Eye, Trash2, Loader2 } from "lucide-react"
import AddAnotacaoDialog from "@/components/add-anotacao-dialog"
import ViewAnotacaoDialog from "@/components/view-anotacao-dialog"
import ConfirmDialog from "@/components/confirm-dialog"

interface Anotacao {
  id: number
  titulo: string
  descricao: string
  data_criacao: string
}

interface AnotacoesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuarioId: number
}

export default function AnotacoesDialog({ open, onOpenChange, usuarioId }: AnotacoesDialogProps) {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewingAnotacao, setViewingAnotacao] = useState<Anotacao | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [anotacaoToDelete, setAnotacaoToDelete] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      fetchAnotacoes()
    }
  }, [open])

  const fetchAnotacoes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/anotacoes?usuarioId=${usuarioId}`)
      const data = await res.json()
      setAnotacoes(data)
    } catch (error) {
      console.error("Erro ao buscar anotações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setAnotacaoToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!anotacaoToDelete) return

    try {
      const res = await fetch(`/api/anotacoes?id=${anotacaoToDelete}&usuarioId=${usuarioId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchAnotacoes()
      }
    } catch (error) {
      console.error("Erro ao deletar anotação:", error)
    } finally {
      setAnotacaoToDelete(null)
    }
  }

  const handleAddSuccess = () => {
    fetchAnotacoes()
    setIsAddDialogOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-900">Minhas Anotações</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="mb-4">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="w-4 h-4" />
                Adicionar Anotação
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : anotacoes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhuma anotação cadastrada.</p>
                <p className="text-sm mt-2">Clique em "Adicionar Anotação" para começar.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {anotacoes.map((anotacao) => (
                  <Card key={anotacao.id} className="p-4 hover:shadow-lg transition-shadow border-purple-200">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-purple-900 line-clamp-1">{anotacao.titulo}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{anotacao.descricao}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(anotacao.data_criacao).toLocaleDateString("pt-BR")}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setViewingAnotacao(anotacao)}
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 border-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDelete(anotacao.id)}
                            className="h-8 w-8 text-red-600 hover:bg-red-50 border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddAnotacaoDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        usuarioId={usuarioId}
        onSuccess={handleAddSuccess}
      />

      <ViewAnotacaoDialog anotacao={viewingAnotacao} onClose={() => setViewingAnotacao(null)} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Excluir Anotação"
        description="Deseja realmente excluir esta anotação? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  )
}
