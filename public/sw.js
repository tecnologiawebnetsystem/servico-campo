const CACHE_NAME = "servico-campo-v2"
const STATIC_CACHE = "servico-campo-static-v2"
const DYNAMIC_CACHE = "servico-campo-dynamic-v2"

const urlsToCache = [
  "/",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
  "/apple-icon.png",
  "/dashboard",
  "/cartas",
  "/offline",
]

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando Service Worker...")
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Cache estático aberto")
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("[SW] Erro ao cachear recursos:", err)
      })
    }),
  )
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Ativando Service Worker...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
            console.log("[SW] Removendo cache antigo:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignora requisições não-GET e de outros domínios
  if (request.method !== "GET" || url.origin !== location.origin) {
    return
  }

  // Estratégia para APIs: Network First
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clona e cacheia a resposta
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Se falhar, tenta buscar do cache
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached
            }
            // Retorna resposta offline para APIs
            return new Response(JSON.stringify({ error: "Offline", message: "Você está offline" }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            })
          })
        }),
    )
    return
  }

  // Estratégia para páginas e recursos estáticos: Cache First com Network Fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Retorna do cache e atualiza em background
        fetch(request)
          .then((response) => {
            if (response.ok) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, response)
              })
            }
          })
          .catch(() => {})
        return cached
      }

      // Se não está no cache, busca da rede
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "error") {
            return response
          }

          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(() => {
          // Se tudo falhar, retorna página offline
          return caches.match("/offline").then((offline) => {
            return offline || caches.match("/")
          })
        })
    }),
  )
})

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-data") {
    event.waitUntil(
      syncOfflineData().catch((err) => {
        console.error("[SW] Erro ao sincronizar:", err)
      }),
    )
  }
})

// Função para sincronizar dados offline
async function syncOfflineData() {
  console.log("[SW] Sincronizando dados offline...")
  // Aqui você pode adicionar lógica específica de sincronização
  // Por exemplo, enviar dados armazenados no IndexedDB
  return Promise.resolve()
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }),
    )
  }
})
