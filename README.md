# MediaTrack

Aplicación web del Centro de Medios para registrar equipos audiovisuales, administrar solicitudes de préstamo y controlar devoluciones y atrasos. Está hecha con React, Vite, JavaScript y CSS. Los datos viven en el estado de React y se reinician al recargar la página.

**Versión actual:** 1.1.0

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
├── CHANGELOG.md
├── README.md
├── package.json
└── src/
    ├── components/
    │   ├── Resumen.jsx
    │   ├── Inventario.jsx
    │   ├── FiltrosInventario.jsx
    │   ├── FormularioSolicitud.jsx
    │   └── ListaPrestamos.jsx
    ├── utils/
    │   ├── atrasos.js
    │   ├── fechas.js
    │   ├── filtros.js
    │   ├── indicadores.js
    │   ├── solicitudes.js
    │   └── validaciones.js
    ├── config.js
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

### Responsabilidad de cada componente

- **App.jsx**: guarda el estado principal (equipos, solicitudes y filtros), aplica las reglas de devolución y reparte datos y funciones a los componentes por props.
- **Resumen.jsx**: muestra los indicadores (total, disponibles, prestados, en mantenimiento y atrasados), calculados a partir de los datos.
- **Inventario.jsx**: muestra la tabla de equipos con cada estado diferenciado por color.
- **FiltrosInventario.jsx**: buscador por nombre o código y filtros por categoría y estado.
- **FormularioSolicitud.jsx**: captura la solicitud y muestra los errores junto a cada campo.
- **ListaPrestamos.jsx**: lista las solicitudes, resalta las atrasadas y permite registrar devoluciones con confirmación.

### Responsabilidad de `config.js` y `utils/`

- **config.js**: límites de duración del préstamo por tipo de usuario. Se modifica aquí sin tocar los componentes.
- **utils/fechas.js**: fecha de hoy en hora local y cálculo de días entre dos fechas.
- **utils/atrasos.js**: regla que decide si un préstamo está atrasado y conteo de atrasados.
- **utils/filtros.js**: categorías disponibles y filtrado combinado del inventario, sin modificar la lista original.
- **utils/indicadores.js**: cálculo de los indicadores del resumen.
- **utils/solicitudes.js**: generación del identificador consecutivo (`SOL-001`, `SOL-002`...).
- **utils/validaciones.js**: validación de los campos del formulario y de las reglas de préstamo (equipo disponible, sin solicitud activa y plazo máximo).

Los componentes solo muestran datos y llaman a estas funciones. Así la lógica se puede cambiar o probar sin tocar la interfaz.

## Reglas de negocio implementadas

- Un equipo tiene código único, nombre, categoría, estado, ubicación y valor de reposición (COP).
- Estados del equipo: Disponible, Prestado y Mantenimiento.
- Estados de la solicitud: Activo y Devuelto. Son independientes de los del equipo.
- El identificador de la solicitud lo genera el sistema de forma consecutiva (`SOL-001`, `SOL-002`...).
- Solo se pueden solicitar equipos Disponibles. Al confirmar la solicitud, el equipo pasa a Prestado.
- No se permite una segunda solicitud activa para el mismo equipo. La regla se valida en la lógica (`utils/validaciones.js`), no solo en la interfaz.
- La fecha de devolución no puede ser anterior a la fecha de préstamo.
- La duración máxima del préstamo es de 3 días para Estudiante y 7 días para Docente (`src/config.js`).
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
| 3 | Mañana o posterior | Activo | No atrasado |
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

## Preguntas de análisis

**1. ¿Qué información debe guardarse en el equipo y qué información pertenece a la solicitud de préstamo?**
El equipo guarda lo que describe al objeto: código único, nombre, categoría, estado, ubicación y valor de reposición. La solicitud guarda lo que describe el préstamo: identificador, solicitante, tipo de usuario, fecha de préstamo, fecha prevista, estado y el código del equipo. La solicitud solo referencia al equipo por su código y no copia sus datos, para que no haya información repetida que se desactualice.

