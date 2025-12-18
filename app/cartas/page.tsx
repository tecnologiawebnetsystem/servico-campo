"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Eye, Trash2, Mail, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ConfirmDialog from "@/components/confirm-dialog"

interface Carta {
  id: number
  titulo: string
  texto: string
}

export default function CartasPage() {
  const router = useRouter()
  const [cartas, setCartas] = useState<Carta[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCarta, setEditingCarta] = useState<Carta | null>(null)
  const [titulo, setTitulo] = useState("")
  const [texto, setTexto] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [cartaToDelete, setCartaToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const usuarioId = "1"

  useEffect(() => {
    fetchCartas()
  }, [])

  const fetchCartas = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/cartas?usuarioId=${usuarioId}`)
      const data = await res.json()
      setCartas(data)
    } catch (error) {
      console.error("Erro ao buscar cartas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!titulo.trim() || !texto.trim()) return

    try {
      if (editingCarta) {
        const res = await fetch("/api/cartas", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCarta.id,
            usuarioId: Number.parseInt(usuarioId),
            titulo,
            texto,
          }),
        })

        if (res.ok) {
          setTitulo("")
          setTexto("")
          setEditingCarta(null)
          setIsDialogOpen(false)
          fetchCartas()
        }
      } else {
        const res = await fetch("/api/cartas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: Number.parseInt(usuarioId),
            titulo,
            texto,
          }),
        })

        if (res.ok) {
          setTitulo("")
          setTexto("")
          setIsDialogOpen(false)
          fetchCartas()
        }
      }
    } catch (error) {
      console.error("Erro ao salvar carta:", error)
    }
  }

  const handleEdit = (carta: Carta) => {
    setEditingCarta(carta)
    setTitulo(carta.titulo)
    setTexto(carta.texto)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    setCartaToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!cartaToDelete) return

    try {
      const res = await fetch(`/api/cartas?id=${cartaToDelete}&usuarioId=${usuarioId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchCartas()
      }
    } catch (error) {
      console.error("Erro ao deletar carta:", error)
    } finally {
      setCartaToDelete(null)
    }
  }

  const truncateText = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const filteredCartas = cartas.filter((carta) => {
    const query = searchQuery.toLowerCase()
    return carta.titulo.toLowerCase().includes(query) || carta.texto.toLowerCase().includes(query)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-6">
      <div className="max-w-6xl mx-auto p-3 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-3 items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-indigo-700 hover:bg-indigo-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-indigo-900">Exemplos de Cartas</h1>
                <p className="text-xs md:text-sm text-indigo-700">Gerencie suas cartas de pregação</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingCarta(null)
              setTitulo("")
              setTexto("")
              setIsDialogOpen(true)
            }}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nova Carta
          </Button>
        </div>

        {!loading && cartas.length > 0 && (
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por título ou conteúdo..."
              className="pl-11 border-indigo-300 focus:border-indigo-500 bg-white/70 backdrop-blur"
            />
          </div>
        )}

        {/* Grid de Cartas */}
        {loading ? (
          <div className="text-center py-12 text-indigo-600">Carregando...</div>
        ) : cartas.length === 0 ? (
          <Card className="p-12 text-center border-indigo-200 bg-white/50 backdrop-blur">
            <Mail className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
            <p className="text-indigo-600 font-medium mb-2">Nenhuma carta cadastrada</p>
            <p className="text-sm text-indigo-500">Clique em "Nova Carta" para começar</p>
          </Card>
        ) : filteredCartas.length === 0 ? (
          <Card className="p-12 text-center border-indigo-200 bg-white/50 backdrop-blur">
            <Mail className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
            <p className="text-indigo-600 font-medium mb-2">Nenhuma carta encontrada</p>
            <p className="text-sm text-indigo-500">Tente pesquisar com outras palavras-chave</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCartas.map((carta) => (
              <Card
                key={carta.id}
                className="p-5 border-indigo-200 bg-white/70 backdrop-blur hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-indigo-900 line-clamp-2">{carta.titulo}</h3>
                  <p className="text-sm text-indigo-600 line-clamp-2">{truncateText(carta.texto)}</p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/cartas/${carta.id}`)}
                      className="flex-1 gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(carta)}
                      className="flex-1 gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(carta.id)}
                      className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog Nova/Editar Carta */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white border-indigo-200 max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-indigo-900">{editingCarta ? "Editar Carta" : "Nova Carta"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 overflow-y-auto flex-1">
              <div>
                <label className="text-sm font-medium text-indigo-900 mb-2 block">Título da Carta</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Carta sobre esperança"
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-indigo-900 mb-2 block">Texto da Carta</label>
                <Textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Digite o conteúdo da carta..."
                  rows={12}
                  className="border-indigo-200 focus:border-indigo-400 resize-none"
                />
              </div>
            </div>
            <DialogFooter className="flex-shrink-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!titulo.trim() || !texto.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                {editingCarta ? "Atualizar" : "Salvar"} Carta
              </Button>
            </DialogFooter>
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
      </div>
    </div>
  )
}
