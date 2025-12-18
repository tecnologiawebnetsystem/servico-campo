"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  BookOpen,
  Users,
  Video,
  Minus,
  WifiOff,
  Wifi,
  Mail,
  Clipboard,
} from "lucide-react"
import AddHoursDialog from "@/components/add-hours-dialog"
import BibleStudiesDialog from "@/components/bible-studies-dialog"
import HoursGrid from "@/components/hours-grid"
import Link from "next/link"
import AnotacoesDialog from "@/components/anotacoes-dialog"
import {
  isOnline,
  addOfflineAction,
  syncOfflineData,
  setupOnlineListener,
  getOfflineQueue,
  saveOfflineData,
  getOfflineData,
} from "@/lib/offline-sync"
import OnlineStatus from "@/components/online-status"

export interface HourEntry {
  id: string
  day: number
  hours: number
  type: "Pregação" | "Cartas" | "Ligação" | "Estudo" | "TPE"
  date: string
}

interface Usuario {
  id: number
  nome: string
}

interface DashboardProps {
  onLogout: () => void
  usuario: Usuario
}

export default function Dashboard({ onLogout, usuario }: DashboardProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [entries, setEntries] = useState<HourEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBibleStudiesDialogOpen, setIsBibleStudiesDialogOpen] = useState(false)
  const [bibleStudiesCount, setBibleStudiesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editingEntry, setEditingEntry] = useState<HourEntry | null>(null)
  const [online, setOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [isAnotacoesDialogOpen, setIsAnotacoesDialogOpen] = useState(false)
  const [cartasCount, setCartasCount] = useState(0)
  const [anotacoesCount, setAnotacoesCount] = useState(0)

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  useEffect(() => {
    setOnline(isOnline())

    const cleanup = setupOnlineListener(async (isOnlineNow) => {
      setOnline(isOnlineNow)

      if (isOnlineNow) {
        setSyncing(true)
        await syncOfflineData(usuario.id)
        setSyncing(false)
        fetchHoras()
        fetchEstudos()
        fetchCartasCount()
        fetchAnotacoesCount()
      }
    })

    return cleanup
  }, [])

  useEffect(() => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `horas_${usuario.id}_${currentMonth}_${currentYear}`
      if (offlineData[key]) {
        setEntries(offlineData[key])
      }

      const estudosKey = `estudos_${usuario.id}_${currentMonth}_${currentYear}`
      if (offlineData[estudosKey] !== undefined) {
        setBibleStudiesCount(offlineData[estudosKey])
      }
    }
  }, [online, currentMonth, currentYear])

  useEffect(() => {
    fetchHoras()
    fetchEstudos()
    fetchCartasCount()
    fetchAnotacoesCount()
  }, [currentMonth, currentYear])

  const fetchHoras = async () => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `horas_${usuario.id}_${currentMonth}_${currentYear}`
      if (offlineData[key]) {
        setEntries(offlineData[key])
      }
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/horas?usuarioId=${usuario.id}&mes=${currentMonth}&ano=${currentYear}`)
      const data = await res.json()

      const horasFormatadas: HourEntry[] = data.map((item: any) => ({
        id: item.id.toString(),
        day: item.dia,
        hours: Number.parseFloat(item.horas),
        type: item.modalidade,
        date: item.data_registro,
      }))

      setEntries(horasFormatadas)
      saveOfflineData(`horas_${usuario.id}_${currentMonth}_${currentYear}`, horasFormatadas)
    } catch (error) {
      console.error("Erro ao buscar horas:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEstudos = async () => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `estudos_${usuario.id}_${currentMonth}_${currentYear}`
      if (offlineData[key] !== undefined) {
        setBibleStudiesCount(offlineData[key])
      }
      return
    }

    try {
      const res = await fetch(`/api/estudos?usuarioId=${usuario.id}&mes=${currentMonth}&ano=${currentYear}`)
      const data = await res.json()
      setBibleStudiesCount(data.quantidade)
      saveOfflineData(`estudos_${usuario.id}_${currentMonth}_${currentYear}`, data.quantidade)
    } catch (error) {
      console.error("Erro ao buscar estudos:", error)
    }
  }

  const fetchCartasCount = async () => {
    try {
      const res = await fetch(`/api/cartas?usuarioId=${usuario.id}`)
      const data = await res.json()
      setCartasCount(Array.isArray(data) ? data.length : 0)
    } catch (error) {
      console.error("Erro ao buscar cartas:", error)
    }
  }

  const fetchAnotacoesCount = async () => {
    try {
      const res = await fetch(`/api/anotacoes?usuarioId=${usuario.id}`)
      const data = await res.json()
      setAnotacoesCount(Array.isArray(data) ? data.length : 0)
    } catch (error) {
      console.error("Erro ao buscar anotações:", error)
    }
  }

  const handleAddEntry = async (entry: Omit<HourEntry, "id">) => {
    const dataRegistro = new Date(entry.date).toISOString().split("T")[0]
    const newEntry = {
      ...entry,
      id: `temp_${Date.now()}`,
    }

    setEntries([...entries, newEntry])
    saveOfflineData(`horas_${usuario.id}_${currentMonth}_${currentYear}`, [...entries, newEntry])

    if (!online) {
      addOfflineAction("ADD_HORA", {
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentMonth,
        ano: currentYear,
      })
      return
    }

    try {
      const res = await fetch("/api/horas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuario.id,
          dia: entry.day,
          horas: entry.hours,
          modalidade: entry.type,
          dataRegistro,
          mes: currentMonth,
          ano: currentYear,
        }),
      })

      if (res.ok) {
        fetchHoras()
      }
    } catch (error) {
      console.error("Erro ao adicionar horas:", error)
      addOfflineAction("ADD_HORA", {
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentMonth,
        ano: currentYear,
      })
    }
  }

  const handleEditEntry = async (id: string, entry: Omit<HourEntry, "id">) => {
    const dataRegistro = new Date(entry.date).toISOString().split("T")[0]

    const updatedEntries = entries.map((e) => (e.id === id ? { ...entry, id } : e))
    setEntries(updatedEntries)
    saveOfflineData(`horas_${usuario.id}_${currentMonth}_${currentYear}`, updatedEntries)

    if (!online) {
      addOfflineAction("UPDATE_HORA", {
        id,
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentMonth,
        ano: currentYear,
      })
      setEditingEntry(null)
      return
    }

    try {
      const res = await fetch("/api/horas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          usuarioId: usuario.id,
          dia: entry.day,
          horas: entry.hours,
          modalidade: entry.type,
          dataRegistro,
          mes: currentMonth,
          ano: currentYear,
        }),
      })

      if (res.ok) {
        fetchHoras()
        setEditingEntry(null)
      }
    } catch (error) {
      console.error("Erro ao editar horas:", error)
      addOfflineAction("UPDATE_HORA", {
        id,
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentMonth,
        ano: currentYear,
      })
    }
  }

  const handleDeleteEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    saveOfflineData(`horas_${usuario.id}_${currentMonth}_${currentYear}`, updatedEntries)

    if (!online) {
      addOfflineAction("DELETE_HORA", { id })
      return
    }

    try {
      const res = await fetch(`/api/horas?id=${id}&usuarioId=${usuario.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        // Já atualizamos localmente
      }
    } catch (error) {
      console.error("Erro ao deletar horas:", error)
      addOfflineAction("DELETE_HORA", { id })
    }
  }

  const handleIncrementStudies = async () => {
    const novoValor = bibleStudiesCount + 1

    setBibleStudiesCount(novoValor)
    saveOfflineData(`estudos_${usuario.id}_${currentMonth}_${currentYear}`, novoValor)

    if (!online) {
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentMonth,
        ano: currentYear,
        quantidade: novoValor,
      })
      return
    }

    try {
      const res = await fetch("/api/estudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuario.id,
          mes: currentMonth,
          ano: currentYear,
          quantidade: novoValor,
        }),
      })

      if (!res.ok) {
        addOfflineAction("UPDATE_ESTUDOS", {
          mes: currentMonth,
          ano: currentYear,
          quantidade: novoValor,
        })
      }
    } catch (error) {
      console.error("Erro ao incrementar estudos:", error)
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentMonth,
        ano: currentYear,
        quantidade: novoValor,
      })
    }
  }

  const handleDecrementStudies = async () => {
    if (bibleStudiesCount <= 0) return

    const novoValor = bibleStudiesCount - 1

    setBibleStudiesCount(novoValor)
    saveOfflineData(`estudos_${usuario.id}_${currentMonth}_${currentYear}`, novoValor)

    if (!online) {
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentMonth,
        ano: currentYear,
        quantidade: novoValor,
      })
      return
    }

    try {
      const res = await fetch("/api/estudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuario.id,
          mes: currentMonth,
          ano: currentYear,
          quantidade: novoValor,
        }),
      })

      if (!res.ok) {
        addOfflineAction("UPDATE_ESTUDOS", {
          mes: currentMonth,
          ano: currentYear,
          quantidade: novoValor,
        })
      }
    } catch (error) {
      console.error("Erro ao decrementar estudos:", error)
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentMonth,
        ano: currentYear,
        quantidade: novoValor,
      })
    }
  }

  const pendingActions = getOfflineQueue().length

  const handleEdit = (entry: HourEntry) => {
    console.log("[v0] Abrindo edição para:", entry)
    setEditingEntry(entry)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-4 md:py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-sky-50 px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex justify-end mb-3">
            <OnlineStatus
              usuarioId={usuario.id}
              onSyncComplete={() => {
                fetchHoras()
                fetchEstudos()
                fetchCartasCount()
                fetchAnotacoesCount()
              }}
            />
          </div>

          {!online && (
            <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm mb-3">
              <WifiOff className="w-4 h-4" />
              <span>Modo Offline - {pendingActions} ação(ões) pendente(s) de sincronização</span>
            </div>
          )}

          {syncing && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm mb-3">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span>Sincronizando dados...</span>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-md">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-rose-900">Bem-vinda, {usuario.nome}</h1>
                <p className="text-xs md:text-sm text-rose-700">Registre suas horas de serviço</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-rose-700 hover:bg-pink-100">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200 relative overflow-hidden shadow-md">
              <div className="absolute top-2 right-2 opacity-10">
                <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-xs text-rose-700 font-medium">Total de Horas</p>
                <p className="text-2xl md:text-3xl font-bold text-rose-900">
                  {entries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2)}h
                </p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-sky-100 to-blue-100 border-blue-200 relative overflow-hidden shadow-md">
              <div className="absolute top-2 right-2 opacity-10">
                <Users className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-xs text-blue-700 font-medium">Faltam</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-900">
                  {Math.max(0, 30 - entries.reduce((sum, entry) => sum + entry.hours, 0)).toFixed(2)}h
                </p>
                <p className="text-[10px] text-blue-600">Meta: 30 horas/mês</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 relative overflow-hidden shadow-md col-span-2 md:col-span-1">
              <div className="space-y-1 relative z-10">
                <p className="text-xs text-purple-700 font-medium">Estudos Bíblicos</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-2xl md:text-3xl font-bold text-purple-900">{bibleStudiesCount}</p>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDecrementStudies()}
                      disabled={bibleStudiesCount <= 0}
                      className="h-8 w-8 rounded-full bg-white hover:bg-purple-50 border-purple-300 text-purple-700 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleIncrementStudies()}
                      className="h-8 w-8 rounded-full bg-white hover:bg-purple-50 border-purple-300 text-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Month Selector */}
          <Card className="p-3 md:p-4 shadow-md border-pink-200">
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePreviousMonth(setCurrentMonth, setCurrentYear, currentMonth, currentYear)}
                className="h-9 w-9 text-rose-700 hover:bg-pink-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg md:text-xl font-semibold min-w-[180px] md:min-w-[200px] text-center text-rose-900">
                {monthNames[currentMonth]}/{currentYear}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNextMonth(setCurrentMonth, setCurrentYear, currentMonth, currentYear)}
                className="h-9 w-9 text-rose-700 hover:bg-pink-100"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg h-20 text-sm font-semibold w-full"
            >
              <Plus className="w-4 h-4" />
              Adicionar Horas
            </Button>

            <Link
              href="/cartas"
              className="inline-flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg h-20 text-sm font-semibold rounded-md transition-colors w-full"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Exemplos de Cartas</span>
              </div>
              <span className="text-xs font-normal opacity-90">Total: {cartasCount}</span>
            </Link>

            <Button
              onClick={() => setIsAnotacoesDialogOpen(true)}
              className="gap-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg h-20 text-sm font-semibold w-full flex flex-col"
            >
              <div className="flex items-center gap-2">
                <Clipboard className="w-4 h-4" />
                <span>Anotações</span>
              </div>
              <span className="text-xs font-normal opacity-90">Total: {anotacoesCount}</span>
            </Button>

            <a
              href="https://jworg.zoom.us/j/84813202624"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 text-white font-semibold shadow-lg h-20 text-sm rounded-md transition-colors w-full"
            >
              <Video className="w-4 h-4 flex-shrink-0" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="leading-tight">Reunião Zoom</span>
                <span className="text-xs font-bold leading-none opacity-90">Senha: 202020</span>
              </div>
            </a>
          </div>

          {/* Hours Grid */}
          <div>
            <HoursGrid entries={entries} onDelete={handleDeleteEntry} onEdit={handleEdit} />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddHoursDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingEntry(null)
          }
        }}
        onAdd={handleAddEntry}
        onEdit={handleEditEntry}
        editingEntry={editingEntry}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      <BibleStudiesDialog
        open={isBibleStudiesDialogOpen}
        onOpenChange={setIsBibleStudiesDialogOpen}
        currentMonth={currentMonth}
        currentYear={currentYear}
        usuarioId={usuario.id}
      />

      <AnotacoesDialog open={isAnotacoesDialogOpen} onOpenChange={setIsAnotacoesDialogOpen} usuarioId={usuario.id} />
    </div>
  )
}

const handlePreviousMonth = (setCurrentMonth: any, setCurrentYear: any, currentMonth: any, currentYear: any) => {
  if (currentMonth === 0) {
    setCurrentMonth(11)
    setCurrentYear(currentYear - 1)
  } else {
    setCurrentMonth(currentMonth - 1)
  }
}

const handleNextMonth = (setCurrentMonth: any, setCurrentYear: any, currentMonth: any, currentYear: any) => {
  if (currentMonth === 11) {
    setCurrentMonth(0)
    setCurrentYear(currentYear + 1)
  } else {
    setCurrentMonth(currentMonth + 1)
  }
}
