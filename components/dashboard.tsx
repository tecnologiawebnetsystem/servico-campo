"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AddHoursDialog from "@/components/add-hours-dialog"
import CongratulationsModal from "@/components/congratulations-modal"
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
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<HourEntry[]>([])
  const [showAddHours, setShowAddHours] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HourEntry | undefined>()
  const [online, setOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [bibleStudiesCount, setBibleStudiesCount] = useState(0)
  const [totalHours, setTotalHours] = useState(0)
  const [showCongratulations, setShowCongratulations] = useState(false)

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

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    setOnline(isOnline())

    const cleanup = setupOnlineListener(async (isOnlineNow) => {
      setOnline(isOnlineNow)

      if (isOnlineNow) {
        setSyncing(true)
        await syncOfflineData(usuario.id)
        setSyncing(false)
        fetchEntries()
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
    const totalMinutes = entries.reduce((sum, entry) => {
      return sum + decimalToMinutes(entry.hours)
    }, 0)
    const totalHours = totalMinutes / 60
    setTotalHours(totalHours)
    if (totalHours >= 50) {
      setShowCongratulations(true)
    } else {
      setShowCongratulations(false)
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

  const handleAddHours = async (entry: Omit<HourEntry, "id">) => {
    console.log("[v0] handleAddHours chamado com:", entry)

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
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
      })
      console.log("[v0] Modo offline - ação adicionada à fila")
      return
    }

    try {
      const payload = {
        usuarioId: usuario.id,
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
      }

      console.log("[v0] Enviando para API:", payload)

      const res = await fetch("/api/horas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()
      console.log("[v0] Resposta da API:", responseData)

      if (res.ok) {
        console.log("[v0] Horas salvas com sucesso!")
        await fetchEntries()
      } else {
        console.error("[v0] Erro na resposta da API:", responseData)
        throw new Error(responseData.error || "Erro ao salvar")
      }
    } catch (error) {
      console.error("[v0] Erro ao adicionar horas:", error)
      addOfflineAction("ADD_HORA", {
        dia: entry.day,
        horas: entry.hours,
        modalidade: entry.type,
        mes: currentDate.getMonth(),
        ano: currentDate.getFullYear(),
      })
    }
  }

  const handleEditHours = async (id: string, entry: Omit<HourEntry, "id">) => {
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

  // Calcular horas restantes para atingir 50
  const remainingMinutes = 50 * 60 - totalMinutes
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
                {/* Icon for dashboard */}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-rose-900">Bem-vinda, {usuario.nome}</h1>
                <p className="text-xs md:text-sm text-rose-700">Pioneiro Regular</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-rose-700 hover:bg-pink-100">
              {/* Logout button */}
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200 relative overflow-hidden shadow-md">
              <div className="relative">
                <p className="text-xs text-rose-700 font-medium mb-1">Total de Horas</p>
                <p className="text-2xl md:text-3xl font-bold text-rose-900">{totalHoursFormatted}</p>
                <p className="text-xs text-rose-600 mt-1">este mês</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-sky-100 to-blue-100 border-blue-200 relative overflow-hidden shadow-md">
              <div className="relative">
                <p className="text-xs text-sky-700 font-medium mb-1">Faltam</p>
                <p className="text-2xl md:text-3xl font-bold text-sky-900">{remainingFormatted}</p>
                <p className="text-xs text-sky-600 mt-1">para 50 horas</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 relative overflow-hidden shadow-md col-span-2 md:col-span-1">
              <div className="relative">
                <p className="text-xs text-purple-700 font-medium mb-1">Estudos Bíblicos</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDecrementStudies}
                    disabled={bibleStudiesCount <= 0}
                    className="h-7 w-7 p-0 hover:bg-purple-200 text-lg"
                  >
                    -
                  </Button>
                  <p className="text-2xl md:text-3xl font-bold text-purple-900">{bibleStudiesCount}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleIncrementStudies}
                    className="h-7 w-7 p-0 hover:bg-purple-200 text-lg"
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
                <ChevronLeft className="h-5 w-5" />
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
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <Button
              onClick={() => {
                setEditingEntry(undefined)
                setShowAddHours(true)
              }}
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg h-20 text-sm font-semibold w-full"
            >
              {/* Add hours button */}
              Adicionar Horas
            </Button>

            <a
              href="https://jworg.zoom.us/j/84813202624"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 text-white font-semibold shadow-lg h-20 text-sm rounded-md transition-colors w-full"
            >
              <div className="flex items-center gap-2">
                {/* Video icon */}
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
        onAdd={handleAddHours}
        onEdit={handleEditHours}
        editingEntry={editingEntry}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      {/* Congratulations Modal */}
      {showCongratulations && <CongratulationsModal totalHours={totalHours} userName={usuario.nome} />}
    </div>
  )
}
