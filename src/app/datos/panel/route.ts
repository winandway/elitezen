import { NextResponse } from "next/server";
import { correoEpin } from "@/lib/correo";
import {
  cambiarEstadoPedido,
  claveDelPanel,
  confirmarPedido,
  contarPlazas,
  eliminarCuenta,
  eliminarPedido,
  listarPedidos,
  listarUsuarios,
  numeroDeFundador,
  usuarioPorCorreo,
} from "@/lib/repositorio";

export const dynamic = "force-dynamic";

/** Verifica la clave del panel enviada en la cabecera x-clave. */
async function autorizado(peticion: Request): Promise<NextResponse | null> {
  const clave = await claveDelPanel();
  if (!clave) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "El panel no tiene clave configurada. Agrega la variable PANEL_CLAVE en el panel de YaDominios (Variables de entorno) y republica.",
      },
      { status: 503 },
    );
  }
  const enviada = peticion.headers.get("x-clave") ?? "";
  if (enviada !== clave) {
    return NextResponse.json({ ok: false, error: "Clave incorrecta" }, { status: 401 });
  }
  return null;
}

/** Lista de registros + resumen (requiere clave).
 *  Muestra a TODA persona registrada: con reserva (pedido) o solo con
 *  cuenta creada (aparece como «sin reserva»). */
export async function GET(peticion: Request) {
  const bloqueo = await autorizado(peticion);
  if (bloqueo) return bloqueo;

  try {
    const [pedidos, usuarios, plazas] = await Promise.all([
      listarPedidos(),
      listarUsuarios(),
      contarPlazas(),
    ]);

    const correosConPedido = new Set(pedidos.map((p) => p.correo));
    const filas = [
      ...pedidos,
      ...usuarios
        .filter((u) => !correosConPedido.has(u.correo))
        .map((u) => ({
          id: `cuenta-${u.id}`,
          nombre: u.nombre,
          correo: u.correo,
          pais: u.pais,
          moneda: "",
          metodo: "",
          referencia: null,
          comprobante: null,
          referido_por: null,
          estado: "sin-reserva",
          creado_en: u.creado_en,
          confirmado_en: null,
        })),
    ].sort((a, b) => (b.creado_en ?? "").localeCompare(a.creado_en ?? ""));

    return NextResponse.json(
      { ok: true, pedidos: filas, ocupadas: plazas.ocupadas },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    console.error("Error listando pedidos:", e);
    return NextResponse.json({ ok: false, error: "Error leyendo la base" }, { status: 500 });
  }
}

/** Acciones del panel: confirmar pago (emite ePIN), anular, reabrir. */
export async function POST(peticion: Request) {
  const bloqueo = await autorizado(peticion);
  if (bloqueo) return bloqueo;

  let cuerpo: { accion?: string; id?: string; correo?: string };
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  // eliminar una cuenta sin reserva (se identifica por correo, no por pedido)
  if (cuerpo.accion === "eliminar-cuenta") {
    const correo = String(cuerpo.correo ?? "");
    if (!correo) {
      return NextResponse.json({ ok: false, error: "Falta el correo" }, { status: 400 });
    }
    try {
      const r = await eliminarCuenta(correo);
      if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 });
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("Error eliminando cuenta:", e);
      return NextResponse.json({ ok: false, error: "Error escribiendo en la base" }, { status: 500 });
    }
  }

  const id = String(cuerpo.id ?? "");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta el id del pedido" }, { status: 400 });
  }

  try {
    switch (cuerpo.accion) {
      case "confirmar": {
        const r = await confirmarPedido(id);
        if (!r.ok || !r.epin) {
          return NextResponse.json({ ok: false, error: r.error }, { status: 404 });
        }
        // enviar el ePIN por correo (si Resend está configurado);
        // si falla, la confirmación NO se pierde: queda el envío manual
        let correoEnviado = false;
        try {
          const usuario = await usuarioPorCorreo(r.epin.correo);
          const numero = await numeroDeFundador(r.epin.correo);
          const envio = await correoEpin({
            nombre: usuario?.nombre ?? "Fundador",
            correo: r.epin.correo,
            codigo: r.epin.codigo,
            numero,
          });
          correoEnviado = envio.ok;
        } catch (e) {
          console.error("Error enviando el correo del ePIN:", e);
        }
        return NextResponse.json({ ok: true, epin: r.epin, correoEnviado });
      }
      case "anular": {
        const hecho = await cambiarEstadoPedido(id, "anulado");
        return NextResponse.json({ ok: hecho });
      }
      case "reabrir": {
        const hecho = await cambiarEstadoPedido(id, "pendiente");
        return NextResponse.json({ ok: hecho });
      }
      case "eliminar": {
        const r = await eliminarPedido(id);
        if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 });
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ ok: false, error: "Acción desconocida" }, { status: 400 });
    }
  } catch (e) {
    console.error("Error en acción del panel:", e);
    return NextResponse.json({ ok: false, error: "Error escribiendo en la base" }, { status: 500 });
  }
}
