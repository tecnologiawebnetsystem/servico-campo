// Sistema de sincronização offline
interface OfflineAction {
  id: string
  type: "ADD_HORA" | "UPDATE_HORA" | "DELETE_HORA" | "UPDATE_ESTUDOS" | "ADD_CARTA" | "DELETE_CARTA"
  data: any
  timestamp: number
}

const OFFLINE_QUEUE_KEY = "offline_actions_queue"
const OFFLINE_DATA_KEY = "offline_data"

// Verifica se está online
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true
}

// Adiciona ação à fila offline
export function addOfflineAction(type: OfflineAction["type"], data: any) {
  const queue = getOfflineQueue()
  const action: OfflineAction = {
    id: `${Date.now()}_${Math.random()}`,
    type,
    data,
    timestamp: Date.now(),
  }
  queue.push(action)
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
}

// Obtém fila de ações offline
export function getOfflineQueue(): OfflineAction[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(OFFLINE_QUEUE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Limpa fila após sincronização
export function clearOfflineQueue() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(OFFLINE_QUEUE_KEY)
  }
}

// Sincroniza ações offline com o servidor
export async function syncOfflineData(usuarioId: number): Promise<boolean> {
  if (!isOnline()) return false

  const queue = getOfflineQueue()
  if (queue.length === 0) return true

  try {
    for (const action of queue) {
      switch (action.type) {
        case "ADD_HORA":
          await fetch("/api/horas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...action.data, usuarioId }),
          })
          break

        case "UPDATE_HORA":
          await fetch("/api/horas", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...action.data, usuarioId }),
          })
          break

        case "DELETE_HORA":
          await fetch("/api/horas", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: action.data.id, usuarioId }),
          })
          break

        case "UPDATE_ESTUDOS":
          await fetch("/api/estudos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...action.data, usuarioId }),
          })
          break

        case "ADD_CARTA":
          await fetch("/api/cartas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...action.data, usuarioId }),
          })
          break

        case "DELETE_CARTA":
          await fetch("/api/cartas", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: action.data.id, usuarioId }),
          })
          break
      }
    }

    clearOfflineQueue()
    return true
  } catch (error) {
    console.error("Erro ao sincronizar dados offline:", error)
    return false
  }
}

// Salva dados localmente (modo offline)
export function saveOfflineData(key: string, data: any) {
  if (typeof window !== "undefined") {
    const offlineData = getOfflineData()
    offlineData[key] = data
    localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData))
  }
}

// Obtém dados locais (modo offline)
export function getOfflineData(): Record<string, any> {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem(OFFLINE_DATA_KEY)
  return stored ? JSON.parse(stored) : {}
}

// Hook para monitorar status online/offline
export function setupOnlineListener(onStatusChange: (online: boolean) => void) {
  if (typeof window === "undefined") return

  const handleOnline = () => onStatusChange(true)
  const handleOffline = () => onStatusChange(false)

  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)

  return () => {
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("offline", handleOffline)
  }
}
