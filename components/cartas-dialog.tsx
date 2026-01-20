"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Mail, Trash2, Eye, Search, Sparkles, X, Loader2, ExternalLink } from "lucide-react"
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

const ASSUNTOS_PREDEFINIDOS = [
  { value: "paz_mundial", label: "Paz Mundial" },
  { value: "sofrimento", label: "Por que existe sofrimento?" },
  { value: "ressurreicao", label: "Esperança da Ressurreição" },
  { value: "jesus_cristo", label: "Quem é Jesus Cristo?" },
  { value: "testemunhas_jeova", label: "Quem são as Testemunhas de Jeová?" },
  { value: "natal", label: "Origem do Natal" },
  { value: "depressao", label: "Lidando com a Depressão" },
  { value: "desemprego", label: "Enfrentando o Desemprego" },
  { value: "familia", label: "Família Feliz" },
  { value: "biblia", label: "Por que estudar a Bíblia?" },
  { value: "reino_deus", label: "O Reino de Deus" },
  { value: "futuro", label: "O que o futuro reserva?" },
  { value: "outro", label: "Outro assunto..." },
]

export default function CartasDialog({ open, onOpenChange, usuarioId }: CartasDialogProps) {
  const [cartas, setCartas] = useState<Carta[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedCarta, setSelectedCarta] = useState<Carta | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [cartaToDelete, setCartaToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const online = isOnline()

  // Estados para geração de carta com IA
  const [assuntoSelecionado, setAssuntoSelecionado] = useState("")
  const [assuntoCustom, setAssuntoCustom] = useState("")
  const [gerando, setGerando] = useState(false)
  const [cartaGerada, setCartaGerada] = useState<{ titulo: string; texto: string; fonte: string } | null>(null)

  const validUsuarioId = typeof usuarioId === "number" && !isNaN(usuarioId) ? usuarioId : 1

  useEffect(() => {
    if (open) {
      fetchCartas()
    }
  }, [open])

  const fetchCartas = async () => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `cartas_${validUsuarioId}`
      if (offlineData[key]) {
        const data = offlineData[key]
        setCartas(Array.isArray(data) ? data : [])
      }
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/cartas?usuarioId=${validUsuarioId}`)
      const data = await res.json()
      const cartasArray = Array.isArray(data) ? data : data?.cartas || []
      setCartas(cartasArray)
      saveOfflineData(`cartas_${validUsuarioId}`, cartasArray)
    } catch (error) {
      console.error("Erro ao buscar cartas:", error)
      setCartas([])
    } finally {
      setLoading(false)
    }
  }

  const handleGerarCartaIA = async () => {
    const tema = assuntoSelecionado === "outro" ? assuntoCustom : ASSUNTOS_PREDEFINIDOS.find(a => a.value === assuntoSelecionado)?.label

    if (!tema) {
      alert("Por favor, selecione ou digite um assunto")
      return
    }

    setGerando(true)
    setCartaGerada(null)

    try {
      const res = await fetch("/api/gerar-carta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assunto: tema,
          assuntoCustom: assuntoSelecionado === "outro" ? assuntoCustom : null,
        }),
      })

      if (!res.ok) {
        throw new Error("Erro ao gerar carta")
      }

      const data = await res.json()
      setCartaGerada(data)
    } catch (error) {
      console.error("Erro ao gerar carta:", error)
      alert("Erro ao gerar carta. Por favor, tente novamente.")
    } finally {
      setGerando(false)
    }
  }

  const handleSalvarCartaGerada = async () => {
    if (!cartaGerada) return

    const textoComFonte = `${cartaGerada.texto}\n\n---\n${cartaGerada.fonte}`

    const newCarta = {
      id: Date.now(),
      titulo: cartaGerada.titulo,
      texto: textoComFonte,
    }

    setCartas([newCarta, ...cartas])
    saveOfflineData(`cartas_${validUsuarioId}`, [newCarta, ...cartas])

    if (!online) {
      addOfflineAction("ADD_CARTA", { titulo: cartaGerada.titulo, texto: textoComFonte })
      setCartaGerada(null)
      setShowForm(false)
      setAssuntoSelecionado("")
      setAssuntoCustom("")
      // Exibir a carta recém criada
      setSelectedCarta(newCarta)
      setShowViewer(true)
      return
    }

    try {
      const res = await fetch("/api/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: validUsuarioId,
          titulo: cartaGerada.titulo,
          texto: textoComFonte,
        }),
      })

      if (res.ok) {
        const savedCarta = await res.json()
        await fetchCartas()
        setCartaGerada(null)
        setShowForm(false)
        setAssuntoSelecionado("")
        setAssuntoCustom("")
        // Exibir a carta recém criada
        setSelectedCarta(savedCarta)
        setShowViewer(true)
      }
    } catch (error) {
      console.error("Erro ao salvar carta:", error)
      addOfflineAction("ADD_CARTA", { titulo: cartaGerada.titulo, texto: textoComFonte })
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
    saveOfflineData(`cartas_${validUsuarioId}`, updatedCartas)

    if (!online) {
      addOfflineAction("DELETE_CARTA", { id: cartaToDelete })
      setCartaToDelete(null)
      return
    }

    try {
      await fetch(`/api/cartas?id=${cartaToDelete}&usuarioId=${validUsuarioId}`, {
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

  const filteredCartas = Array.isArray(cartas)
    ? cartas.filter((carta) => {
        if (!carta || !carta.titulo || !carta.texto) return false
        const query = searchQuery.toLowerCase()
        return carta.titulo.toLowerCase().includes(query) || carta.texto.toLowerCase().includes(query)
      })
    : []

  return (
    <>
      {/* Lista de Cartas - Dialog mais largo */}
      <Dialog open={open && !showViewer && !showForm} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-slate-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              Exemplos de Cartas
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Carta
            </Button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por título ou conteúdo..."
                className="pl-10 border-gray-300"
              />
            </div>

            {loading ? (
              <p className="text-center text-gray-500 py-8">Carregando...</p>
            ) : filteredCartas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {searchQuery ? "Nenhuma carta encontrada com esse termo" : "Nenhuma carta cadastrada ainda"}
              </p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {filteredCartas.map((carta) => (
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
        </DialogContent>
      </Dialog>

      {/* Form para selecionar assunto */}
      <Dialog open={showForm && !cartaGerada} onOpenChange={(open) => { if (!open) { setShowForm(false); setAssuntoSelecionado(""); setAssuntoCustom(""); } }}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Gerar Carta com IA
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informação sobre jw.org */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Baseado em jw.org</p>
                <p className="text-xs text-blue-600 mt-1">
                  A carta será gerada utilizando como base de estudo e pesquisa o conteúdo do site oficial das Testemunhas de Jeová (jw.org).
                </p>
              </div>
            </div>

            {/* Seleção de assunto */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Selecione o Assunto</label>
              <Select value={assuntoSelecionado} onValueChange={setAssuntoSelecionado}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Escolha um assunto..." />
                </SelectTrigger>
                <SelectContent>
                  {ASSUNTOS_PREDEFINIDOS.map((assunto) => (
                    <SelectItem key={assunto.value} value={assunto.value}>
                      {assunto.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campo de assunto customizado */}
            {assuntoSelecionado === "outro" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Digite o Assunto</label>
                <Input
                  value={assuntoCustom}
                  onChange={(e) => setAssuntoCustom(e.target.value)}
                  placeholder="Ex: Como ter uma família feliz"
                  className="border-gray-300"
                />
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); setAssuntoSelecionado(""); setAssuntoCustom(""); }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGerarCartaIA}
                disabled={gerando || !assuntoSelecionado || (assuntoSelecionado === "outro" && !assuntoCustom.trim())}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                {gerando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Carta
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview da carta gerada - TELA CHEIA */}
      <Dialog open={showForm && !!cartaGerada} onOpenChange={(open) => { if (!open) { setCartaGerada(null); } }}>
        <DialogContent className="w-[98vw] h-[95vh] max-w-none flex flex-col bg-white p-0">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Carta Gerada com IA
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCartaGerada(null)}
              className="text-gray-600 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  {cartaGerada?.titulo}
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{cartaGerada?.texto}</p>
                <div className="mt-8 pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-500 italic flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {cartaGerada?.fonte}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-3 max-w-md mx-auto">
              <Button
                variant="outline"
                onClick={() => setCartaGerada(null)}
                className="flex-1"
              >
                Gerar Outra
              </Button>
              <Button
                onClick={handleSalvarCartaGerada}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                Salvar Carta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Viewer Dialog - Quase tela cheia */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="w-[98vw] h-[95vh] max-w-none flex flex-col bg-white p-0">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              {selectedCarta?.titulo}
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowViewer(false)}
              className="text-gray-600 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{selectedCarta?.texto}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <Button
              onClick={() => setShowViewer(false)}
              className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <X className="w-4 h-4 mr-2" />
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
