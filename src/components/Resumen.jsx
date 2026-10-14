import { calcularIndicadores } from '../utils/indicadores'

// Muestra los indicadores de operación.
// Todo se calcula a partir de los datos recibidos: no hay valores escritos a mano.
function Resumen({ equipos, solicitudes, hoy }) {
  const { total, disponibles, prestados, mantenimiento, atrasados } = calcularIndicadores(
    equipos,
    solicitudes,
    hoy,
  )

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