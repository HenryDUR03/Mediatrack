// Muestra las solicitudes registradas.
// Busca el nombre del equipo a partir del código guardado en la solicitud.
function ListaPrestamos({ solicitudes, equipos }) {
  const nombreEquipo = (codigo) => {
    const equipo = equipos.find((e) => e.codigo === codigo)
    return equipo ? equipo.nombre : codigo
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
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.solicitante}</td>
                <td>{s.tipoUsuario}</td>
                <td>{s.codigoEquipo} - {nombreEquipo(s.codigoEquipo)}</td>
                <td>{s.fechaPrestamo}</td>
                <td>{s.fechaPrevista}</td>
                <td>{s.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default ListaPrestamos