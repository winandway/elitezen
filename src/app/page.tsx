import Image from "next/image";

/* Cupos de la campaña — en la Fase 3 se conecta a D1 (GET /datos/plazas) */
const TOTAL_PLAZAS = 100;
const PLAZAS_OCUPADAS = 17; // provisional para el vistazo de diseño

const beneficios = [
  {
    titulo: "Membresía Fundador",
    destacado: "49 € IVA incluido",
    texto: "Precio garantizado durante 3 años.",
  },
  {
    titulo: "Descuentos exclusivos",
    destacado: "20% de descuento",
    texto: "En cursos premium, eventos, conferencias y actividades.",
  },
  {
    titulo: "Participación en el crecimiento",
    destacado: "2% de las membresías",
    texto: "Repartido mensualmente entre todos los Fundadores activos.",
  },
  {
    titulo: "Genera ingresos desde el primer día",
    destacado: "20% + 10%",
    texto: "Plan de comisiones de dos niveles al recomendar la Academia.",
  },
  {
    titulo: "Rango Embajador",
    destacado: "+5% adicional",
    texto: "Al alcanzar 50 miembros activos en tu red.",
  },
];

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      aria-hidden="true"
      fill="none"
    >
      <circle cx="12" cy="12" r="11" fill="var(--color-verde)" opacity="0.15" />
      <path
        d="M7 12.5l3.2 3.2L17 8.8"
        stroke="var(--color-verde)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const restantes = TOTAL_PLAZAS - PLAZAS_OCUPADAS;
  const pct = Math.round((PLAZAS_OCUPADAS / TOTAL_PLAZAS) * 100);

  return (
    <main className="relative overflow-hidden">
      {/* ===================== HEADER ===================== */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Image
          src="/logo-elitezen.png"
          alt="Academia EliteZen"
          width={1080}
          height={941}
          priority
          className="h-11 w-auto sm:h-12"
        />
        <a
          href="#fundador"
          className="btn-gold hidden rounded-full px-5 py-2.5 text-sm sm:inline-block"
        >
          Quiero ser Fundador
        </a>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="dot-grid relative">
        <div className="hero-glow absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-10 text-center sm:pt-16">
          <Image
            src="/logo-elitezen.png"
            alt=""
            width={1080}
            height={941}
            priority
            className="mx-auto mb-8 h-28 w-auto rise sm:h-36"
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

          {/* CTA */}
          <div className="rise mt-8">
            <a
              id="fundador"
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
                Quedan <span className="text-gold-gradient">{restantes}</span>{" "}
                de {TOTAL_PLAZAS}
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background:
                    "linear-gradient(90deg, var(--color-gold-deep), var(--color-gold))",
                }}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              La campaña permanecerá abierta hasta el{" "}
              <span className="font-semibold text-slate-200">
                15 de agosto de 2026
              </span>{" "}
              o hasta completar las 100 plazas, lo que ocurra primero.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== BANDA DE URGENCIA ===================== */}
      <section className="border-y border-gold/20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
        <div className="mx-auto max-w-6xl px-5 py-6 text-center">
          <p className="wordmark text-xs text-gold sm:text-sm">
            Solo existirán 100 Fundadores
          </p>
        </div>
      </section>

      {/* ===================== BENEFICIOS (adelanto) ===================== */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
            Beneficios <span className="text-gold-gradient">exclusivos</span>
          </h2>
          <p className="mt-4 text-slate-300">
            Ventajas que no volverán a ofrecerse una vez finalizada esta
            campaña.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((b) => (
            <div
              key={b.titulo}
              className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 transition hover:border-gold/30 hover:bg-navy-800"
            >
              <Check />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {b.titulo}
              </h3>
              <p className="mt-1 font-display text-xl font-bold text-gold-gradient">
                {b.destacado}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {b.texto}
              </p>
            </div>
          ))}

          {/* Tarjeta de llamada a la acción — cierra la cuadrícula */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/[0.12] via-navy-800 to-navy-800 p-6 text-center">
            <Image
              src="/logo-elitezen.png"
              alt=""
              width={1080}
              height={941}
              className="h-14 w-auto opacity-95"
            />
            <p className="mt-4 font-display text-lg font-bold text-white">
              Tu lugar entre los{" "}
              <span className="text-gold-gradient">100</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Estas ventajas no volverán a ofrecerse una vez cerrada la
              campaña. Asegura hoy tu Membresía Fundador.
            </p>
            <a
              href="#pago"
              className="btn-gold mt-5 inline-block rounded-full px-6 py-3 text-sm tracking-wide"
            >
              QUIERO SER FUNDADOR
            </a>
          </div>
        </div>
      </section>

      {/* Marcador de secciones pendientes (Fase 1) */}
      <div className="mx-auto max-w-6xl px-5 pb-16 text-center text-xs text-slate-500">
        · Vistazo de diseño — el resto de secciones llegan en la Fase 1 ·
      </div>
    </main>
  );
}