**2. ¿Por qué el estado del equipo y el de la solicitud no deben tratarse como si fueran el mismo dato?**
Describen cosas distintas. El estado del equipo dice si se puede prestar (Disponible, Prestado o Mantenimiento). El de la solicitud dice en qué punto está el préstamo (Activo o Devuelto). Al devolver un equipo a mantenimiento, la solicitud queda Devuelto pero el equipo queda en Mantenimiento: con un solo estado no se podría representar.

**3. ¿Cómo evitaría que dos solicitudes utilicen el mismo equipo disponible?**
De dos formas. El selector del formulario solo muestra equipos Disponibles. Y, como la interfaz sola no basta, la función `validarReglasPrestamo` vuelve a comprobar que el equipo esté Disponible y que no tenga una solicitud Activa. Al confirmar, el equipo pasa a Prestado y deja de poder elegirse.

**4. ¿Qué datos deberían recalcularse después de registrar una devolución?**
El estado de la solicitud (Devuelto), el estado del equipo (Disponible o Mantenimiento), la lista de equipos disponibles del formulario, la etiqueta de atraso de esa solicitud, los indicadores del resumen y la lista filtrada del inventario. Como todo se calcula a partir del estado, se actualiza solo en el siguiente render.

**5. ¿Por qué no conviene modificar directamente el arreglo almacenado en useState?**
React decide si debe volver a dibujar comparando referencias. Si se modifica el mismo arreglo (por ejemplo con `push`), la referencia no cambia y la pantalla puede no actualizarse. Por eso se crean arreglos y objetos nuevos con `map`, `filter` y el operador de propagación, y se entregan con la función `set`.

**6. Explique cómo combinaría búsqueda por texto y filtros sin alterar el inventario original.**
Se guardan en el estado solo los valores de los filtros (texto, categoría y estado). En cada render, `filtrarEquipos` aplica `filter()` sobre `equipos` con las tres condiciones combinadas y devuelve una lista nueva. La lista original nunca se toca, y al limpiar los filtros se vuelve a ver completa.

**7. ¿Por qué node_modules y los archivos .env no deben subir al repositorio? ¿Qué papel cumple el archivo .env.example?**
`node_modules` es muy pesado y se puede regenerar con `npm install` a partir de `package.json` y `package-lock.json`. El `.env` contiene valores propios de cada entorno y, en otros proyectos, datos sensibles como claves, que no deben quedar en el historial. El `.env.example` es la plantilla documentada y sin datos sensibles: le dice a quien descargue el proyecto qué variables debe crear.

**8. Clasifique CR-01, CR-02 y CR-03 según el tipo de mantenimiento y explique la diferencia entre ellos.**
CR-01 es correctivo: busca arreglar un comportamiento incorrecto reportado (un préstamo con fecha de hoy marcado como atrasado). CR-02 es evolutivo: agrega una regla nueva (límites de duración por tipo de usuario). CR-03 es preventivo: reorganiza el código (la lógica pasa a `utils/`) sin cambiar lo que ve el usuario, para facilitar el mantenimiento futuro. La diferencia es el motivo: reparar un fallo, ampliar funcionalidad o prevenir problemas futuros.

**9. ¿Qué ventaja tiene mover los límites de préstamo a un archivo de configuración? ¿Por qué el cambio CR-02 justifica pasar de la versión 1.0.0 a la 1.1.0 y no a la 2.0.0?**
Los límites quedan en un solo lugar, sin números sueltos dentro de los componentes, y se pueden cambiar sin tocar la lógica ni la interfaz. Con versionado semántico, la versión mayor se reserva para cambios que rompen la compatibilidad, y la menor para funcionalidad nueva compatible con lo anterior. CR-02 agrega una regla sin cambiar la estructura de los datos ni la forma de usar la aplicación, así que corresponde 1.1.0.