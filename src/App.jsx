import { useState } from 'react'
import Inventario from './components/Inventario'
import FiltrosInventario from './components/FiltrosInventario'

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

  return (
    <div className="app">
      <h1>{import.meta.env.VITE_APP_NAME}</h1>
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
    </div>
  )
}

export default App