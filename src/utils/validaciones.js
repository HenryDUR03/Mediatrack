import { LIMITES_PRESTAMO } from '../config'
import { diasEntre } from './fechas'

// Valida los campos del formulario. Devuelve un objeto con un mensaje por campo
// con error (vacío si todo está bien).
export const validarFormularioSolicitud = (form) => {
  const e = {}
  if (form.solicitante.trim() === '') e.solicitante = 'El nombre del solicitante es obligatorio.'
  if (form.tipoUsuario === '') e.tipoUsuario = 'Selecciona el tipo de usuario.'
  if (form.codigoEquipo === '') e.codigoEquipo = 'Selecciona un equipo.'
  if (form.fechaPrestamo === '') e.fechaPrestamo = 'La fecha de préstamo es obligatoria.'
  if (form.fechaPrevista === '') {
    e.fechaPrevista = 'La fecha prevista de devolución es obligatoria.'
  } else if (form.fechaPrestamo !== '' && form.fechaPrevista < form.fechaPrestamo) {
    e.fechaPrevista = 'La fecha de devolución no puede ser anterior a la de préstamo.'
  }
  return e
}

// Valida las reglas de préstamo: equipo existente y Disponible, sin solicitud
// activa y duración dentro del límite del tipo de usuario.
// Devuelve { ok: true } o { ok: false, error }.
export const validarReglasPrestamo = (datos, equipos, solicitudes) => {
  const equipo = equipos.find((e) => e.codigo === datos.codigoEquipo)

  if (!equipo) {
    return { ok: false, error: 'El equipo seleccionado no existe.' }
  }
  if (equipo.estado !== 'Disponible') {
    return { ok: false, error: `El equipo ${equipo.codigo} no está disponible (${equipo.estado}).` }
  }
  const yaPrestado = solicitudes.some(
    (s) => s.codigoEquipo === equipo.codigo && s.estado === 'Activo',
  )
  if (yaPrestado) {
    return { ok: false, error: `El equipo ${equipo.codigo} ya tiene una solicitud activa.` }
  }

  const limite = LIMITES_PRESTAMO[datos.tipoUsuario]
  if (limite === undefined) {
    return { ok: false, error: 'El tipo de usuario no es válido.' }
  }
  const dias = diasEntre(datos.fechaPrestamo, datos.fechaPrevista)
  if (dias > limite) {
    return {
      ok: false,
      error: `El plazo máximo para ${datos.tipoUsuario} es de ${limite} días. La solicitud pide ${dias} días.`,
    }
  }

  return { ok: true }
}