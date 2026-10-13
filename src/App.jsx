import { useState } from 'react'

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
  const [equipos, setEquipos] = useState(equiposIniciales)
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)

  return (
    <div>
      <h1>{import.meta.env.VITE_APP_NAME}</h1>
      <p>{equipos.length} equipos y {solicitudes.length} solicitud(es) cargados.</p>
    </div>
  )
}

export default App