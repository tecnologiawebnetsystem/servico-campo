/**
 * Converte string "1,30" para minutos totais (90)
 */
export function hoursStringToMinutes(hoursStr: string): number {
  const normalized = hoursStr.replace(",", ".")
  const parts = normalized.split(".")
  const hours = Number.parseInt(parts[0]) || 0
  const minutes = Number.parseInt(parts[1]?.padEnd(2, "0") || "0")

  if (minutes >= 60) {
    throw new Error("Minutos não podem ser 60 ou mais")
  }

  return hours * 60 + minutes
}

/**
 * Converte minutos totais (90) para string "1,30"
 */
export function minutesToHoursString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours},${minutes.toString().padStart(2, "0")}`
}

/**
 * Converte minutos totais (90) para número decimal (1.5) para o banco
 */
export function minutesToDecimal(totalMinutes: number): number {
  return totalMinutes / 60
}

/**
 * Converte número decimal do banco (1.5) para minutos totais (90)
 */
export function decimalToMinutes(decimal: number): number {
  return Math.round(decimal * 60)
}

/**
 * Soma horas no formato horas:minutos
 * Exemplo: "1,30" + "0,45" = "2,15"
 */
export function addHours(hours1: string, hours2: string): string {
  const minutes1 = hoursStringToMinutes(hours1)
  const minutes2 = hoursStringToMinutes(hours2)
  return minutesToHoursString(minutes1 + minutes2)
}

/**
 * Valida se o formato está correto (minutos < 60)
 */
export function validateHoursFormat(hoursStr: string): boolean {
  try {
    const normalized = hoursStr.replace(",", ".")
    const parts = normalized.split(".")

    if (parts.length > 2) return false

    const hours = Number.parseInt(parts[0])
    const minutes = parts[1] ? Number.parseInt(parts[1].padEnd(2, "0")) : 0

    if (isNaN(hours) || isNaN(minutes)) return false
    if (hours < 0 || minutes < 0) return false
    if (minutes >= 60) return false

    return true
  } catch {
    return false
  }
}

/**
 * Formata para exibição: "1,30" vira "1h30" ou "1:30"
 */
export function formatHoursDisplay(hoursStr: string): string {
  try {
    const minutes = hoursStringToMinutes(hoursStr)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (mins === 0) return `${hours}h`
    return `${hours}h${mins.toString().padStart(2, "0")}`
  } catch {
    return hoursStr
  }
}
