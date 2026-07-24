import { NextResponse } from "next/server";
import { sesionDePeticion } from "@/lib/auth";
import {
  crearPedido,
  epinDePedido,
  numeroDeFundador,
  pedidoActivoDeCorreo,
  usuarioPorCorreo,
} from "@/lib/repositorio";
import type { Moneda } from "@/lib/tipos";

export const dynamic = "force-dynamic";

/** Estado del Fundador: su pedido, su ePIN y su número entre los 100. */
export async function GET(peticion: Request) {
  const sesion = await sesionDePeticion(peticion);
  if (!sesion) {
    return NextResponse.json({ ok: false, error: "Sin sesión" }, { status: 401 });
  }

  try {
    const usuario = await usuarioPorCorreo(sesion.correo);
    if (!usuario) {
      return NextResponse.json({ ok: false, error: "Cuenta no encontrada" }, { status: 401 });
    }

    const pedido = await pedidoActivoDeCorreo(usuario.correo);
    const epin = pedido && pedido.estado === "pagado" ? await epinDePedido(pedido.id) : null;
    const numero = pedido && pedido.estado === "pagado" ? await numeroDeFundador(usuario.correo) : null;

    return NextResponse.json(
      {
        ok: true,
        usuario: { nombre: usuario.nombre, correo: usuario.correo, pais: usuario.pais },
        pedido: pedido
          ? { id: pedido.id, estado: pedido.estado, moneda: pedido.moneda, metodo: pedido.metodo, creado_en: pedido.creado_en }
          : null,
        epin: epin ? { codigo: epin.codigo } : null,
        numeroFundador: numero,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    console.error("Error leyendo cuenta:", e);
    return NextResponse.json({ ok: false, error: "Error leyendo la cuenta" }, { status: 500 });
  }
}

/** Crea (o reutiliza) el pedido del Fundador al elegir su forma de pago. */
export async function POST(peticion: Request) {
  const sesion = await sesionDePeticion(peticion);
  if (!sesion) {
    return NextResponse.json({ ok: false, error: "Sin sesión" }, { status: 401 });
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  const moneda = String(cuerpo.moneda ?? "").toUpperCase() as Moneda;
  if (moneda !== "EUR" && moneda !== "USD") {
    return NextResponse.json({ ok: false, error: "Moneda no válida" }, { status: 400 });
  }

  try {
    const usuario = await usuarioPorCorreo(sesion.correo);
    if (!usuario) {
      return NextResponse.json({ ok: false, error: "Cuenta no encontrada" }, { status: 401 });
    }

    const vigente = await pedidoActivoDeCorreo(usuario.correo);
    if (vigente && vigente.estado === "pagado") {
      return NextResponse.json({ ok: true, id: vigente.id, yaPagado: true });
    }

    const { id } = await crearPedido({
      nombre: usuario.nombre,
      correo: usuario.correo,
      pais: usuario.pais,
      moneda,
      metodo: moneda === "EUR" ? "sumup" : "bold",
      referido_por: null,
    });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error("Error creando pedido de cuenta:", e);
    return NextResponse.json({ ok: false, error: "No se pudo registrar el pedido" }, { status: 500 });
  }
}
