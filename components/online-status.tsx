"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { isOnline, syncOfflineData, getOfflineQueue, setupOnlineListener } from "@/lib/offline-sync"

interface OnlineStatusProps {
  usuarioId: number
  onSyncComplete?: () => void
}

export default function OnlineStatus({ usuarioId, onSyncComplete }: OnlineStatusProps) {
  const [online, setOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [pendingActions, setPendingActions] = useState(0)

  useEffect(() => {
    setOnline(isOnline())
    setPendingActions(getOfflineQueue().length)

    const cleanup = setupOnlineListener((isOnlineNow) => {
      setOnline(isOnlineNow)
      if (isOnlineNow) {
        handleSync()
      }
    })

    return cleanup
  }, [])

  const handleSync = async () => {
    if (!online) return

    setSyncing(true)
    const success = await syncOfflineData(usuarioId)
    setSyncing(false)

    if (success) {
      setPendingActions(0)
      onSyncComplete?.()
    }
  }

  return (
    <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 shadow-lg">
      {/* Status Indicator */}
      <div className="flex items-center gap-2 min-w-[90px]">
        {online ? (
          <>
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold text-sm">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm">Offline</span>
          </>
        )}
      </div>

      {/* Sync Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSync}
        disabled={!online || syncing || pendingActions === 0}
        className="h-8 gap-2 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
        <span className="font-semibold text-sm">Sincronizar {pendingActions > 0 && `(${pendingActions})`}</span>
      </Button>
    </div>
  )
}
