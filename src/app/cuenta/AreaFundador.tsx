"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { lanzarConfeti } from "@/lib/confeti";
import { ENLACES_PAGO, PRECIOS } from "@/lib/campana";

type MonedaUi = "eur" | "usd";

interface EstadoCuenta {
  usuario: { nombre: string; correo: string; pais: string | null };
  pedido: {
    id: string;
    estado: "pendiente" | "pagado" | "anulado";
    moneda: string;
    metodo: string;
    creado_en: string;
  } | null;
  epin: { codigo: string } | null;
  numeroFundador: number | null;
}

function monedaSugerida(): MonedaUi {
  try {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (zona.startsWith("Europe/") || zona.startsWith("Atlantic/Canary")) return "eur";
  } catch {
    /* nada */
  }
  return "usd";
}

export default function AreaFundador() {
  const router = useRouter();
  const parametros = useSearchParams();
  const pagarParam = parametros.get("pagar");

  const [cuenta, setCuenta] = useState<EstadoCuenta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [moneda, setMoneda] = useState<MonedaUi>("usd");
  const [procesando, setProcesando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [copiado, setCopiado] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const celebrado = useRef(false);

  const cargar = useCallback(async () => {
    try {
      const r = await fetch("/datos/cuenta", { cache: "no-store" });
      if (r.status === 401) {
        router.replace(pagarParam ? `/entrar?pagar=${pagarParam}` : "/entrar");
        return;
      }
      const d = await r.json();
      if (d.ok) setCuenta(d);
    } finally {
      setCargando(false);
    }
  }, [router, pagarParam]);

  useEffect(() => {
    setMoneda(pagarParam === "eur" || pagarParam === "usd" ? pagarParam : monedaSugerida());
    cargar();
  }, [cargar, pagarParam]);

  /* confeti al ver la plaza confirmada */
  useEffect(() => {
    if (
      cuenta?.pedido?.estado === "pagado" &&
      canvasRef.current &&
      !celebrado.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      celebrado.current = true;
      lanzarConfeti(canvasRef.current, 5000);
    }
  }, [cuenta]);

  async function reservarYPagar() {
    setProcesando(true);
    setAviso("");
    try {
      const r = await fetch("/datos/cuenta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ moneda: moneda.toUpperCase() }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) {
        setAviso(d.error || "No se pudo registrar tu pedido. Intenta de nuevo.");
        setProcesando(false);
        return;
      }
      window.open(ENLACES_PAGO[moneda], "_blank", "noopener,noreferrer");
      await cargar();
    } catch {
      setAviso("Error de conexión. Intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
  }

  async function salir() {
    await fetch("/datos/auth/salir", { method: "POST" });
    router.replace("/");
  }

  if (cargando || !cuenta) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy">
        <p className="wordmark text-xs text-gold">Cargando tu cuenta...</p>
      </main>
    );
  }

  const { usuario, pedido, epin, numeroFundador } = cuenta;
  const monedaPedido: MonedaUi = pedido?.moneda === "EUR" ? "eur" : "usd";

  return (
    <main className="dot-grid relative min-h-screen">
      <div className="hero-glow absolute inset-0" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70]"
      />

      {/* cabecera */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/">
            <Image
              src="/logo-elitezen.png"
              alt="Academia EliteZen"
              width={1080}
              height={941}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-300 sm:inline">
              Hola, <span className="font-semibold text-white">{usuario.nombre}</span>
            </span>
            <button
              type="button"
              onClick={salir}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-12">
        {/* ================= PLAZA CONFIRMADA ================= */}
        {pedido?.estado === "pagado" && (
          <div className="text-center">
            <p className="wordmark text-[11px] text-gold">Plaza confirmada</p>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
              ¡Felicidades, {usuario.nombre.split(" ")[0]}!
            </h1>
            {numeroFundador && (
              <p className="mx-auto mt-6 inline-block rounded-full border border-gold/40 bg-gold/10 px-6 py-2 font-display text-lg font-bold text-gold-gradient">
                Eres el Fundador #{numeroFundador} de 100
              </p>
            )}
            <p className="mx-auto mt-6 max-w-md text-slate-300">
              Tu lugar en la historia de Academia EliteZen está asegurado. Este
              es tu ePIN: guárdalo bien, con él activarás tu cuenta cuando la
              plataforma abra sus puertas.
            </p>

            {epin && (
              <div className="mx-auto mt-8 max-w-sm">
                <p className="rounded-2xl border-2 border-dashed border-gold/60 bg-navy-800/70 px-4 py-6 font-mono text-2xl font-bold tracking-wider text-gold">
                  {epin.codigo}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(epin.codigo);
                    setCopiado(true);
                  }}
                  className="btn-gold mt-4 w-full rounded-full px-6 py-3 text-sm"
                >
                  {copiado ? "¡Copiado!" : "Copiar mi ePIN"}
                </button>
              </div>
            )}

            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-navy-800/60 p-6 text-left">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-slate-300">
                Tus beneficios de Fundador
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>· Precio de 49 garantizado durante 3 años</li>
                <li>· 20% de descuento en cursos, eventos y conferencias</li>
                <li>· Participación del 2% de las membresías</li>
                <li>· Comisiones del 20% y 10% desde el primer día</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= PAGO EN VERIFICACIÓN ================= */}
        {pedido?.estado === "pendiente" && (
          <div className="text-center">
            <p className="wordmark text-[11px] text-gold">Tu plaza está reservada</p>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-white">
              Pago en verificación
            </h1>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-slate-300">
              Registramos tu reserva con el método{" "}
              <span className="font-semibold text-white">
                {pedido.metodo === "sumup" ? "SumUp (euros)" : "Bold (dólares)"}
              </span>
              . En cuanto confirmemos tu pago, aquí mismo aparecerá tu{" "}
              <span className="font-semibold text-gold">ePIN de Fundador</span>{" "}
              y tu número entre los 100.
            </p>

            <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-amber-300/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
              La verificación es manual y puede tardar unas horas. Te avisaremos
              también por correo a {usuario.correo}.
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={ENLACES_PAGO[monedaPedido]}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold rounded-full px-8 py-4 text-sm tracking-wide"
              >
                ¿No completaste el pago? Ábrelo de nuevo
              </a>
              <button
                type="button"
                onClick={() => cargar()}
                className="text-sm text-slate-400 underline-offset-2 transition hover:text-white hover:underline"
              >
                Ya pagué — actualizar estado
              </button>
            </div>
          </div>
        )}

        {/* ================= RESERVAR PLAZA ================= */}
        {!pedido && (
          <div>
            <div className="text-center">
              <p className="wordmark text-[11px] text-gold">
                Bienvenido, {usuario.nombre.split(" ")[0]}
              </p>
              <h1 className="mt-4 font-display text-3xl font-extrabold text-white">
                Reserva tu plaza de Fundador
              </h1>
              <p className="mx-auto mt-4 max-w-md text-slate-300">
                Estás a un paso: elige la moneda de tu región y completa el
                pago único de tu Membresía Fundador.
              </p>
            </div>

            <div className="mx-auto mt-9 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-navy-800/70 backdrop-blur">
              <div className="flex border-b border-white/10 bg-navy-900/60 p-1.5">
                {(
                  [
                    ["usd", "Sudamérica e internacional", "Dólares (USD)"],
                    ["eur", "Europa", "Euros (EUR)"],
                  ] as [MonedaUi, string, string][]
                ).map(([m, titulo, sub]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMoneda(m)}
                    aria-pressed={moneda === m}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      moneda === m
                        ? "bg-gold text-navy-900 shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {titulo}
                    <span className="mt-0.5 block text-xs font-normal opacity-80">
                      {sub}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-7 text-center">
                <p className="font-display text-5xl font-extrabold text-white">
                  {PRECIOS[moneda].importe}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {PRECIOS[moneda].nota} · Pago único
                </p>

                {aviso && (
                  <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {aviso}
                  </p>
                )}

                <button
                  type="button"
                  onClick={reservarYPagar}
                  disabled={procesando}
                  className="btn-gold mt-6 w-full rounded-full px-8 py-4 text-base tracking-wide disabled:opacity-60"
                >
                  {procesando
                    ? "Reservando..."
                    : moneda === "eur"
                      ? "PAGAR EN EUROS"
                      : "PAGAR EN DÓLARES"}
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Pago seguro con {moneda === "eur" ? "SumUp" : "Bold"} · Se abre
                  en una ventana nueva
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
