// Registro do Service Worker
export function registerServiceWorker() {
  if (typeof window === "undefined") return

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Registrado com sucesso:", registration.scope)

          // Verifica por atualizações periodicamente
          setInterval(() => {
            registration.update()
          }, 60000) // A cada 1 minuto
        })
        .catch((error) => {
          console.error("[SW] Falha ao registrar:", error)
        })
    })
  }
}

// Solicita permissão para notificações (opcional)
export async function requestNotificationPermission() {
  if (typeof window === "undefined") return false

  if ("Notification" in window && navigator.serviceWorker) {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }
  return false
}
