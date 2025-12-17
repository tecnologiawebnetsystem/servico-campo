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

  useEffect(() => {
    if (editingEntry && open) {
      setSelectedDate(new Date(editingEntry.date))
      setHours(editingEntry.hours.toString().replace(".", ","))
      setType(editingEntry.type)
    } else if (open) {
      setSelectedDate(new Date(currentYear, currentMonth, 1))
      setHours("")
      setType("Pregação")
    }
  }, [editingEntry, open, currentMonth, currentYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !hours) return

    const hoursStr = hours.replace(",", ".")
    const hoursNum = Number.parseFloat(hoursStr)
    if (hoursNum <= 0 || isNaN(hoursNum)) return

    const entryData = {
      day: selectedDate.getDate(),
      hours: hoursNum,
      type,
      date: selectedDate.toISOString(),
    }

    if (editingEntry && onEdit) {
      onEdit(editingEntry.id, entryData)
    } else {
      onAdd(entryData)
    }

    // Reset form
    setSelectedDate(new Date(currentYear, currentMonth, 1))
    setHours("")
    setType("Pregação")
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
                  month={new Date(currentYear, currentMonth)}
                  onMonthChange={(date) => {
                    setSelectedDate(date)
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
                placeholder="Ex: 1,3 ou 1,48"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
                required
              />
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
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
              {editingEntry ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
