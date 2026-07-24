import { NextResponse } from "next/server";
import { CAMPANA } from "@/lib/campana";
import { contarPlazas } from "@/lib/repositorio";

export const dynamic = "force-dynamic";

/** Contador público de plazas: alimenta la barra "Quedan X de 100". */
export async function GET() {
  try {
    const { ocupadas } = await contarPlazas();
    const total = CAMPANA.totalPlazas;
    return NextResponse.json(
      {
        ok: true,
        total,
        ocupadas: Math.min(ocupadas, total),
        restantes: Math.max(total - ocupadas, 0),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    console.error("Error contando plazas:", e);
    return NextResponse.json(
      { ok: false, total: CAMPANA.totalPlazas, restantes: CAMPANA.totalPlazas, ocupadas: 0 },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }
}
