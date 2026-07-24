import { NextResponse } from "next/server";
import {
  cabeceraCookieSesion,
  crearToken,
  secretoDeSesion,
  verificarClave,
} from "@/lib/auth";
import { usuarioPorCorreo } from "@/lib/repositorio";

/** Inicia sesión con correo y contraseña. */
export async function POST(peticion: Request) {
  const secreto = await secretoDeSesion();
  if (!secreto) {
    return NextResponse.json(
      { ok: false, error: "Las cuentas aún no están activas en este sitio." },
      { status: 503 },
    );
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido" }, { status: 400 });
  }

  const correo = String(cuerpo.correo ?? "").trim().toLowerCase();
  const clave = String(cuerpo.clave ?? "");
  const respuestaError = NextResponse.json(
    { ok: false, error: "Correo o contraseña incorrectos" },
    { status: 401 },
  );

  if (!correo || !clave) return respuestaError;

  try {
    const usuario = await usuarioPorCorreo(correo);
    if (!usuario) return respuestaError;

    const valida = await verificarClave(clave, usuario.clave_sal, usuario.clave_hash);
    if (!valida) return respuestaError;

    const token = await crearToken(
      { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre },
      secreto,
    );
    return NextResponse.json(
      { ok: true, nombre: usuario.nombre },
      { headers: { "set-cookie": cabeceraCookieSesion(token) } },
    );
  } catch (e) {
    console.error("Error en entrada:", e);
    return NextResponse.json({ ok: false, error: "No se pudo iniciar sesión" }, { status: 500 });
  }
}
