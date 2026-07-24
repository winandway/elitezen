import Image from "next/image";
import { CAMPANA } from "@/lib/campana";

export default function Hero() {
  const { totalPlazas, plazasOcupadas, fechaCierre } = CAMPANA;
  const restantes = totalPlazas - plazasOcupadas;
  const pct = Math.round((plazasOcupadas / totalPlazas) * 100);

  return (
    <>
      <section id="inicio" className="dot-grid relative">
        <div className="hero-glow absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-28 text-center sm:pt-32">
          <Image
            src="/logo-elitezen.png"
            alt=""
            width={1080}
            height={941}
            priority
            className="rise mx-auto mb-8 h-28 w-auto sm:h-36"
          />

          <p className="wordmark rise text-[11px] text-gold sm:text-xs">
            Campaña de Fundadores
          </p>

          <h1 className="rise mt-5 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl">
            Forma parte de los{" "}
            <span className="text-gold-gradient">100 Fundadores</span> de
            Academia EliteZen
          </h1>

          <p className="rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Participa desde el inicio en un proyecto con visión de futuro. No
            buscamos simplemente nuevos miembros: buscamos a las primeras 100
            personas que quieran construir, crecer y compartir el desarrollo de
            la Academia desde su nacimiento.
          </p>

          <div className="rise mt-8">
            <a
              href="#pago"
              className="btn-gold inline-block rounded-full px-9 py-4 text-base tracking-wide"
            >
              QUIERO SER FUNDADOR
            </a>
          </div>

          {/* Contador de plazas */}
          <div className="rise mx-auto mt-12 max-w-md rounded-2xl border border-white/10 bg-navy-800/70 p-6 backdrop-blur">
            <div className="flex items-end justify-between">
              <span className="font-display text-sm font-medium text-slate-300">
                Plazas disponibles
              </span>
              <span className="font-display text-lg font-bold text-white">
                Quedan <span className="text-gold-gradient">{restantes}</span> de{" "}
                {totalPlazas}
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
              <span className="font-semibold text-slate-200">{fechaCierre}</span>{" "}
              o hasta completar las {totalPlazas} plazas, lo que ocurra primero.
            </p>
          </div>
        </div>
      </section>

      {/* Banda de urgencia */}
      <section className="border-y border-gold/20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
        <div className="mx-auto max-w-6xl px-5 py-6 text-center">
          <p className="wordmark text-xs text-gold sm:text-sm">
            Solo existirán {totalPlazas} Fundadores
          </p>
        </div>
      </section>
    </>
  );
}
