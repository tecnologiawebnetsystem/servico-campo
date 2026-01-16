"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface StopwatchProps {
  usuarioId: number
}

export default function Stopwatch({ usuarioId }: StopwatchProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  const STORAGE_KEY = `stopwatch_${usuarioId}`

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const {
          startTime: savedStartTime,
          isRunning: savedIsRunning,
          elapsedTime: savedElapsed,
        } = JSON.parse(savedData)

        if (savedIsRunning && savedStartTime) {
          const now = Date.now()
          const totalElapsed = savedElapsed + (now - savedStartTime)
          setElapsedTime(totalElapsed)
          setStartTime(now)
          setIsRunning(true)
        } else {
          setElapsedTime(savedElapsed || 0)
          setIsRunning(false)
        }
      } catch (error) {
        console.error("Erro ao carregar cronômetro:", error)
      }
    }
  }, [STORAGE_KEY])

  const saveState = useCallback(
    (running: boolean, elapsed: number, start: number | null) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isRunning: running,
          elapsedTime: elapsed,
          startTime: start,
        }),
      )
    },
    [STORAGE_KEY],
  )

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        if (startTime) {
          const now = Date.now()
          const newElapsed = elapsedTime + (now - startTime)
          setElapsedTime(newElapsed)
          setStartTime(now)
          saveState(true, newElapsed, now)
        }
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning, startTime, elapsedTime, saveState])

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false)
      saveState(false, elapsedTime, null)
    } else {
      const now = Date.now()
      setStartTime(now)
      setIsRunning(true)
      saveState(true, elapsedTime, now)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setElapsedTime(0)
    setStartTime(null)
    saveState(false, 0, null)
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    }
  }

  const time = formatTime(elapsedTime)

  return (
    <div className="relative">
      <p className="text-xs text-emerald-700 font-medium mb-1">Cronômetro</p>

      {/* Display do tempo */}
      <div className="flex items-baseline gap-0.5 font-mono mb-2">
        <span className="text-2xl md:text-3xl font-bold text-emerald-900">{time.hours}</span>
        <span className="text-sm text-emerald-600">h</span>
        <span className="text-2xl md:text-3xl font-bold text-emerald-900">{time.minutes}</span>
        <span className="text-sm text-emerald-600">m</span>
        <span className="text-2xl md:text-3xl font-bold text-emerald-900">{time.seconds}</span>
        <span className="text-sm text-emerald-600">s</span>
      </div>

      {/* Status animado */}
      {isRunning && (
        <div className="flex items-center gap-1 text-emerald-600 text-xs mb-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span>Contando...</span>
        </div>
      )}

      {!isRunning && elapsedTime === 0 && <p className="text-xs text-emerald-600 mb-2">Clique para iniciar</p>}

      {!isRunning && elapsedTime > 0 && <p className="text-xs text-emerald-600 mb-2">Pausado</p>}

      {/* Botões compactos */}
      <div className="flex gap-2">
        <Button
          onClick={handleStartStop}
          size="sm"
          className={`h-7 px-2 text-xs shadow-sm ${
            isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
          } text-white`}
        >
          {isRunning ? (
            <>
              <Pause className="h-3 w-3 mr-1" />
              Parar
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Iniciar
            </>
          )}
        </Button>

        <Button
          onClick={handleReset}
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
          disabled={elapsedTime === 0}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
