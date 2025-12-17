"use client"

import { useState, useEffect } from "react"
import PinLogin from "@/components/pin-login"
import Dashboard from "@/components/dashboard"

interface Usuario {
  id: number
  nome: string
}

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem("usuario")
    if (usuarioArmazenado) {
      setUsuario(JSON.parse(usuarioArmazenado))
    }
  }, [])

  const handleLogin = (usuarioLogado: Usuario) => {
    setUsuario(usuarioLogado)
    localStorage.setItem("usuario", JSON.stringify(usuarioLogado))
  }

  const handleLogout = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }

  if (!usuario) {
    return <PinLogin onLogin={handleLogin} />
  }

  return <Dashboard onLogout={handleLogout} usuario={usuario} />
}
