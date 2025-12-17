"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Mail, Trash2, Eye } from "lucide-react"
import { isOnline, addOfflineAction, saveOfflineData, getOfflineData } from "@/lib/offline-sync"
import ConfirmDialog from "@/components/confirm-dialog"

interface Carta {
  id: number
  titulo: string
  texto: string
}

interface CartasDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuarioId: number
}

export default function CartasDialog({ open, onOpenChange, usuarioId }: CartasDialogProps) {
  const [cartas, setCartas] = useState<Carta[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedCarta, setSelectedCarta] = useState<Carta | null>(null)
  const [titulo, setTitulo] = useState("")
  const [texto, setTexto] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [cartaToDelete, setCartaToDelete] = useState<number | null>(null)
  const online = isOnline()

  useEffect(() => {
    if (open) {
      fetchCartas()
    }
  }, [open])

  const fetchCartas = async () => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `cartas_${usuarioId}`
      if (offlineData[key]) {
        setCartas(offlineData[key])
      }
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/cartas?usuarioId=${usuarioId}`)
      const data = await res.json()
      setCartas(data)
      saveOfflineData(`cartas_${usuarioId}`, data)
    } catch (error) {
      console.error("Erro ao buscar cartas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCarta = async () => {
    if (!titulo.trim() || !texto.trim()) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const newCarta = {
      id: Date.now(),
      titulo,
      texto,
    }

    setCartas([newCarta, ...cartas])
    saveOfflineData(`cartas_${usuarioId}`, [newCarta, ...cartas])

    if (!online) {
      addOfflineAction("ADD_CARTA", { titulo, texto })
      setTitulo("")
      setTexto("")
      setShowForm(false)
      return
    }

    try {
      const res = await fetch("/api/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          titulo,
          texto,
        }),
      })

      if (res.ok) {
        fetchCartas()
        setTitulo("")
        setTexto("")
        setShowForm(false)
      }
    } catch (error) {
      console.error("Erro ao adicionar carta:", error)
      addOfflineAction("ADD_CARTA", { titulo, texto })
    }
  }

  const handleDeleteCarta = async (id: number) => {
    setCartaToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!cartaToDelete) return

    const updatedCartas = cartas.filter((c) => c.id !== cartaToDelete)
    setCartas(updatedCartas)
    saveOfflineData(`cartas_${usuarioId}`, updatedCartas)

    if (!online) {
      addOfflineAction("DELETE_CARTA", { id: cartaToDelete })
      setCartaToDelete(null)
      return
    }

    try {
      await fetch(`/api/cartas?id=${cartaToDelete}&usuarioId=${usuarioId}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Erro ao deletar carta:", error)
      addOfflineAction("DELETE_CARTA", { id: cartaToDelete })
    } finally {
      setCartaToDelete(null)
    }
  }

  const handleViewCarta = (carta: Carta) => {
    setSelectedCarta(carta)
    setShowViewer(true)
  }

  return (
    <>
      <Dialog open={open && !showViewer} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-slate-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              Exemplos de Cartas
            </DialogTitle>
          </DialogHeader>

          {!showForm ? (
            <div className="space-y-4">
              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Carta
              </Button>

              {loading ? (
                <p className="text-center text-gray-500 py-8">Carregando...</p>
              ) : cartas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma carta cadastrada ainda</p>
              ) : (
                <div className="space-y-3">
                  {cartas.map((carta) => (
                    <Card
                      key={carta.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1" onClick={() => handleViewCarta(carta)}>
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            {carta.titulo}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{carta.texto}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleViewCarta(carta)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteCarta(carta.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Título da Carta</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Carta de apresentação"
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Texto da Carta</label>
                <Textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Digite o conteúdo da carta..."
                  className="min-h-[200px] border-gray-300"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddCarta}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              {selectedCarta?.titulo}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedCarta?.texto}</p>
            </div>

            <Button onClick={() => setShowViewer(false)} className="w-full" variant="outline">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Excluir Carta"
        description="Deseja realmente excluir esta carta? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  )
}
