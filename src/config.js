// Configuración de las reglas de negocio.
// Para cambiar un plazo, se modifica aquí y no en los componentes.

// Duración máxima del préstamo en días, contada desde la fecha de préstamo
// (inclusive: un préstamo el día 10 con límite de 3 días vence como máximo el día 13).
export const LIMITES_PRESTAMO = {
  Estudiante: 3,
  Docente: 7,
}