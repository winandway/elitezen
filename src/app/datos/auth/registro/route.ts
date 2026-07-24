import { NextResponse } from "next/server";
import {
  cabeceraCookieSesion,
  crearToken,
  hashDeClave,
  secretoDeSesion,
} from "@/lib/auth";
import { crearUsuario } from "@/lib/repositorio";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Crea la cuenta del Fundador y abre su sesión. */
export async function POST(peticion: Request) {
  const secreto = await secretoDeSesion();
  if (!secreto) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Las cuentas aún no están activas. Configura PANEL_CLAVE en las variables de entorno del sitio.",
      },
      { status: 503 },
    );
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  const nombre = String(cuerpo.nombre ?? "").trim();
  const correo = String(cuerpo.correo ?? "").trim().toLowerCase();
  const pais = String(cuerpo.pais ?? "").trim() || null;
  const clave = String(cuerpo.clave ?? "");

  if (nombre.length < 2 || nombre.length > 120) {
    return NextResponse.json({ ok: false, error: "Escribe tu nombre completo" }, { status: 400 });
  }
  if (!CORREO_VALIDO.test(correo) || correo.length > 200) {
    return NextResponse.json({ ok: false, error: "Revisa el correo electrónico" }, { status: 400 });
  }
  if (clave.length < 8 || clave.length > 100) {
    return NextResponse.json(
      { ok: false, error: "La contraseña debe tener al menos 8 caracteres" },
      { status: 400 },
    );
  }

  try {
    const { sal, hash } = await hashDeClave(clave);
    const r = await crearUsuario({
      nombre,
      correo,
      pais,
      clave_sal: sal,
      clave_hash: hash,
    });
    if (!r.ok || !r.usuario) {
      return NextResponse.json({ ok: false, error: r.error }, { status: 409 });
    }

    const token = await crearToken(
      { id: r.usuario.id, correo: r.usuario.correo, nombre: r.usuario.nombre },
      secreto,
    );
    return NextResponse.json(
      { ok: true, nombre: r.usuario.nombre },
      { headers: { "set-cookie": cabeceraCookieSesion(token) } },
    );
  } catch (e) {
    console.error("Error en registro:", e);
    return NextResponse.json({ ok: false, error: "No se pudo crear la cuenta" }, { status: 500 });
  }
}
