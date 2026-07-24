import { NextResponse } from "next/server";
import { sesionDePeticion } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Dice si hay sesión abierta (para la cabecera de la página). */
export async function GET(peticion: Request) {
  const sesion = await sesionDePeticion(peticion);
  return NextResponse.json(
    sesion
      ? { conectado: true, nombre: sesion.nombre }
      : { conectado: false },
    { headers: { "cache-control": "no-store" } },
  );
}
