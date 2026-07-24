/**
 * Envío de correos con Resend (https://resend.com).
 * Se activa solo cuando existe la variable RESEND_API_KEY en el panel
 * de YaDominios. Sin la clave, las funciones devuelven { ok: false }
 * y el panel sigue ofreciendo el envío manual.
 *
 * Las plantillas son HTML de tablas con estilos en línea: es el formato
 * que se ve bien en TODOS los clientes de correo (Gmail, Outlook, Apple
 * Mail, móviles). El logo se sirve desde el propio dominio.
 */

const REMITENTE = "Academia EliteZen <fundadores@elitezenacademy.com>";
const LOGO = "https://elitezenacademy.com/logo-elitezen.png";
const SITIO = "https://elitezenacademy.com";

async function claveResend(): Promise<string | null> {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const v = (getCloudflareContext().env as Record<string, unknown>)
      .RESEND_API_KEY;
    return typeof v === "string" && v ? v : null;
  } catch {
    return null;
  }
}

async function enviar(destino: string, asunto: string, html: string) {
  const clave = await claveResend();
  if (!clave) return { ok: false as const, motivo: "sin-clave" as const };

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: REMITENTE, to: [destino], subject: asunto, html }),
    });
    if (!r.ok) {
      console.error("Resend respondió", r.status, await r.text());
      return { ok: false as const, motivo: "error-api" as const };
    }
    return { ok: true as const };
  } catch (e) {
    console.error("Error enviando correo:", e);
    return { ok: false as const, motivo: "error-red" as const };
  }
}

/* ---------- plantilla de marca ---------- */

