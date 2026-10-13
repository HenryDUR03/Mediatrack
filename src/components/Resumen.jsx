// Muestra los indicadores de operación.
// Todo se calcula a partir de los datos recibidos: no hay valores escritos a mano.
function Resumen({ equipos, solicitudes, hoy }) {
  const total = equipos.length
  const disponibles = equipos.filter((e) => e.estado === 'Disponible').length
  const prestados = equipos.filter((e) => e.estado === 'Prestado').length
  const mantenimiento = equipos.filter((e) => e.estado === 'Mantenimiento').length
  const atrasados = solicitudes.filter((s) => s.estado === 'Activo' && s.fechaPrevista < hoy).length

  const indicadores = [
    { etiqueta: 'Total de equipos', valor: total, clase: '' },
    { etiqueta: 'Disponibles', valor: disponibles, clase: 'ind-disponible' },
    { etiqueta: 'Prestados', valor: prestados, clase: 'ind-prestado' },
    { etiqueta: 'En mantenimiento', valor: mantenimiento, clase: 'ind-mantenimiento' },
    { etiqueta: 'Préstamos atrasados', valor: atrasados, clase: 'ind-atrasado' },
  ]

  return (
    <section className="resumen">
      {indicadores.map((i) => (
        <div key={i.etiqueta} className={`indicador ${i.clase}`}>
          <strong>{i.valor}</strong>
          <span>{i.etiqueta}</span>
        </div>
      ))}
    </section>
  )
}

export default Resumen