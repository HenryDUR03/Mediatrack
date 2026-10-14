import { useState } from 'react'
import Resumen from './components/Resumen'
import Inventario from './components/Inventario'
import FiltrosInventario from './components/FiltrosInventario'
import FormularioSolicitud from './components/FormularioSolicitud'
import ListaPrestamos from './components/ListaPrestamos'
import { fechaHoy } from './utils/fechas'
import { obtenerCategorias, filtrarEquipos } from './utils/filtros'
import { validarReglasPrestamo } from './utils/validaciones'
import { generarIdSolicitud } from './utils/solicitudes'

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

function App() {
  // Estado principal de la aplicación
  const [equipos, setEquipos] = useState(equiposIniciales)
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)

  // Estado de los filtros
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')

  // Listas derivadas: se calculan en cada render y NO modifican "equipos"
  const categorias = obtenerCategorias(equipos)
  const equiposFiltrados = filtrarEquipos(equipos, {
    busqueda,
    categoria,
    estado: estadoFiltro,
  })

  const limpiarFiltros = () => {
    setBusqueda('')
    setCategoria('Todas')
    setEstadoFiltro('Todos')
  }

  // Registra una solicitud. Las reglas se validan en utils/validaciones.js
  // (lógica) y no solo en el formulario (interfaz).
  const registrarSolicitud = (datos) => {
    const validacion = validarReglasPrestamo(datos, equipos, solicitudes)
    if (!validacion.ok) return validacion

    const id = generarIdSolicitud(solicitudes)
    const nueva = { ...datos, id, estado: 'Activo' }

    // Se crean arreglos nuevos, sin modificar los originales
    setSolicitudes([...solicitudes, nueva])
    setEquipos(
      equipos.map((e) => (e.codigo === datos.codigoEquipo ? { ...e, estado: 'Prestado' } : e)),
    )

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