import { contarAtrasados } from './atrasos'

// Calcula los indicadores del resumen a partir del estado actual.
export const calcularIndicadores = (equipos, solicitudes, hoy) => ({
  total: equipos.length,
  disponibles: equipos.filter((e) => e.estado === 'Disponible').length,
  prestados: equipos.filter((e) => e.estado === 'Prestado').length,
  mantenimiento: equipos.filter((e) => e.estado === 'Mantenimiento').length,
  atrasados: contarAtrasados(solicitudes, hoy),
})