function plantilla(contenido: string, preencabezado: string): string {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Academia EliteZen</title>
</head>
<body style="margin:0;padding:0;background-color:#10192a;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preencabezado}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#10192a;">
    <tr><td align="center" style="padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

        <tr><td align="center" style="padding-bottom:26px;">
          <a href="${SITIO}" style="text-decoration:none;">
            <img src="${LOGO}" width="112" alt="Academia EliteZen" style="display:block;border:0;max-width:112px;height:auto;">
          </a>
          <div style="font-size:10px;letter-spacing:5px;color:#8fa0bd;margin-top:12px;">ACADEMIA &middot; CAMPA&Ntilde;A DE FUNDADORES</div>
        </td></tr>

        <tr><td align="center" style="padding-bottom:0;">
          <table role="presentation" width="64" cellpadding="0" cellspacing="0">
            <tr><td height="3" style="background-color:#fed175;border-radius:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-top:14px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="background-color:#1b2a44;border-radius:18px;">
            <tr><td style="padding:34px 30px;color:#e8edf5;font-size:15px;line-height:1.75;">
              ${contenido}
            </td></tr>
          </table>
        </td></tr>

        <tr><td align="center" style="padding-top:28px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px;"><a href="${SITIO}/quienes-somos" style="color:#8fa0bd;text-decoration:none;">Qui&eacute;nes somos</a></td>
              <td style="color:#3d4d6b;font-size:12px;padding:0 10px;">&middot;</td>
              <td style="font-size:12px;"><a href="${SITIO}/terminos" style="color:#8fa0bd;text-decoration:none;">T&eacute;rminos</a></td>
              <td style="color:#3d4d6b;font-size:12px;padding:0 10px;">&middot;</td>
              <td style="font-size:12px;"><a href="https://instagram.com/elitezenoficial" style="color:#8fa0bd;text-decoration:none;">@elitezenoficial</a></td>
            </tr>
          </table>
          <div style="border-top:1px solid #22324f;margin:18px 40px 0;padding-top:16px;color:#5b6c8c;font-size:11px;line-height:1.7;">
            Recibes este correo porque tienes una cuenta de Fundador en
            <a href="${SITIO}" style="color:#8fa0bd;">elitezenacademy.com</a><br>
            &copy; 2026 elitezenacademy.com | All rights reserved.
            Developed by <a href="https://windoce.com" style="color:#8fa0bd;">Windoce LLC</a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ---------- correos concretos ---------- */

/** Correo con el ePIN al confirmarse el pago del Fundador. */
export async function correoEpin(datos: {
  nombre: string;
  correo: string;
  codigo: string;
  numero: number | null;
}) {
  const primerNombre = datos.nombre.split(" ")[0];
  const lineaNumero = datos.numero
    ? `<p style="margin:20px 0 0;text-align:center;">
         <span style="display:inline-block;border:1px solid #ce9d2a;border-radius:999px;padding:9px 22px;color:#fed175;font-weight:bold;font-size:14px;">
           &#11088; Eres el Fundador #${datos.numero} de 100
         </span>
       </p>`
    : "";

  const contenido = `
    <h1 style="margin:0;font-size:23px;color:#ffffff;">&iexcl;Felicidades, ${primerNombre}!</h1>
    <p style="margin:14px 0 0;">Tu pago fue confirmado y tu plaza entre los
    <strong style="color:#fed175;">100 Fundadores de Academia EliteZen</strong> est&aacute; asegurada.
    Desde hoy formas parte de la historia de este proyecto.</p>
    ${lineaNumero}
    <p style="margin:24px 0 10px;">Este es tu <strong>ePIN de activaci&oacute;n</strong>. Gu&aacute;rdalo como oro:
    con &eacute;l activar&aacute;s tu cuenta cuando la plataforma abra sus puertas.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr><td style="border:2px dashed #ce9d2a;border-radius:14px;padding:18px 30px;background-color:#172338;">
            <div style="font-family:Consolas,Menlo,monospace;font-size:23px;letter-spacing:3px;color:#fed175;font-weight:bold;">${datos.codigo}</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:24px 0 0;">Tu ePIN tambi&eacute;n queda guardado en tu cuenta — puedes verlo cuando quieras:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding-top:14px;">
        <a href="${SITIO}/entrar"
           style="display:inline-block;background-color:#fed175;color:#10192a;font-weight:bold;font-size:15px;border-radius:999px;padding:14px 34px;text-decoration:none;">
          Entrar a mi cuenta
        </a>
      </td></tr>
    </table>
    <p style="margin:26px 0 0;color:#b9c4d8;">Gracias por creer en este proyecto desde el primer d&iacute;a.</p>
    <p style="margin:6px 0 0;">Un abrazo,<br><strong style="color:#ffffff;">El equipo de Academia EliteZen</strong></p>`;

  return enviar(
    datos.correo,
    "Tu ePIN de Fundador — Academia EliteZen",
    plantilla(contenido, `Tu plaza está confirmada: aquí está tu ePIN ${datos.codigo}`),
  );
}

/** Correo de bienvenida al crear la cuenta (reserva aún sin pagar). */
export async function correoBienvenida(datos: { nombre: string; correo: string }) {
  const primerNombre = datos.nombre.split(" ")[0];
  const contenido = `
    <h1 style="margin:0;font-size:23px;color:#ffffff;">&iexcl;Bienvenido, ${primerNombre}!</h1>
    <p style="margin:14px 0 0;">Tu cuenta de Fundador en
    <strong style="color:#fed175;">Academia EliteZen</strong> qued&oacute; creada.
    Est&aacute;s a un paso de asegurar tu plaza entre los <strong>100 Fundadores</strong>.</p>
    <p style="margin:20px 0 0;">Como Fundador tendr&aacute;s, entre otros beneficios:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
      <tr><td style="padding:6px 0;color:#e8edf5;font-size:14px;">&#10004;&#65039; Precio de tu membres&iacute;a garantizado durante 3 a&ntilde;os</td></tr>
      <tr><td style="padding:6px 0;color:#e8edf5;font-size:14px;">&#10004;&#65039; 20% de descuento en cursos, eventos y conferencias</td></tr>
      <tr><td style="padding:6px 0;color:#e8edf5;font-size:14px;">&#10004;&#65039; Participaci&oacute;n del 2% de las membres&iacute;as</td></tr>
      <tr><td style="padding:6px 0;color:#e8edf5;font-size:14px;">&#10004;&#65039; Comisiones del 20% y 10% desde el primer d&iacute;a</td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding-top:22px;">
        <a href="${SITIO}/cuenta"
           style="display:inline-block;background-color:#fed175;color:#10192a;font-weight:bold;font-size:15px;border-radius:999px;padding:14px 34px;text-decoration:none;">
          Completar mi reserva
        </a>
      </td></tr>
    </table>
    <p style="margin:24px 0 0;color:#b9c4d8;">Solo existir&aacute;n 100 Fundadores. La campa&ntilde;a cierra el
    <strong style="color:#e8edf5;">15 de agosto de 2026</strong> o al completarse las plazas — lo que ocurra primero.</p>
    <p style="margin:18px 0 0;">Un abrazo,<br><strong style="color:#ffffff;">El equipo de Academia EliteZen</strong></p>`;

  return enviar(
    datos.correo,
    "Tu cuenta de Fundador está lista — Academia EliteZen",
    plantilla(contenido, "Bienvenido a la Campaña de Fundadores: completa tu reserva"),
  );
}
