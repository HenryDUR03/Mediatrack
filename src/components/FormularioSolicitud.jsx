import { useState } from 'react'

const formVacio = {
  solicitante: '',
  tipoUsuario: '',
  codigoEquipo: '',
  fechaPrestamo: '',
  fechaPrevista: '',
}

// Formulario para registrar una solicitud de préstamo.
// Valida los campos y le avisa a App con onRegistrar.
function FormularioSolicitud({ equiposDisponibles, onRegistrar }) {
  const [form, setForm] = useState(formVacio)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null) // { tipo: 'exito' | 'error', texto }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setMensaje(null)
  }

  // Validaciones: campos completos y fecha prevista no anterior a la de préstamo
  const validar = () => {
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

  const manejarEnvio = (e) => {
    e.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const resultado = onRegistrar({ ...form, solicitante: form.solicitante.trim() })
    if (resultado.ok) {
      setMensaje({ tipo: 'exito', texto: `Solicitud ${resultado.id} registrada correctamente.` })
      setForm(formVacio)
    } else {
      setMensaje({ tipo: 'error', texto: resultado.error })
    }
  }

  // Cancelar o limpiar el formulario
  const limpiar = () => {
    setForm(formVacio)
    setErrores({})
    setMensaje(null)
  }

  return (
    <section className="panel">
      <h2>Nueva solicitud de préstamo</h2>
      <form onSubmit={manejarEnvio} noValidate className="formulario">
        <label>
          Solicitante
          <input name="solicitante" value={form.solicitante} onChange={manejarCambio} />
          {errores.solicitante && <span className="error">{errores.solicitante}</span>}
        </label>

        <label>
          Tipo de usuario
          <select name="tipoUsuario" value={form.tipoUsuario} onChange={manejarCambio}>
            <option value="">Selecciona...</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Docente">Docente</option>
          </select>
          {errores.tipoUsuario && <span className="error">{errores.tipoUsuario}</span>}
        </label>

        <label>
          Equipo
          <select name="codigoEquipo" value={form.codigoEquipo} onChange={manejarCambio}>
            <option value="">Selecciona...</option>
            {equiposDisponibles.map((eq) => (
              <option key={eq.codigo} value={eq.codigo}>
                {eq.codigo} - {eq.nombre}
              </option>
            ))}
          </select>
          {errores.codigoEquipo && <span className="error">{errores.codigoEquipo}</span>}
        </label>

        <label>
          Fecha de préstamo
          <input type="date" name="fechaPrestamo" value={form.fechaPrestamo} onChange={manejarCambio} />
          {errores.fechaPrestamo && <span className="error">{errores.fechaPrestamo}</span>}
        </label>

        <label>
          Fecha prevista de devolución
          <input type="date" name="fechaPrevista" value={form.fechaPrevista} onChange={manejarCambio} />
          {errores.fechaPrevista && <span className="error">{errores.fechaPrevista}</span>}
        </label>

        <div className="acciones">
          <button type="submit" className="btn btn-primario">Registrar solicitud</button>
          <button type="button" className="btn" onClick={limpiar}>Limpiar formulario</button>
        </div>
      </form>

      {mensaje && <p className={`mensaje mensaje-${mensaje.tipo}`}>{mensaje.texto}</p>}
    </section>
  )
}

export default FormularioSolicitud