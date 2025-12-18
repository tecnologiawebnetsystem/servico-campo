"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import type { HourEntry } from "./dashboard"
import {
  validateHoursFormat,
  hoursStringToMinutes,
  minutesToDecimal,
  decimalToMinutes,
  minutesToHoursString,
} from "@/lib/time-utils"

interface AddHoursDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (entry: Omit<HourEntry, "id">) => void
  onEdit?: (id: string, entry: Omit<HourEntry, "id">) => void
  editingEntry?: HourEntry | null
  currentMonth: number
  currentYear: number
}

export default function AddHoursDialog({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  editingEntry,
  currentMonth,
  currentYear,
}: AddHoursDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(currentYear, currentMonth, 1))
  const [hours, setHours] = useState("")
  const [type, setType] = useState<HourEntry["type"]>("Pregação")
  const [error, setError] = useState("")
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(currentYear, currentMonth, 1))

  useEffect(() => {
    if (editingEntry && open) {
      const entryDate = new Date(editingEntry.date)
      setSelectedDate(entryDate)
      setCalendarMonth(entryDate)
      const totalMinutes = decimalToMinutes(editingEntry.hours)
      const hoursStr = minutesToHoursString(totalMinutes)
      setHours(hoursStr)
      setType(editingEntry.type)
    } else if (open) {
      const newDate = new Date(currentYear, currentMonth, 1)
      setSelectedDate(newDate)
      setCalendarMonth(newDate)
      setHours("")
      setType("Pregação")
      setError("")
    }
  }, [editingEntry, open, currentMonth, currentYear])

  const handleHoursChange = (value: string) => {
    setHours(value)
    setError("")

    if (value && !validateHoursFormat(value)) {
      setError("Formato inválido. Use: 1,30 (1h30min) ou 2,45 (2h45min). Minutos não podem passar de 59.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !hours) return

    if (!validateHoursFormat(hours)) {
      setError("Formato de horas inválido")
      return
    }

    const totalMinutes = hoursStringToMinutes(hours)
    const hoursDecimal = minutesToDecimal(totalMinutes)

    if (hoursDecimal <= 0) {
      setError("Horas devem ser maior que zero")
      return
    }

    const entryData = {
      day: selectedDate.getDate(),
      hours: hoursDecimal,
      type,
      date: selectedDate.toISOString(),
    }

    if (editingEntry && onEdit) {
      onEdit(editingEntry.id, entryData)
    } else {
      onAdd(entryData)
    }

    const resetDate = new Date(currentYear, currentMonth, 1)
    setSelectedDate(resetDate)
    setCalendarMonth(resetDate)
    setHours("")
    setType("Pregação")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{editingEntry ? "Editar Horas" : "Adicionar Horas"}</DialogTitle>
          <DialogDescription className="text-gray-600">Registre suas horas de serviço de campo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-gray-700">
                Dia do Mês
              </Label>
              <div className="flex justify-center border border-gray-200 rounded-lg p-3 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={calendarMonth}
                  onMonthChange={(date) => {
                    setCalendarMonth(date)
                    if (!selectedDate) {
                      setSelectedDate(date)
                    }
                  }}
                  className="rounded-md"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hours" className="text-gray-700">
                Quantidade de Horas
              </Label>
              <Input
                id="hours"
                type="text"
                placeholder="Ex: 1,30 (1h30min) ou 2,15 (2h15min)"
                value={hours}
                onChange={(e) => handleHoursChange(e.target.value)}
                className={`bg-white border-gray-300 text-gray-900 ${error ? "border-red-500" : ""}`}
                required
              />
              <p className="text-xs text-gray-500">Use vírgula para separar horas e minutos. Minutos vão de 0 a 59.</p>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-gray-700">
                Modalidade
              </Label>
              <Select value={type} onValueChange={(value) => setType(value as HourEntry["type"])}>
                <SelectTrigger id="type" className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Pregação">Pregação</SelectItem>
                  <SelectItem value="Cartas">Cartas</SelectItem>
                  <SelectItem value="Ligação">Ligação</SelectItem>
                  <SelectItem value="Estudo">Estudo</SelectItem>
                  <SelectItem value="TPE">TPE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white" disabled={!!error}>
              {editingEntry ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
