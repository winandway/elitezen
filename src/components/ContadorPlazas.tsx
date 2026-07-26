"use client";

import { usePlazas } from "@/hooks/usePlazas";
import { CAMPANA } from "@/lib/campana";

/** Tarjeta "Quedan X de 100" del hero, conectada a la base de datos.
 *  Se refresca sola cada 45 segundos. */
export default function ContadorPlazas() {
  const { total, ocupadas, restantes } = usePlazas();
  const pct = Math.round((ocupadas / total) * 100);

  return (
    <div className="rise mx-auto mt-7 w-full max-w-xl rounded-2xl border border-gold/25 bg-navy-800/80 p-6 backdrop-blur sm:p-7">
      <div className="flex items-end justify-between gap-3">
        <span className="font-display text-sm font-medium text-slate-300">
          Plazas disponibles
        </span>
        <span className="font-display text-xl font-bold text-white sm:text-2xl">
          Quedan <span className="text-gold-gradient">{restantes}</span> de{" "}
          {total}
        </span>
      </div>
      <div className="mt-4 h-5 w-full overflow-hidden rounded-full bg-white/10 sm:h-6">
        <div
          className="barra-rayada h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        La campaña permanecerá abierta hasta el{" "}
        <span className="font-semibold text-slate-200">{CAMPANA.fechaCierre}</span>{" "}
        o hasta completar las {total} plazas, lo que ocurra primero.
      </p>
    </div>
  );
}
