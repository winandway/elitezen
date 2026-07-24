/**
 * Envío de correos con Resend (https://resend.com).
 * Se activa solo cuando existe la variable RESEND_API_KEY en el panel
 * de YaDominios. Sin la clave, las funciones devuelven { ok: false }
 * y el panel sigue ofreciendo el envío manual.
 */

const REMITENTE = "Academia EliteZen <fundadores@elitezenacademy.com>";

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

function plantilla(contenido: string): string {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#172338;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#172338;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td align="center" style="padding-bottom:24px;">
          <div style="font-size:22px;letter-spacing:8px;color:#fed175;font-weight:bold;">ELITEZEN</div>
          <div style="font-size:11px;letter-spacing:4px;color:#8fa0bd;margin-top:6px;">ACADEMIA &middot; CAMPA&Ntilde;A DE FUNDADORES</div>
        </td></tr>
        <tr><td style="background-color:#1b2a44;border-radius:16px;padding:32px 28px;color:#e8edf5;font-size:15px;line-height:1.7;">
          ${contenido}
        </td></tr>
        <tr><td align="center" style="padding-top:24px;color:#64748b;font-size:11px;line-height:1.6;">
          &copy; 2026 elitezenacademy.com | All rights reserved.<br>
          Developed by <a href="https://windoce.com" style="color:#8fa0bd;">Windoce LLC</a>
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
    ? `<p style="margin:18px 0 0;text-align:center;">
         <span style="display:inline-block;border:1px solid #ce9d2a;border-radius:999px;padding:8px 20px;color:#fed175;font-weight:bold;">
           Eres el Fundador #${datos.numero} de 100
         </span>
       </p>`
    : "";

  const contenido = `
    <h1 style="margin:0;font-size:22px;color:#ffffff;">&iexcl;Felicidades, ${primerNombre}!</h1>
    <p style="margin:14px 0 0;">Tu pago fue confirmado y tu plaza entre los
    <strong style="color:#fed175;">100 Fundadores de Academia EliteZen</strong> est&aacute; asegurada.</p>
    ${lineaNumero}
    <p style="margin:22px 0 8px;">Este es tu <strong>ePIN de activaci&oacute;n</strong>. Gu&aacute;rdalo bien:
    con &eacute;l activar&aacute;s tu cuenta cuando la plataforma abra sus puertas.</p>
    <p style="margin:0;text-align:center;">
      <span style="display:inline-block;border:2px dashed #ce9d2a;border-radius:12px;padding:16px 26px;font-family:Consolas,Menlo,monospace;font-size:22px;letter-spacing:2px;color:#fed175;background-color:#172338;">
        ${datos.codigo}
      </span>
    </p>
    <p style="margin:22px 0 0;">Tambi&eacute;n puedes verlo siempre que quieras entrando a tu cuenta en
    <a href="https://elitezenacademy.com/entrar" style="color:#fed175;">elitezenacademy.com</a>.</p>
    <p style="margin:18px 0 0;">Un abrazo,<br>El equipo de Academia EliteZen</p>`;

  return enviar(
    datos.correo,
    "Tu ePIN de Fundador — Academia EliteZen",
    plantilla(contenido),
  );
}

/** Correo de bienvenida al crear la cuenta (reserva aún sin pagar). */
export async function correoBienvenida(datos: { nombre: string; correo: string }) {
  const primerNombre = datos.nombre.split(" ")[0];
  const contenido = `
    <h1 style="margin:0;font-size:22px;color:#ffffff;">&iexcl;Bienvenido, ${primerNombre}!</h1>
    <p style="margin:14px 0 0;">Tu cuenta de Fundador en <strong style="color:#fed175;">Academia EliteZen</strong>
    qued&oacute; creada. Est&aacute;s a un paso de asegurar tu plaza entre los 100.</p>
    <p style="margin:18px 0 0;">Entra a tu cuenta y completa tu reserva:</p>
    <p style="margin:16px 0 0;text-align:center;">
      <a href="https://elitezenacademy.com/cuenta"
         style="display:inline-block;background-color:#fed175;color:#10192a;font-weight:bold;border-radius:999px;padding:14px 30px;text-decoration:none;">
        Completar mi reserva
      </a>
    </p>
    <p style="margin:22px 0 0;">Solo existir&aacute;n 100 Fundadores. La campa&ntilde;a cierra el
    <strong>15 de agosto de 2026</strong> o al completarse las plazas.</p>
    <p style="margin:18px 0 0;">Un abrazo,<br>El equipo de Academia EliteZen</p>`;

  return enviar(
    datos.correo,
    "Tu cuenta de Fundador está lista — Academia EliteZen",
    plantilla(contenido),
  );
}
