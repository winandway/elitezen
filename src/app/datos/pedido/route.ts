import { NextResponse } from "next/server";
import { crearPedido } from "@/lib/repositorio";
import type { Metodo, Moneda } from "@/lib/tipos";

const MONEDAS: Moneda[] = ["EUR", "USD", "CRIPTO"];
const METODOS: Metodo[] = ["sumup", "bold", "usdt", "usdc"];
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Registro público: crea el pedido en estado pendiente antes del pago. */
export async function POST(peticion: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  const nombre = String(cuerpo.nombre ?? "").trim();
  const correo = String(cuerpo.correo ?? "").trim();
  const pais = String(cuerpo.pais ?? "").trim() || null;
  const moneda = String(cuerpo.moneda ?? "") as Moneda;
  const metodo = String(cuerpo.metodo ?? "") as Metodo;
  const referido = String(cuerpo.referido ?? "").trim() || null;

  if (nombre.length < 2 || nombre.length > 120) {
    return NextResponse.json({ ok: false, error: "Escribe tu nombre completo" }, { status: 400 });
  }
  if (!CORREO_VALIDO.test(correo) || correo.length > 200) {
    return NextResponse.json({ ok: false, error: "Revisa el correo electrónico" }, { status: 400 });
  }
  if (!MONEDAS.includes(moneda) || !METODOS.includes(metodo)) {
    return NextResponse.json({ ok: false, error: "Forma de pago no válida" }, { status: 400 });
  }

  try {
    const { id, reutilizado } = await crearPedido({
      nombre,
      correo,
      pais,
      moneda,
      metodo,
      referido_por: referido,
    });
    return NextResponse.json({ ok: true, id, reutilizado });
  } catch (e) {
    console.error("Error creando pedido:", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el registro" },
      { status: 500 },
    );
  }
}
