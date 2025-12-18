"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from "lucide-react"
import type { HourEntry } from "./dashboard"
import { decimalToMinutes, minutesToHoursString } from "@/lib/time-utils"

interface HoursGridProps {
  entries: HourEntry[]
  onDelete: (id: string) => void
  onEdit: (entry: HourEntry) => void
}

const typeColors = {
  Pregação: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Cartas: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Ligação: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Estudo: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  TPE: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
}

export default function HoursGrid({ entries, onDelete, onEdit }: HoursGridProps) {
  const sortedEntries = [...entries].sort((a, b) => a.day - b.day)

  if (sortedEntries.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Nenhuma hora registrada ainda</p>
          <p className="text-sm text-muted-foreground">Clique em "Adicionar Horas" para começar</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Horas Registradas</h3>
      <div className="grid gap-3">
        {sortedEntries.map((entry) => {
          const totalMinutes = decimalToMinutes(entry.hours)
          const hoursStr = minutesToHoursString(totalMinutes)
          const hours = Math.floor(totalMinutes / 60)
          const minutes = totalMinutes % 60
          const displayText = minutes > 0 ? `${hours}h${minutes.toString().padStart(2, "0")}` : `${hours}h`

          return (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{entry.day}</div>
                    <div className="text-xs text-muted-foreground">Dia</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[entry.type]}`}>
                        {entry.type}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{displayText}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(entry)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
