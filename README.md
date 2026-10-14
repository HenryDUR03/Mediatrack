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

## Plan de pruebas

### CR-01: préstamos con fecha prevista de hoy

**Regla:** un préstamo está atrasado solo si su solicitud está Activa y su fecha prevista es anterior a hoy (`fechaPrevista < hoy`). Las fechas se comparan como texto `AAAA-MM-DD`, así que la hora del día y la zona horaria no influyen.

**Resultado de la verificación:** el error reportado no es reproducible en la versión 1.0.0. Se comprobó registrando solicitudes con distintas fechas previstas.

| Caso | Fecha prevista | Estado de la solicitud | Resultado esperado |
|---|---|---|---|
| 1 | Ayer | Activo | Atrasado |
| 2 | Hoy | Activo | No atrasado |
| 3 | Mañana | Activo | No atrasado |
| 4 | Anterior a hoy | Devuelto | No atrasado (ya fue devuelto) |
| 5 | 2026-01-08 (dato inicial SOL-001) | Activo | Atrasado |

**Procedimiento:**
1. Ejecutar `npm run dev`.
2. Registrar solicitudes con las fechas de los casos 1 a 3, cada una con un equipo Disponible distinto.
3. Verificar en la tabla de préstamos que solo el caso 1 muestre la etiqueta "Atrasado".
4. Verificar que el indicador "Préstamos atrasados" del resumen coincida con las filas marcadas.
5. Devolver la solicitud del caso 1 y comprobar que la etiqueta desaparece y el indicador baja en 1.

**Fecha de verificación:** 13 de octubre de 2026.

### CR-02: límites de duración del préstamo

**Regla:** la duración máxima depende del tipo de usuario: 3 días para Estudiante y 7 días para Docente. Los límites están en `src/config.js` (`LIMITES_PRESTAMO`) y se pueden cambiar sin tocar los componentes.

**Interpretación del plazo:** los días se cuentan desde la fecha de préstamo y el límite es inclusivo. Un Estudiante que pide un equipo el día 10 puede devolverlo como máximo el día 13. Si la fecha prevista supera el límite, la solicitud se rechaza con un mensaje que indica el plazo máximo y los días solicitados.

| Caso | Tipo | Duración | Resultado esperado |
|---|---|---|---|
| 1 | Estudiante | 3 días | Se registra |
| 2 | Estudiante | 4 días | Se rechaza con mensaje |
| 3 | Docente | 7 días | Se registra |
| 4 | Docente | 8 días | Se rechaza con mensaje |
| 5 | Cualquiera | Fecha prevista anterior a la de préstamo | Se rechaza con error en el campo |

**Procedimiento:**
1. Ejecutar `npm run dev`.
2. Registrar solicitudes con las duraciones de los casos 1 a 4, usando un equipo Disponible en cada una.
3. Verificar que las rechazadas muestren el mensaje y que el equipo siga Disponible.