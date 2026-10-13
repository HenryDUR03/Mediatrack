// Muestra las solicitudes, resalta las atrasadas y permite registrar devoluciones.
// La lógica (qué pasa al devolver) vive en App; aquí solo se pide confirmación.
function ListaPrestamos({ solicitudes, equipos, hoy, onDevolver }) {
  const nombreEquipo = (codigo) => {
    const equipo = equipos.find((e) => e.codigo === codigo)
    return equipo ? equipo.nombre : codigo
  }

  // Una solicitud está atrasada si sigue Activa y su fecha prevista es anterior a hoy
  const esAtrasada = (s) => s.estado === 'Activo' && s.fechaPrevista < hoy

  const confirmarDevolucion = (s, aMantenimiento) => {
    const destino = aMantenimiento ? 'enviará a Mantenimiento' : 'dejará Disponible'
    const ok = window.confirm(
      `¿Registrar la devolución de ${s.codigoEquipo}? El equipo se ${destino}. Esta acción no se puede deshacer.`,
    )
    if (ok) onDevolver(s.id, aMantenimiento)
  }

  return (
    <section>
      <h2>Préstamos</h2>
      {solicitudes.length === 0 ? (
        <p className="vacio">No hay solicitudes registradas.</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Solicitante</th>
              <th>Tipo</th>
              <th>Equipo</th>
              <th>Préstamo</th>
              <th>Fecha prevista</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id} className={esAtrasada(s) ? 'fila-atrasada' : ''}>
                <td>{s.id}</td>
                <td>{s.solicitante}</td>
                <td>{s.tipoUsuario}</td>
                <td>
                  {s.codigoEquipo} - {nombreEquipo(s.codigoEquipo)}
                </td>
                <td>{s.fechaPrestamo}</td>
                <td>{s.fechaPrevista}</td>
                <td>
                  <span className={`estado estado-${s.estado.toLowerCase()}`}>{s.estado}</span>
                  {esAtrasada(s) && <span className="estado estado-atrasado">Atrasado</span>}
                </td>
                <td>
                  {s.estado === 'Activo' && (
                    <div className="acciones-fila">
                      <button className="btn btn-pequeno" onClick={() => confirmarDevolucion(s, false)}>
                        Devolver
                      </button>
                      <button className="btn btn-pequeno" onClick={() => confirmarDevolucion(s, true)}>
                        Devolver a mantenimiento
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default ListaPrestamos