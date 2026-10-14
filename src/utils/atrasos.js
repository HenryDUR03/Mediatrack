// Un préstamo está atrasado si su solicitud sigue Activa y su fecha prevista
// es anterior a hoy. El atraso no se guarda: se calcula cada vez.
export const esAtrasada = (solicitud, hoy) =>
  solicitud.estado === 'Activo' && solicitud.fechaPrevista < hoy

export const contarAtrasados = (solicitudes, hoy) =>
  solicitudes.filter((s) => esAtrasada(s, hoy)).length