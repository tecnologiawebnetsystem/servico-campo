import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Usuario {
  id: number
  nome: string
  pin: string
  created_at: string
}

export interface RegistroHoras {
  id: number
  usuario_id: number
  data: string
  quantidade_horas: number
  modalidade: string
  mes: number
  ano: number
  created_at: string
}

export interface EstudoBiblico {
  id: number
  usuario_id: number
  mes: number
  ano: number
  quantidade: number
  updated_at: string
}

export interface Carta {
  id: number
  usuario_id: number
  titulo: string
  texto: string
  created_at: string
  updated_at: string
}

export interface Anotacao {
  id: number
  usuario_id: number
  titulo: string
  descricao: string
  data_criacao: string
}

// Funções de autenticação
export async function loginUsuario(pin: string): Promise<Usuario | null> {
  const usuarios = await sql`
    SELECT * FROM usuarios WHERE pin = ${pin} LIMIT 1
  `
  return usuarios[0] || null
}

// Funções de registro de horas
export async function getRegistroHoras(usuarioId: number, mes: number, ano: number): Promise<RegistroHoras[]> {
  const registros = await sql`
    SELECT * FROM registro_horas 
    WHERE usuario_id = ${usuarioId} 
      AND mes = ${mes} 
      AND ano = ${ano}
    ORDER BY data ASC, created_at DESC
  `
  return registros as RegistroHoras[]
}

export async function insertRegistroHoras(
  usuarioId: number,
  data: string,
  mes: number,
  ano: number,
  quantidadeHoras: number,
  modalidade: string,
): Promise<RegistroHoras> {
  const registros = await sql`
    INSERT INTO registro_horas (usuario_id, data, mes, ano, quantidade_horas, modalidade)
    VALUES (${usuarioId}, ${data}, ${mes}, ${ano}, ${quantidadeHoras}, ${modalidade})
    RETURNING *
  `
  return registros[0] as RegistroHoras
}

export async function updateRegistroHoras(
  id: number,
  usuarioId: number,
  data: string,
  mes: number,
  ano: number,
  quantidadeHoras: number,
  modalidade: string,
): Promise<RegistroHoras> {
  const registros = await sql`
    UPDATE registro_horas 
    SET data = ${data}, mes = ${mes}, ano = ${ano}, quantidade_horas = ${quantidadeHoras}, modalidade = ${modalidade}
    WHERE id = ${id} AND usuario_id = ${usuarioId}
    RETURNING *
  `
  return registros[0] as RegistroHoras
}

export async function deleteRegistroHoras(id: number, usuarioId: number): Promise<void> {
  await sql`
    DELETE FROM registro_horas 
    WHERE id = ${id} AND usuario_id = ${usuarioId}
  `
}

// Funções de estudos bíblicos
export async function getEstudoBiblico(usuarioId: number, mes: number, ano: number): Promise<number> {
  const estudos = await sql`
    SELECT quantidade FROM estudos_biblicos 
    WHERE usuario_id = ${usuarioId} 
      AND mes = ${mes} 
      AND ano = ${ano}
    LIMIT 1
  `
  return estudos[0]?.quantidade || 0
}

export async function updateEstudoBiblico(
  usuarioId: number,
  mes: number,
  ano: number,
  quantidade: number,
): Promise<void> {
  await sql`
    INSERT INTO estudos_biblicos (usuario_id, mes, ano, quantidade, updated_at)
    VALUES (${usuarioId}, ${mes}, ${ano}, ${quantidade}, CURRENT_TIMESTAMP)
    ON CONFLICT (usuario_id, mes, ano) 
    DO UPDATE SET quantidade = ${quantidade}, updated_at = CURRENT_TIMESTAMP
  `
}

// Funções de cartas
export async function getCartas(usuarioId: number): Promise<Carta[]> {
  const cartas = await sql`
    SELECT * FROM cartas 
    WHERE usuario_id = ${usuarioId}
    ORDER BY created_at DESC
  `
  return cartas as Carta[]
}

export async function insertCarta(usuarioId: number, titulo: string, texto: string): Promise<Carta> {
  const cartas = await sql`
    INSERT INTO cartas (usuario_id, titulo, texto)
    VALUES (${usuarioId}, ${titulo}, ${texto})
    RETURNING *
  `
  return cartas[0] as Carta
}

export async function deleteCarta(id: number, usuarioId: number): Promise<void> {
  await sql`
    DELETE FROM cartas 
    WHERE id = ${id} AND usuario_id = ${usuarioId}
  `
}

export async function updateCarta(id: number, usuarioId: number, titulo: string, texto: string): Promise<Carta> {
  const cartas = await sql`
    UPDATE cartas 
    SET titulo = ${titulo}, texto = ${texto}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND usuario_id = ${usuarioId}
    RETURNING *
  `
  return cartas[0] as Carta
}

export async function getCartaById(id: number, usuarioId: number): Promise<Carta | null> {
  const cartas = await sql`
    SELECT * FROM cartas 
    WHERE id = ${id} AND usuario_id = ${usuarioId}
    LIMIT 1
  `
  return (cartas[0] as Carta) || null
}

// Funções de anotações
export async function getAnotacoes(usuarioId: number): Promise<Anotacao[]> {
  const anotacoes = await sql`
    SELECT * FROM anotacoes 
    WHERE usuario_id = ${usuarioId}
    ORDER BY data_criacao DESC
  `
  return anotacoes as Anotacao[]
}

export async function insertAnotacao(usuarioId: number, titulo: string, descricao: string): Promise<Anotacao> {
  const anotacoes = await sql`
    INSERT INTO anotacoes (usuario_id, titulo, descricao)
    VALUES (${usuarioId}, ${titulo}, ${descricao})
    RETURNING *
  `
  return anotacoes[0] as Anotacao
}

export async function deleteAnotacao(id: number, usuarioId: number): Promise<void> {
  await sql`
    DELETE FROM anotacoes 
    WHERE id = ${id} AND usuario_id = ${usuarioId}
  `
}

export async function getAnotacaoById(id: number, usuarioId: number): Promise<Anotacao | null> {
  const anotacoes = await sql`
    SELECT * FROM anotacoes 
    WHERE id = ${id} AND usuario_id = ${usuarioId}
    LIMIT 1
  `
  return (anotacoes[0] as Anotacao) || null
}
