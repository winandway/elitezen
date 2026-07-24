"use client";

import { usePlazas } from "@/hooks/usePlazas";
import { CAMPANA } from "@/lib/campana";

/** Tarjeta "Quedan X de 100" del hero, conectada a la base de datos. */
export default function ContadorPlazas() {
  const { total, ocupadas, restantes } = usePlazas();
  const pct = Math.round((ocupadas / total) * 100);

  return (
    <div className="rise mx-auto mt-12 max-w-md rounded-2xl border border-white/10 bg-navy-800/70 p-6 backdrop-blur">
      <div className="flex items-end justify-between">
        <span className="font-display text-sm font-medium text-slate-300">
          Plazas disponibles
        </span>
        <span className="font-display text-lg font-bold text-white">
          Quedan <span className="text-gold-gradient">{restantes}</span> de{" "}
          {total}
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.max(pct, 2)}%`,
            background:
              "linear-gradient(90deg, var(--color-gold-deep), var(--color-gold))",
          }}
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
