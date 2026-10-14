import { useState } from 'react'
import { LIMITES_PRESTAMO } from './config'
import Resumen from './components/Resumen'
import Inventario from './components/Inventario'
import FiltrosInventario from './components/FiltrosInventario'
import FormularioSolicitud from './components/FormularioSolicitud'
import ListaPrestamos from './components/ListaPrestamos'

// Datos iniciales: 6 equipos, 4 categorías, uno en Mantenimiento
const equiposIniciales = [
  { codigo: 'CAM-001', nombre: 'Cámara Canon EOS', categoria: 'Video', estado: 'Disponible', ubicacion: 'Estante A1', valorReposicion: 3500000 },
  { codigo: 'MIC-001', nombre: 'Micrófono Shure SM58', categoria: 'Audio', estado: 'Prestado', ubicacion: 'Estante B1', valorReposicion: 450000 },
  { codigo: 'MIC-002', nombre: 'Micrófono de solapa', categoria: 'Audio', estado: 'Disponible', ubicacion: 'Estante B2', valorReposicion: 180000 },
  { codigo: 'TRI-001', nombre: 'Trípode profesional', categoria: 'Accesorios', estado: 'Mantenimiento', ubicacion: 'Taller', valorReposicion: 220000 },
  { codigo: 'PRO-001', nombre: 'Proyector Epson', categoria: 'Video', estado: 'Disponible', ubicacion: 'Estante C1', valorReposicion: 2800000 },
  { codigo: 'LUZ-001', nombre: 'Panel LED de iluminación', categoria: 'Iluminación', estado: 'Disponible', ubicacion: 'Estante D1', valorReposicion: 650000 },
]

// Una solicitud Activa con fecha prevista ya vencida (para demostrar los atrasos)
const solicitudesIniciales = [
  { id: 'SOL-001', solicitante: 'Laura Gómez', tipoUsuario: 'Estudiante', codigoEquipo: 'MIC-001', fechaPrestamo: '2026-01-05', fechaPrevista: '2026-01-08', estado: 'Activo' },
]

// Fecha de hoy en formato AAAA-MM-DD usando la hora LOCAL (no UTC)
const fechaHoy = () => {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// Días entre dos fechas AAAA-MM-DD. Se usa Date.UTC para que el horario
// de verano o la zona horaria no alteren el resultado.
const diasEntre = (inicio, fin) => {
  const [a1, m1, d1] = inicio.split('-').map(Number)
  const [a2, m2, d2] = fin.split('-').map(Number)
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000)
}

function App() {
  // Estado principal de la aplicación
  const [equipos, setEquipos] = useState(equiposIniciales)
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)

  // Estado de los filtros
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')

  // Categorías calculadas a partir de los equipos (sin repetir)
  const categorias = [...new Set(equipos.map((e) => e.categoria))]

  // Lista derivada: se calcula en cada render y NO modifica "equipos"
  const texto = busqueda.trim().toLowerCase()
  const equiposFiltrados = equipos.filter((e) => {
    const coincideTexto =
      e.nombre.toLowerCase().includes(texto) || e.codigo.toLowerCase().includes(texto)
    const coincideCategoria = categoria === 'Todas' || e.categoria === categoria
    const coincideEstado = estadoFiltro === 'Todos' || e.estado === estadoFiltro
    return coincideTexto && coincideCategoria && coincideEstado
  })

  const limpiarFiltros = () => {
    setBusqueda('')
    setCategoria('Todas')
    setEstadoFiltro('Todos')
  }

  // Genera el siguiente ID consecutivo: SOL-001, SOL-002...
  const generarIdSolicitud = () => {
    const numeros = solicitudes.map((s) => Number(s.id.replace('SOL-', '')))
    const siguiente = numeros.length ? Math.max(...numeros) + 1 : 1
    return `SOL-${String(siguiente).padStart(3, '0')}`
  }

  // Registra una solicitud aplicando las reglas de préstamo.
  // Las reglas se validan aquí (lógica) y no solo en el formulario (interfaz).
  const registrarSolicitud = (datos) => {
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

    // CR-02: la duración no puede superar el límite del tipo de usuario
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

    const id = generarIdSolicitud()
    const nueva = { ...datos, id, estado: 'Activo' }

    // Se crean arreglos nuevos, sin modificar los originales
    setSolicitudes([...solicitudes, nueva])
    setEquipos(equipos.map((e) => (e.codigo === equipo.codigo ? { ...e, estado: 'Prestado' } : e)))

    return { ok: true, id }
  }

  // Registra la devolución: la solicitud pasa a Devuelto y el equipo a
  // Disponible, salvo que se envíe a Mantenimiento.
  const devolverSolicitud = (id, aMantenimiento) => {
    const solicitud = solicitudes.find((s) => s.id === id)
    if (!solicitud || solicitud.estado !== 'Activo') return

    setSolicitudes(solicitudes.map((s) => (s.id === id ? { ...s, estado: 'Devuelto' } : s)))
    setEquipos(
      equipos.map((e) =>
        e.codigo === solicitud.codigoEquipo
          ? { ...e, estado: aMantenimiento ? 'Mantenimiento' : 'Disponible' }
          : e,
      ),
    )
  }

  const hoy = fechaHoy()

  return (
    <div className="app">
      <h1>{import.meta.env.VITE_APP_NAME}</h1>

      <Resumen equipos={equipos} solicitudes={solicitudes} hoy={hoy} />

      <FormularioSolicitud
        equiposDisponibles={equipos.filter((e) => e.estado === 'Disponible')}
        onRegistrar={registrarSolicitud}
      />

      <FiltrosInventario
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        categoria={categoria}
        onCategoria={setCategoria}
        estado={estadoFiltro}
        onEstado={setEstadoFiltro}
        categorias={categorias}
        onLimpiar={limpiarFiltros}
      />
      <Inventario equipos={equiposFiltrados} />

      <ListaPrestamos
        solicitudes={solicitudes}
        equipos={equipos}
        hoy={hoy}
        onDevolver={devolverSolicitud}
      />
    </div>
  )
}

export default App