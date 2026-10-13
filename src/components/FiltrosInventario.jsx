// Muestra el buscador y los filtros. No guarda estado propio:
// recibe los valores y las funciones por props desde App.
function FiltrosInventario({
  busqueda,
  onBusqueda,
  categoria,
  onCategoria,
  estado,
  onEstado,
  categorias,
  onLimpiar,
}) {
  return (
    <div className="filtros">
      <input
        type="search"
        placeholder="Buscar por nombre o código"
        value={busqueda}
        onChange={(e) => onBusqueda(e.target.value)}
      />

      <select value={categoria} onChange={(e) => onCategoria(e.target.value)}>
        <option value="Todas">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select value={estado} onChange={(e) => onEstado(e.target.value)}>
        <option value="Todos">Todos los estados</option>
        <option value="Disponible">Disponible</option>
        <option value="Prestado">Prestado</option>
        <option value="Mantenimiento">Mantenimiento</option>
      </select>

      <button type="button" className="btn" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </div>
  )
}

export default FiltrosInventario