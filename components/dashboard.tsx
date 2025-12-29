"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  Users,
  Plus,
  Mail,
  StickyNote,
  Video,
  LogOut,
} from "lucide-react"
import AddHoursDialog from "@/components/add-hours-dialog"
import CartasDialog from "@/components/cartas-dialog"
import AnotacoesDialog from "@/components/anotacoes-dialog"
import { MotivationModal } from "@/components/motivation-modal"
import LoveMessageModal from "@/components/love-message-modal"
import HoursGrid from "@/components/hours-grid"
import { decimalToMinutes, minutesToHoursString } from "@/lib/time-utils"
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

interface Carta {
  id: number
  content: string
}

interface Anotacao {
  id: number
  note: string
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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<HourEntry[]>([])
  const [cartas, setCartas] = useState<Carta[]>([])
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([])
  const [showAddHours, setShowAddHours] = useState(false)
  const [showCartas, setShowCartas] = useState(false)
  const [showAnotacoes, setShowAnotacoes] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HourEntry | undefined>()
  const [showMotivation, setShowMotivation] = useState(false)
  const [hoursRemaining, setHoursRemaining] = useState(0)
  const [online, setOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [bibleStudiesCount, setBibleStudiesCount] = useState(0)
  const [showLoveMessage, setShowLoveMessage] = useState(false)
  const [totalHours, setTotalHours] = useState(0)

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
        fetchEntries()
        fetchCartas()
        fetchAnotacoes()
        fetchEstudos()
      }
    })

    return cleanup
  }, [])

  useEffect(() => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `horas_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`
      if (offlineData[key]) {
        setEntries(offlineData[key])
      }

      const estudosKey = `estudos_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`
      if (offlineData[estudosKey] !== undefined) {
        setBibleStudiesCount(offlineData[estudosKey])
      }
    }
  }, [online, currentDate])

  useEffect(() => {
    fetchEntries()
    fetchCartas()
    fetchAnotacoes()
    fetchEstudos()
  }, [currentDate])

  const fetchEntries = async () => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `horas_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`
      if (offlineData[key]) {
        setEntries(offlineData[key])
      }
      return
    }

    try {
      const res = await fetch(
        `/api/horas?usuarioId=${usuario.id}&mes=${currentDate.getMonth()}&ano=${currentDate.getFullYear()}`,
      )
      const data = await res.json()

      const horasFormatadas: HourEntry[] = data.map((item: any) => ({
        id: item.id.toString(),
        day: item.dia,
        hours: Number.parseFloat(item.horas),
        type: item.modalidade,
        date: item.data_registro,
      }))

      setEntries(horasFormatadas)
      saveOfflineData(`horas_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, horasFormatadas)
    } catch (error) {
      console.error("Erro ao buscar horas:", error)
    }
  }

  const fetchCartas = async () => {
    try {
      const res = await fetch(`/api/cartas?usuarioId=${usuario.id}`)
      const data = await res.json()
      setCartas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar cartas:", error)
    }
  }

  const fetchAnotacoes = async () => {
    try {
      const res = await fetch(`/api/anotacoes?usuarioId=${usuario.id}`)
      const data = await res.json()
      setAnotacoes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar anotações:", error)
    }
  }

  const fetchEstudos = async () => {
    if (!online) {
      const offlineData = getOfflineData()
      const key = `estudos_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`
      if (offlineData[key] !== undefined) {
        setBibleStudiesCount(offlineData[key])
      }
      return
    }

    try {
      const res = await fetch(
        `/api/estudos?usuarioId=${usuario.id}&mes=${currentDate.getMonth()}&ano=${currentDate.getFullYear()}`,
      )
      const data = await res.json()
      setBibleStudiesCount(data.quantidade)
      saveOfflineData(`estudos_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, data.quantidade)
    } catch (error) {
      console.error("Erro ao buscar estudos:", error)
    }
  }

  useEffect(() => {
    // Sempre mostrar a mensagem de amor ao fazer login
    setShowLoveMessage(true)

    // Se estiver perto de completar 30 horas, mostrar mensagem motivacional também
    if (totalHours >= 20 && totalHours < 30) {
      // Pequeno delay para a mensagem de amor aparecer primeiro
      setTimeout(() => {
        setShowMotivation(true)
      }, 1000)
    }
  }, []) // Executa apenas ao montar o componente (cada login)

  useEffect(() => {
    const totalMinutes = entries.reduce((sum, entry) => {
      return sum + decimalToMinutes(entry.hours)
    }, 0)
    const totalHours = totalMinutes / 60
    setTotalHours(totalHours)
    const remaining = 1800 - totalMinutes // 30 horas = 1800 minutos
    const remainingHours = remaining / 60

    if (remainingHours > 0 && remainingHours < 10) {
      setHoursRemaining(remainingHours)
    }
  }, [entries])

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const handleAddEntry = async (entry: Omit<HourEntry, "id">) => {
    const dataRegistro = new Date(entry.date).toISOString().split("T")[0]
    const newEntry = {
      ...entry,
      id: `temp_${Date.now()}`,
    }

    setEntries([...entries, newEntry])
    saveOfflineData(`horas_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, [
      ...entries,
      newEntry,
    ])

    if (!online) {
      addOfflineAction("ADD_HORA", {
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
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
          mes: currentDate.getMonth(),
          ano: currentDate.getFullYear(),
        }),
      })

      if (res.ok) {
        fetchEntries()
      }
    } catch (error) {
      console.error("Erro ao adicionar horas:", error)
      addOfflineAction("ADD_HORA", {
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
      })
    }
  }

  const handleEditEntry = async (id: string, entry: Omit<HourEntry, "id">) => {
    const dataRegistro = new Date(entry.date).toISOString().split("T")[0]

    const updatedEntries = entries.map((e) => (e.id === id ? { ...entry, id } : e))
    setEntries(updatedEntries)
    saveOfflineData(`horas_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, updatedEntries)

    if (!online) {
      addOfflineAction("UPDATE_HORA", {
        id,
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
      })
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
          mes: currentDate.getMonth(),
          ano: currentDate.getFullYear(),
        }),
      })

      if (res.ok) {
        fetchEntries()
      }
    } catch (error) {
      console.error("Erro ao editar horas:", error)
      addOfflineAction("UPDATE_HORA", {
        id,
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        dataRegistro,
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
      })
    }
  }

  const handleDeleteEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    saveOfflineData(`horas_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, updatedEntries)

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
    saveOfflineData(`estudos_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, novoValor)

    if (!online) {
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
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
          mes: currentDate.getMonth(),
          ano: currentDate.getFullYear(),
          quantidade: novoValor,
        }),
      })

      if (!res.ok) {
        addOfflineAction("UPDATE_ESTUDOS", {
          mes: currentDate.getMonth(),
          ano: currentDate.getFullYear(),
          quantidade: novoValor,
        })
      }
    } catch (error) {
      console.error("Erro ao incrementar estudos:", error)
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
        quantidade: novoValor,
      })
    }
  }

  const handleDecrementStudies = async () => {
    if (bibleStudiesCount <= 0) return

    const novoValor = bibleStudiesCount - 1

    setBibleStudiesCount(novoValor)
    saveOfflineData(`estudos_${usuario.id}_${currentDate.getMonth()}_${currentDate.getFullYear()}`, novoValor)

    if (!online) {
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
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
          mes: currentDate.getMonth(),
          ano: currentDate.getFullYear(),
          quantidade: novoValor,
        }),
      })

      if (!res.ok) {
        addOfflineAction("UPDATE_ESTUDOS", {
          mes: currentDate.getMonth(),
          ano: currentDate.getFullYear(),
          quantidade: novoValor,
        })
      }
    } catch (error) {
      console.error("Erro ao decrementar estudos:", error)
      addOfflineAction("UPDATE_ESTUDOS", {
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
        quantidade: novoValor,
      })
    }
  }

  const pendingActions = getOfflineQueue().length

  const handleEdit = (entry: HourEntry) => {
    setEditingEntry(entry)
    setShowAddHours(true)
  }

  const totalMinutes = entries.reduce((sum, entry) => {
    return sum + decimalToMinutes(entry.hours)
  }, 0)

  const totalHoursFormatted = minutesToHoursString(totalMinutes)

  // Calcular horas restantes para atingir 30
  const remainingMinutes = 30 * 60 - totalMinutes
  const remainingFormatted = remainingMinutes > 0 ? minutesToHoursString(remainingMinutes) : "0,00"

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 md:py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-sky-50 px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex justify-end mb-3">
            <OnlineStatus
              usuarioId={usuario.id}
              onSyncComplete={() => {
                fetchEntries()
                fetchCartas()
                fetchAnotacoes()
                fetchEstudos()
              }}
            />
          </div>

          {!online && (
            <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm mb-3">
              {/* Offline status indicator */}
            </div>
          )}

          {syncing && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm mb-3">
              {/* Syncing status indicator */}
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
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200 relative overflow-hidden shadow-md">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Clock className="w-24 h-24" />
              </div>
              <div className="relative">
                <p className="text-xs text-rose-700 font-medium mb-1">Total de Horas</p>
                <p className="text-3xl font-bold text-rose-900">{totalHoursFormatted}</p>
                <p className="text-xs text-rose-600 mt-1">este mês</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-sky-100 to-blue-100 border-blue-200 relative overflow-hidden shadow-md">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Target className="w-24 h-24" />
              </div>
              <div className="relative">
                <p className="text-xs text-sky-700 font-medium mb-1">Faltam</p>
                <p className="text-3xl font-bold text-sky-900">{remainingFormatted}</p>
                <p className="text-xs text-sky-600 mt-1">para 30 horas</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 relative overflow-hidden shadow-md col-span-2 md:col-span-1">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Users className="w-24 h-24" />
              </div>
              <div className="relative">
                <p className="text-xs text-purple-700 font-medium mb-1">Estudos Bíblicos</p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDecrementStudies}
                    disabled={bibleStudiesCount <= 0}
                    className="h-8 w-8 p-0 hover:bg-purple-200"
                  >
                    -
                  </Button>
                  <p className="text-3xl font-bold text-purple-900">{bibleStudiesCount}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleIncrementStudies}
                    className="h-8 w-8 p-0 hover:bg-purple-200"
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-purple-600 mt-1">este mês</p>
              </div>
            </Card>
          </div>

          {/* Month Selector */}
          <Card className="p-3 md:p-4 shadow-md border-pink-200">
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousMonth}
                className="h-9 w-9 text-rose-700 hover:bg-pink-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg md:text-xl font-semibold min-w-[180px] md:min-w-[200px] text-center text-rose-900">
                {monthNames[currentDate.getMonth()]}/{currentDate.getFullYear()}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-9 w-9 text-rose-700 hover:bg-pink-100"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Button
              onClick={() => {
                setEditingEntry(undefined)
                setShowAddHours(true)
              }}
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg h-20 text-sm font-semibold w-full"
            >
              <Plus className="w-5 h-5" />
              Adicionar Horas
            </Button>

            <Button
              onClick={() => setShowCartas(true)}
              className="gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg h-20 text-sm font-semibold w-full flex flex-col"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Exemplos de Cartas</span>
              </div>
              <span className="text-xs opacity-90">({cartas.length} cartas)</span>
            </Button>

            <Button
              onClick={() => setShowAnotacoes(true)}
              className="gap-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg h-20 text-sm font-semibold w-full flex flex-col"
            >
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5" />
                <span>Anotações</span>
              </div>
              <span className="text-xs opacity-90">({anotacoes.length} anotações)</span>
            </Button>

            <a
              href="https://jworg.zoom.us/j/84813202624"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 text-white font-semibold shadow-lg h-20 text-sm rounded-md transition-colors w-full"
            >
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>Reunião Zoom</span>
              </div>
              <span className="text-xs opacity-90">Entrar na reunião</span>
            </a>
          </div>

          {/* Hours Grid */}
          <HoursGrid entries={entries} onEdit={handleEdit} onDelete={handleDeleteEntry} />
        </div>
      </div>

      {/* Dialogs */}
      <AddHoursDialog
        open={showAddHours}
        onOpenChange={setShowAddHours}
        onSuccess={fetchEntries}
        selectedDate={currentDate}
        editingEntry={editingEntry}
      />

      <CartasDialog open={showCartas} onOpenChange={setShowCartas} cartas={cartas} onCartasChange={fetchCartas} />

      <AnotacoesDialog
        open={showAnotacoes}
        onOpenChange={setShowAnotacoes}
        anotacoes={anotacoes}
        onAnotacoesChange={fetchAnotacoes}
      />

      {/* Motivation Modal */}
      <MotivationModal open={showMotivation} onOpenChange={setShowMotivation} hoursRemaining={hoursRemaining} />

      {/* Love Message Modal */}
      <LoveMessageModal open={showLoveMessage} onOpenChange={setShowLoveMessage} />
    </div>
  )
}
