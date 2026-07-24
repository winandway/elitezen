"use client";

import { useEffect, useState } from "react";
import { CRIPTO, PRECIOS } from "@/lib/campana";

type Moneda = "eur" | "usd";

/** Detecta si el visitante está en Europa para preseleccionar euros. */
function monedaSugerida(): Moneda {
  try {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (zona.startsWith("Europe/") || zona.startsWith("Atlantic/Canary")) {
      return "eur";
    }
  } catch {
    /* si el navegador no lo soporta, dejamos dólares */
  }
  return "usd";
}

export default function FormasDePago() {
  const [moneda, setMoneda] = useState<Moneda>("usd");
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    setMoneda(monedaSugerida());
    fetch("/datos/auth/yo", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setConectado(Boolean(d.conectado)))
      .catch(() => {});
  }, []);

  const precio = PRECIOS[moneda];
  const hayCripto = Boolean(CRIPTO.usdt || CRIPTO.usdc);
  /* con sesión va directo a su cuenta; sin sesión, primero crea la cuenta */
  const destino = conectado
    ? `/cuenta?pagar=${moneda}`
    : `/registro?pagar=${moneda}`;

  return (
    <section id="pago" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="wordmark text-[11px] text-oro-oscuro">Formas de pago</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Ocupa tu lugar entre los 100
          </h2>
          <div className="filete-oro mx-auto mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-slate-600">
            Crea tu cuenta de Fundador, elige la moneda de tu región y completa
            el pago único. Tu ePIN de activación quedará ligado a tu cuenta.
          </p>
        </div>

        {/* Tarjeta de precio */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(23,35,56,0.4)]">
          {/* Selector de moneda */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5">
            <button
              type="button"
              onClick={() => setMoneda("usd")}
              aria-pressed={moneda === "usd"}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                moneda === "usd"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-navy"
              }`}
            >
              Sudamérica e internacional
              <span className="mt-0.5 block text-xs font-normal opacity-80">
                Dólares (USD)
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMoneda("eur")}
              aria-pressed={moneda === "eur"}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                moneda === "eur"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-navy"
              }`}
            >
              Europa
              <span className="mt-0.5 block text-xs font-normal opacity-80">
                Euros (EUR)
              </span>
            </button>
          </div>

          <div className="p-7 text-center sm:p-10">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-slate-500">
              Membresía Fundador
            </p>

            <p className="mt-4 font-display text-6xl font-extrabold text-navy">
              {precio.importe}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {precio.nota} · Pago único
            </p>

            <a
              href={destino}
              className="btn-gold mt-8 block w-full rounded-full px-8 py-4 text-base tracking-wide"
            >
              {conectado ? "IR A MI CUENTA Y PAGAR" : "QUIERO SER FUNDADOR"}
            </a>

            <p className="mt-4 text-xs text-slate-500">
              {conectado
                ? "Continuarás en tu área de Fundador"
                : "Crearás tu cuenta y pagarás desde tu área de Fundador"}{" "}
              · Pago seguro con {moneda === "eur" ? "SumUp" : "Bold"}
            </p>

            <ul className="mt-7 space-y-2.5 border-t border-slate-200 pt-7 text-left text-sm text-slate-700">
              {[
                "Precio garantizado durante 3 años",
                "20% de descuento en cursos, eventos y conferencias",
                "2% de las membresías repartido entre Fundadores",
                "Plan de comisiones del 20% y 10%",
              ].map((linea) => (
                <li key={linea} className="flex items-start gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12.5l4 4L19 7"
                      stroke="var(--color-verde-deep)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {linea}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Criptomonedas — solo si hay direcciones configuradas */}
        {hayCripto && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-7">
            <h3 className="font-display text-lg font-bold text-navy">
              Pago con criptomonedas
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Aceptamos USDT y USDC en BNB Smart Chain (BEP20).
            </p>

            <div className="mt-5 space-y-3">
              {CRIPTO.usdt && (
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Dirección USDT (BEP20)
                  </p>
                  <p className="mt-1 break-all rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-navy">
                    {CRIPTO.usdt}
                  </p>
                </div>
              )}
              {CRIPTO.usdc && (
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Dirección USDC (BEP20)
                  </p>
                  <p className="mt-1 break-all rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-navy">
                    {CRIPTO.usdc}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-5 text-sm text-slate-600">
              Una vez realizado el pago, el usuario deberá enviar el comprobante
              para activar su Membresía Fundador.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
