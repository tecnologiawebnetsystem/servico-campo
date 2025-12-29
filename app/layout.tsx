import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Serviço de Campo - Registro de Horas",
  description: "Sistema de cadastro de horas de serviço de campo e estudos bíblicos",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Serviço Campo",
  },
  icons: {
    icon: [
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/icon-192.jpg" }],
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ec4899",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icon-192.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registrado:', registration.scope);
                    })
                    .catch((error) => {
                      console.log('Falha ao registrar SW:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
