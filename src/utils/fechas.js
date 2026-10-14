// Utilidades de fechas. Todas las fechas se manejan como texto AAAA-MM-DD.

// Fecha de hoy en formato AAAA-MM-DD usando la hora LOCAL (no UTC)
export const fechaHoy = () => {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// Días entre dos fechas AAAA-MM-DD. Se usa Date.UTC para que el horario
// de verano o la zona horaria no alteren el resultado.
export const diasEntre = (inicio, fin) => {
  const [a1, m1, d1] = inicio.split('-').map(Number)
  const [a2, m2, d2] = fin.split('-').map(Number)
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000)
}