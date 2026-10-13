// Formato de moneda colombiana: $ 3.500.000
const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

// Muestra la tabla de equipos. Solo recibe datos por props, no tiene estado propio.
function Inventario({ equipos }) {
  return (
    <section>
      <h2>Inventario</h2>
            {equipos.length === 0 && (
        <p className="vacio">No se encontraron equipos con esos criterios.</p>
      )}
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Ubicación</th>
            <th>Valor de reposición</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.codigo}>
              <td>{equipo.codigo}</td>
              <td>{equipo.nombre}</td>
              <td>{equipo.categoria}</td>
              <td>{equipo.ubicacion}</td>
              <td>{formatoMoneda.format(equipo.valorReposicion)}</td>
              <td>
                <span className={`estado estado-${equipo.estado.toLowerCase()}`}>
                  {equipo.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Inventario