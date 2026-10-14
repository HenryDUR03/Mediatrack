# MediaTrack

Aplicación web del Centro de Medios para registrar equipos audiovisuales, administrar solicitudes de préstamo y controlar devoluciones y atrasos. Está hecha con React, Vite, JavaScript y CSS. Los datos viven en el estado de React y se reinician al recargar la página.

**Versión actual:** 1.0.0

## Requisitos

- Node.js 20.19 o superior (desarrollado y probado con Node.js 25.2.0).
- npm (viene con Node.js).
- Git.

## Instalación

```bash
git clone <url-del-repositorio>
cd mediatrack
npm install
```

## Variables de entorno

La aplicación lee sus valores configurables desde variables de Vite (deben empezar por `VITE_`).

1. Copia la plantilla:
```bash
   cp .env.example .env
```
   En Windows (PowerShell): `copy .env.example .env`
2. Ajusta los valores si lo necesitas.

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_APP_NAME` | Nombre de la aplicación que se muestra como título | `MediaTrack` |

El archivo `.env` no se sube al repositorio. Solo se versiona `.env.example`.

## Ejecución

Servidor de desarrollo:

```bash
npm run dev
```

Abre la dirección que aparece en la terminal (normalmente http://localhost:5173/).

## Generación del build

```bash
npm run build
```

Genera la carpeta `dist/`. Para revisar el resultado:

```bash
npm run preview
```

## Scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Sirve localmente el build generado |
| `npm run lint` | Revisa el código con el linter |

## Estructura del proyecto

```
mediatrack/
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── src/
    ├── components/
    │   ├── Resumen.jsx
    │   ├── Inventario.jsx
    │   ├── FiltrosInventario.jsx
    │   ├── FormularioSolicitud.jsx
    │   └── ListaPrestamos.jsx
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

### Responsabilidad de cada componente

- **App.jsx**: guarda el estado principal (equipos, solicitudes y filtros), aplica las reglas de préstamo y devolución, y reparte datos y funciones a los componentes por props.
- **Resumen.jsx**: muestra los indicadores (total, disponibles, prestados, en mantenimiento y atrasados), calculados a partir de los datos.
- **Inventario.jsx**: muestra la tabla de equipos con cada estado diferenciado por color.
- **FiltrosInventario.jsx**: buscador por nombre o código y filtros por categoría y estado.
- **FormularioSolicitud.jsx**: captura la solicitud, valida los campos y muestra los errores junto a cada campo.
- **ListaPrestamos.jsx**: lista las solicitudes, resalta las atrasadas y permite registrar devoluciones con confirmación.

## Reglas de negocio implementadas

- Un equipo tiene código único, nombre, categoría, estado, ubicación y valor de reposición (COP).
- Estados del equipo: Disponible, Prestado y Mantenimiento.
- Estados de la solicitud: Activo y Devuelto. Son independientes de los del equipo.
- El identificador de la solicitud lo genera el sistema de forma consecutiva (`SOL-001`, `SOL-002`...).
- Solo se pueden solicitar equipos Disponibles. Al confirmar la solicitud, el equipo pasa a Prestado.
- No se permite una segunda solicitud activa para el mismo equipo. La regla se valida en la lógica de `App.jsx`, no solo en la interfaz.
- La fecha de devolución no puede ser anterior a la fecha de préstamo.
- Al devolver, la solicitud pasa a Devuelto y el equipo a Disponible, salvo que se envíe a Mantenimiento.
- Un préstamo está atrasado si su solicitud está Activa y su fecha prevista es anterior a hoy. El atraso no se guarda: se calcula en cada render.

## Decisiones de diseño

- Las fechas se manejan como texto `AAAA-MM-DD`, que es el formato del campo de fecha de HTML y se compara correctamente sin problemas de zona horaria.
- La fecha de hoy se arma con la hora local del navegador.
- Los filtros crean una lista derivada con `filter()` y nunca modifican el inventario original.
- El estado de React no se muta: siempre se crean arreglos y objetos nuevos.