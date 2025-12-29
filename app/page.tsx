"use client"

import { useState, useEffect } from "react"
import PinLogin from "@/components/pin-login"
import Dashboard from "@/components/dashboard"
import { registerServiceWorker } from "@/lib/register-sw"

interface Usuario {
  id: number
  nome: string
}

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loginKey, setLoginKey] = useState(0)

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem("usuario")
    if (usuarioArmazenado) {
      setUsuario(JSON.parse(usuarioArmazenado))
    }

    registerServiceWorker()
  }, [])

  const handleLogin = (usuarioLogado: Usuario) => {
    setUsuario(usuarioLogado)
    localStorage.setItem("usuario", JSON.stringify(usuarioLogado))
    setLoginKey((prev) => prev + 1)
  }

  const handleLogout = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
    setLoginKey(0)
  }

  if (!usuario) {
    return <PinLogin onLogin={handleLogin} />
  }

  return <Dashboard key={loginKey} onLogout={handleLogout} usuario={usuario} />
}
