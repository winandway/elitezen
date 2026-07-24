"use client";

import { usePlazas } from "@/hooks/usePlazas";
import { CAMPANA } from "@/lib/campana";

/** Línea "Quedan X de Y plazas · Campaña abierta hasta..." en vivo. */
export default function PlazasEnLinea() {
  const { total, restantes } = usePlazas();

  return (
    <p className="mt-6 text-sm text-slate-400">
      Quedan <span className="font-semibold text-gold">{restantes}</span> de{" "}
      {total} plazas · Campaña abierta hasta el {CAMPANA.fechaCierre}
    </p>
  );
}
