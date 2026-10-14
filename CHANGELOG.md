# Changelog

Todos los cambios relevantes de MediaTrack se documentan en este archivo.

## [1.1.0] - 2026-10-13

### Added
- CR-02: límites de duración del préstamo según el tipo de usuario (3 días para Estudiante y 7 para Docente), con mensaje de rechazo que indica el plazo máximo y los días solicitados.
- CR-02: archivo de configuración `src/config.js` con los límites (`LIMITES_PRESTAMO`).
- CR-03: carpeta `src/utils/` con funciones de negocio independientes de React (`fechas`, `atrasos`, `filtros`, `indicadores`, `solicitudes` y `validaciones`).
- Plan de pruebas de CR-01 y CR-02 en el README.

### Changed
- CR-03: validaciones, detección de atrasos, filtros e indicadores se movieron de los componentes a `src/utils/`. El comportamiento visible de la aplicación no cambió.
- CR-02: el registro de solicitudes ahora rechaza préstamos que superan el límite de su tipo de usuario.
- README actualizado con la nueva estructura, la configuración y las preguntas de análisis.

### Fixed
- CR-01: se verificó que un préstamo con fecha prevista de hoy no se marca como atrasado; solo se marca cuando la fecha prevista es anterior a hoy. El error reportado no era reproducible en la versión 1.0.0, y se agregó un plan de pruebas para evitar que aparezca en el futuro.

## [1.0.0] - 2026-10-13

### Added
- Inventario de equipos con estados diferenciados visualmente.
- Búsqueda por nombre o código y filtros combinables por categoría y estado.
- Formulario de solicitud de préstamo con validaciones y errores junto a cada campo.
- Reglas de préstamo: solo equipos Disponibles, sin solicitudes activas duplicadas.
- Devoluciones, con opción de enviar el equipo a Mantenimiento, y detección de préstamos atrasados.
- Resumen de operación calculado a partir del estado actual.
- Configuración del proyecto: variables de entorno, `.env.example`, `.gitignore` y README.