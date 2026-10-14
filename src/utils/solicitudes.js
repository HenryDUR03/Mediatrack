// Genera el siguiente ID consecutivo: SOL-001, SOL-002...
export const generarIdSolicitud = (solicitudes) => {
  const numeros = solicitudes.map((s) => Number(s.id.replace('SOL-', '')))
  const siguiente = numeros.length ? Math.max(...numeros) + 1 : 1
  return `SOL-${String(siguiente).padStart(3, '0')}`
}