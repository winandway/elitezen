import { NextResponse } from "next/server";
import { cabeceraCookieSalir } from "@/lib/auth";

/** Cierra la sesión (borra la cookie). */
export async function POST() {
  return NextResponse.json(
    { ok: true },
    { headers: { "set-cookie": cabeceraCookieSalir() } },
  );
}
