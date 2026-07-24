import Image from "next/image";
import ContadorPlazas from "./ContadorPlazas";
import { CAMPANA } from "@/lib/campana";

export default function Hero() {
  const { totalPlazas } = CAMPANA;

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

          {/* Contador de plazas en vivo (lee la base de datos) */}
          <ContadorPlazas />
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
