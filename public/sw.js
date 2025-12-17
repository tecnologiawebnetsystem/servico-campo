// Service Worker para PWA
const CACHE_NAME = "servico-campo-v1"
const urlsToCache = ["/", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg", "/apple-icon.png"]

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cache aberto")
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Removendo cache antigo:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Interceptação de requisições
self.addEventListener("fetch", (event) => {
  // Apenas cachear requisições GET
  if (event.request.method !== "GET") return

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Retorna do cache se disponível
        if (response) {
          return response
        }

        // Caso contrário, faz a requisição à rede
        return fetch(event.request).then((response) => {
          // Verifica se é uma resposta válida
          if (!response || response.status !== 200 || response.type === "error") {
            return response
          }

          // Clona a resposta
          const responseToCache = response.clone()

          // Adiciona ao cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      })
      .catch(() => {
        // Retorna página offline se necessário
        return caches.match("/")
      }),
  )
})

// Sincronização em background
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-data") {
    event.waitUntil(
      // Aqui você pode adicionar lógica de sincronização
      console.log("[SW] Sincronizando dados offline"),
    )
  }
})
