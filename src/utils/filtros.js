// Categorías sin repetir, calculadas a partir de los equipos
export const obtenerCategorias = (equipos) => [...new Set(equipos.map((e) => e.categoria))]

// Devuelve una lista NUEVA con los equipos que cumplen los filtros combinados.
// No modifica el arreglo original.
export const filtrarEquipos = (equipos, { busqueda, categoria, estado }) => {
  const texto = busqueda.trim().toLowerCase()
  return equipos.filter((e) => {
    const coincideTexto =
      e.nombre.toLowerCase().includes(texto) || e.codigo.toLowerCase().includes(texto)
    const coincideCategoria = categoria === 'Todas' || e.categoria === categoria
    const coincideEstado = estado === 'Todos' || e.estado === estado
    return coincideTexto && coincideCategoria && coincideEstado
  })
}