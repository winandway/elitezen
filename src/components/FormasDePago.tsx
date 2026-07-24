"use client";

import { useEffect, useState } from "react";
import { CRIPTO, ENLACES_PAGO, PRECIOS } from "@/lib/campana";

type Moneda = "eur" | "usd";

interface EstadoRegistro {
  abierto: boolean;
  enviando: boolean;
  error: string;
  hecho: boolean;
}

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
  const [registro, setRegistro] = useState<EstadoRegistro>({
    abierto: false,
    enviando: false,
    error: "",
    hecho: false,
  });

  useEffect(() => {
    setMoneda(monedaSugerida());
  }, []);

  const precio = PRECIOS[moneda];
  const enlace = ENLACES_PAGO[moneda];
  const hayCripto = Boolean(CRIPTO.usdt || CRIPTO.usdc);

  /** Registra el pedido y abre la pasarela. Si el registro falla, el pago
   *  se abre igual: nunca se pierde una venta por un error nuestro. */
  async function registrarYPagar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setRegistro((r) => ({ ...r, enviando: true, error: "" }));

    const datos = {
      nombre: String(f.get("nombre") ?? ""),
      correo: String(f.get("correo") ?? ""),
      pais: String(f.get("pais") ?? ""),
      moneda: moneda.toUpperCase(),
      metodo: moneda === "eur" ? "sumup" : "bold",
    };

    try {
      const r = await fetch("/datos/pedido", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(datos),
      });
      const cuerpo = await r.json();
      if (!r.ok || !cuerpo.ok) {
        // error de validación: se muestra y NO se abre el pago
        setRegistro((s) => ({
          ...s,
          enviando: false,
          error: cuerpo.error || "No se pudo registrar. Revisa los datos.",
        }));
        return;
      }
    } catch {
      // error de red/servidor: seguimos al pago para no perder la venta
    }

    setRegistro({ abierto: false, enviando: false, error: "", hecho: true });
    window.open(enlace, "_blank", "noopener,noreferrer");
  }

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
            Elige la moneda de tu región. El pago es único y te da acceso a la
            Membresía Fundador.
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

            <button
              type="button"
              onClick={() =>
                setRegistro({ abierto: true, enviando: false, error: "", hecho: false })
              }
              className="btn-gold mt-8 block w-full rounded-full px-8 py-4 text-base tracking-wide"
            >
              {moneda === "eur" ? "PAGAR EN EUROS" : "PAGAR EN DÓLARES"}
            </button>

            {registro.hecho && (
              <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                ¡Registro recibido! Completa el pago en la ventana que se abrió.
                Al confirmarse, recibirás tu ePIN de Fundador por correo.
              </p>
            )}

            <p className="mt-4 text-xs text-slate-500">
              Pago seguro con {moneda === "eur" ? "SumUp" : "Bold"}
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
              Una vez realizado el pago, envía el comprobante para activar tu
              Membresía Fundador.
            </p>
            <a
              href="#comprobante"
              className="btn-gold-outline mt-4 inline-block rounded-full px-6 py-3 text-sm"
            >
              ENVIAR COMPROBANTE
            </a>
          </div>
        )}

        {/* ---------- Modal de registro antes del pago ---------- */}
        {registro.abierto && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-900/80 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Registro de Fundador"
          >
            <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    Reserva tu plaza
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Con estos datos registramos tu Membresía Fundador y te
                    enviaremos tu ePIN al confirmarse el pago.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRegistro((r) => ({ ...r, abierto: false }))}
                  aria-label="Cerrar"
                  className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={registrarYPagar} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="reg-nombre"
                    className="block text-sm font-semibold text-navy"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="reg-nombre"
                    name="nombre"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="Nombre y apellido"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-navy outline-none transition focus:border-gold-deep focus:ring-2 focus:ring-gold/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-correo"
                    className="block text-sm font-semibold text-navy"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="reg-correo"
                    name="correo"
                    type="email"
                    required
                    maxLength={200}
                    placeholder="correo@ejemplo.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-navy outline-none transition focus:border-gold-deep focus:ring-2 focus:ring-gold/40"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Aquí llegará tu ePIN de activación.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="reg-pais"
                    className="block text-sm font-semibold text-navy"
                  >
                    País <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    id="reg-pais"
                    name="pais"
                    maxLength={60}
                    placeholder="País donde vives"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-navy outline-none transition focus:border-gold-deep focus:ring-2 focus:ring-gold/40"
                  />
                </div>

                {registro.error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {registro.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={registro.enviando}
                  className="btn-gold w-full rounded-full px-8 py-4 text-base tracking-wide disabled:opacity-60"
                >
                  {registro.enviando
                    ? "Guardando..."
                    : `CONTINUAR AL PAGO (${precio.importe})`}
                </button>

                <p className="text-center text-xs text-slate-500">
                  El pago se abre en una ventana segura de{" "}
                  {moneda === "eur" ? "SumUp" : "Bold"}.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
