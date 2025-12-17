"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, LogOut, BookOpen, Users, BookHeart } from "lucide-react"
import AddHoursDialog from "@/components/add-hours-dialog"
import BibleStudiesDialog from "@/components/bible-studies-dialog"
import HoursGrid from "@/components/hours-grid"

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
    fetchHoras()
    fetchEstudos()
  }, [currentMonth, currentYear])

  const fetchHoras = async () => {
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
    } catch (error) {
      console.error("Erro ao buscar horas:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEstudos = async () => {
    try {
      const res = await fetch(`/api/estudos?usuarioId=${usuario.id}&mes=${currentMonth}&ano=${currentYear}`)
      const data = await res.json()
      setBibleStudiesCount(data.quantidade)
    } catch (error) {
      console.error("Erro ao buscar estudos:", error)
    }
  }

  useEffect(() => {
    if (!isBibleStudiesDialogOpen) {
      fetchEstudos()
    }
  }, [isBibleStudiesDialogOpen])

  const currentMonthEntries = entries

  const totalHours = currentMonthEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const remainingHours = Math.max(0, 30 - totalHours)

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleAddEntry = async (entry: Omit<HourEntry, "id">) => {
    try {
      const dataRegistro = new Date(entry.date).toISOString().split("T")[0]

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
    }
  }

  const handleEditEntry = async (id: string, entry: Omit<HourEntry, "id">) => {
    try {
      const dataRegistro = new Date(entry.date).toISOString().split("T")[0]

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
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/horas?id=${id}&usuarioId=${usuario.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setEntries(entries.filter((entry) => entry.id !== id))
      }
    } catch (error) {
      console.error("Erro ao deletar horas:", error)
    }
  }

  const handleOpenEditDialog = (entry: HourEntry) => {
    setEditingEntry(entry)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingEntry(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-sky-50 pb-6">
      <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200 relative overflow-hidden shadow-md">
            <div className="absolute top-2 right-2 opacity-10">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-xs text-rose-700 font-medium">Total de Horas</p>
              <p className="text-2xl md:text-3xl font-bold text-rose-900">{totalHours.toFixed(2)}h</p>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-sky-100 to-blue-100 border-blue-200 relative overflow-hidden shadow-md">
            <div className="absolute top-2 right-2 opacity-10">
              <Users className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-xs text-blue-700 font-medium">Faltam</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">{remainingHours.toFixed(2)}h</p>
              <p className="text-[10px] text-blue-600">Meta: 30 horas/mês</p>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 relative overflow-hidden shadow-md col-span-2 md:col-span-1">
            <div className="absolute top-2 right-2 opacity-10">
              <BookHeart className="w-12 h-12 md:w-16 md:h-16 text-purple-500" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-xs text-purple-700 font-medium">Estudos Bíblicos</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-900">{bibleStudiesCount}</p>
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
              {monthNames[currentMonth]}/{currentYear}
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
        <div className="flex justify-center gap-3 flex-wrap">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md px-6 py-5 text-base"
          >
            <Plus className="w-5 h-5" />
            Adicionar Horas
          </Button>
          <Button
            onClick={() => setIsBibleStudiesDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md px-6 py-5 text-base"
          >
            <BookHeart className="w-5 h-5" />
            Estudos Bíblicos
          </Button>
        </div>

        {/* Hours Grid */}
        <HoursGrid entries={currentMonthEntries} onDelete={handleDeleteEntry} onEdit={handleOpenEditDialog} />

        {/* Dialogs */}
        <AddHoursDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
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
      </div>
    </div>
  )
}
