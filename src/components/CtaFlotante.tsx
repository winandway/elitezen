"use client";

import { useEffect, useState } from "react";
import { CAMPANA } from "@/lib/campana";

/**
 * Botón de llamada a la acción siempre visible durante el scroll.
 * Aparece al pasar el hero y se oculta al llegar al bloque de pago.
 */
export default function CtaFlotante() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pago = document.getElementById("pago");

    const alScroll = () => {
      const pasoElHero = window.scrollY > 620;
      let enZonaDePago = false;
      if (pago) {
        const r = pago.getBoundingClientRect();
        enZonaDePago = r.top < window.innerHeight * 0.9 && r.bottom > 0;
      }
      setVisible(pasoElHero && !enZonaDePago);
    };

    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  const restantes = CAMPANA.totalPlazas - CAMPANA.plazasOcupadas;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 transition-all duration-300 sm:inset-x-auto sm:right-6 sm:px-0 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href="#pago"
        className="btn-gold flex items-center justify-center gap-3 rounded-full px-6 py-4 text-sm tracking-wide sm:py-3.5"
      >
        <span>QUIERO SER FUNDADOR</span>
        <span className="hidden rounded-full bg-navy-900/15 px-2.5 py-1 text-xs font-semibold sm:inline">
          Quedan {restantes}
        </span>
      </a>
    </div>
  );
}
