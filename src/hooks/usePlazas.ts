"use client";

import { useEffect, useState } from "react";
import { CAMPANA } from "@/lib/campana";

interface Plazas {
  total: number;
  ocupadas: number;
  restantes: number;
}

/** una sola consulta compartida por todos los componentes de la página */
let cache: Plazas | null = null;
let promesa: Promise<Plazas> | null = null;

function pedirPlazas(): Promise<Plazas> {
  if (cache) return Promise.resolve(cache);
  if (!promesa) {
    promesa = fetch("/datos/plazas", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const total = typeof d.total === "number" ? d.total : CAMPANA.totalPlazas;
        const ocupadas = typeof d.ocupadas === "number" ? d.ocupadas : 0;
        cache = { total, ocupadas, restantes: Math.max(total - ocupadas, 0) };
        return cache;
      })
      .catch(() => {
        const total = CAMPANA.totalPlazas;
        return { total, ocupadas: CAMPANA.plazasOcupadas, restantes: total - CAMPANA.plazasOcupadas };
      });
  }
  return promesa;
}

/** Plazas de la campaña leídas en vivo desde la base de datos. */
export function usePlazas(): Plazas {
  const [plazas, setPlazas] = useState<Plazas>(() => ({
    total: CAMPANA.totalPlazas,
    ocupadas: CAMPANA.plazasOcupadas,
    restantes: CAMPANA.totalPlazas - CAMPANA.plazasOcupadas,
  }));

  useEffect(() => {
    let activo = true;
    pedirPlazas().then((p) => {
      if (activo) setPlazas(p);
    });
    return () => {
      activo = false;
    };
  }, []);

  return plazas;
}
