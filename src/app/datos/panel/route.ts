import { NextResponse } from "next/server";
import {
  cambiarEstadoPedido,
  claveDelPanel,
  confirmarPedido,
  contarPlazas,
  listarPedidos,
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

/** Lista de pedidos + resumen (requiere clave). */
export async function GET(peticion: Request) {
  const bloqueo = await autorizado(peticion);
  if (bloqueo) return bloqueo;

  try {
    const [pedidos, plazas] = await Promise.all([listarPedidos(), contarPlazas()]);
    return NextResponse.json(
      { ok: true, pedidos, ocupadas: plazas.ocupadas },
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

  let cuerpo: { accion?: string; id?: string };
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  const id = String(cuerpo.id ?? "");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta el id del pedido" }, { status: 400 });
  }

  try {
    switch (cuerpo.accion) {
      case "confirmar": {
        const r = await confirmarPedido(id);
        if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 404 });
        return NextResponse.json({ ok: true, epin: r.epin });
      }
      case "anular": {
        const hecho = await cambiarEstadoPedido(id, "anulado");
        return NextResponse.json({ ok: hecho });
      }
      case "reabrir": {
        const hecho = await cambiarEstadoPedido(id, "pendiente");
        return NextResponse.json({ ok: hecho });
      }
      default:
        return NextResponse.json({ ok: false, error: "Acción desconocida" }, { status: 400 });
    }
  } catch (e) {
    console.error("Error en acción del panel:", e);
    return NextResponse.json({ ok: false, error: "Error escribiendo en la base" }, { status: 500 });
  }
}
