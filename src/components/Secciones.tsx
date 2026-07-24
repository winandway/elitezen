import Image from "next/image";
import Revelar from "./Revelar";
import { AREAS, BENEFICIOS, CAMPANA, FIRMAS, VISION } from "@/lib/campana";

/* ---------- piezas pequeñas ---------- */

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" aria-hidden="true">
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

/** Marca decorativa dorada, eco del logo */
function Hoja({ claro = false }: { claro?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M12 3c3 3.6 5 6.4 5 9.2A5 5 0 0 1 7 12.2C7 9.4 9 6.6 12 3z"
        fill={claro ? "var(--color-gold-deep)" : "var(--color-gold)"}
      />
    </svg>
  );
}

/* ---------- ¿POR QUÉ SER FUNDADOR? ---------- */

export function PorQueSerFundador() {
  return (
    <section id="por-que" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Revelar>
          <p className="wordmark text-[11px] text-gold">¿Por qué ser Fundador?</p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-4xl">
            Las grandes oportunidades se reservan para quienes creen{" "}
            <span className="text-gold-gradient">desde el comienzo</span>
          </h2>
          <div className="filete-oro mx-auto mt-6" />
        </Revelar>

        <Revelar retraso={100}>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            <p>
              Como Fundador de Academia EliteZen formarás parte de una comunidad
              internacional comprometida con el aprendizaje, el crecimiento
              personal, la tecnología, el liderazgo, el emprendimiento y la
              colaboración.
            </p>
            <p>
              Además, disfrutarás de unas ventajas exclusivas que{" "}
              <span className="font-semibold text-white">
                no volverán a ofrecerse
              </span>{" "}
              una vez finalizada esta campaña.
            </p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* ---------- BENEFICIOS EXCLUSIVOS ---------- */

export function Beneficios() {
  return (
    <section id="beneficios" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <Revelar>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
            Beneficios <span className="text-gold-gradient">exclusivos</span>
          </h2>
          <p className="mt-4 text-slate-300">
            Ventajas que no volverán a ofrecerse una vez finalizada esta campaña.
          </p>
        </div>
      </Revelar>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFICIOS.map((b, i) => (
          <Revelar key={b.titulo} retraso={i * 70}>
            <div className="h-full rounded-2xl border border-white/10 bg-navy-800/60 p-6 transition hover:border-gold/30 hover:bg-navy-800">
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
          </Revelar>
        ))}

        <Revelar retraso={350}>
          <div className="relative flex h-full flex-col items-center justify-center rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/[0.12] via-navy-800 to-navy-800 p-6 text-center">
            <Image
              src="/logo-elitezen.png"
              alt=""
              width={1080}
              height={941}
              className="h-14 w-auto opacity-95"
            />
            <p className="mt-4 font-display text-lg font-bold text-white">
              Tu lugar entre los <span className="text-gold-gradient">100</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Estas ventajas no volverán a ofrecerse una vez cerrada la campaña.
              Asegura hoy tu Membresía Fundador.
            </p>
            <a
              href="#pago"
              className="btn-gold mt-5 inline-block rounded-full px-6 py-3 text-sm tracking-wide"
            >
              QUIERO SER FUNDADOR
            </a>
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* ---------- ¿QUÉ ES ACADEMIA ELITEZEN? (sección clara) ---------- */

export function QueEsEliteZen() {
  return (
    <section id="academia" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Revelar>
          <div className="mx-auto max-w-2xl text-center">
            <p className="wordmark text-[11px] text-oro-oscuro">La Academia</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl">
              ¿Qué es Academia EliteZen?
            </h2>
            <div className="filete-oro mx-auto mt-5" />
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Nace como una plataforma internacional de aprendizaje y
              crecimiento: un espacio donde personas de distintos países podrán
              desarrollarse en áreas como
            </p>
          </div>
        </Revelar>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area, i) => (
            <Revelar key={area} retraso={i * 45}>
              <div className="flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 transition hover:border-gold-deep/40 hover:bg-white">
                <Hoja claro />
                <span className="font-display text-sm font-semibold text-navy">
                  {area}
                </span>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar retraso={150}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-lg leading-relaxed text-slate-700">
            Nuestro propósito es formar personas{" "}
            <span className="font-semibold text-navy">más preparadas</span>,{" "}
            <span className="font-semibold text-navy">más libres</span> y mejor
            conectadas con las oportunidades del siglo XXI.
          </p>
        </Revelar>
      </div>
    </section>
  );
}

/* ---------- NUESTRA VISIÓN A CINCO AÑOS (sección clara) ---------- */

export function Vision() {
  return (
    <section id="vision" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Revelar>
          <div className="text-center">
            <p className="wordmark text-[11px] text-oro-oscuro">A dónde vamos</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl">
              Nuestra visión a cinco años
            </h2>
            <div className="filete-oro mx-auto mt-5" />
            <p className="mt-6 text-slate-600">
              Ser Fundador no es adquirir una membresía: es participar en la
              construcción de algo que aspira a consolidarse con el tiempo.
            </p>
          </div>
        </Revelar>

        <ol className="mt-10 space-y-4">
          {VISION.map((punto, i) => (
            <Revelar key={punto} retraso={i * 80}>
              <li className="flex items-start gap-4 rounded-2xl border border-navy/10 bg-white px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-gold">
                  {i + 1}
                </span>
                <span className="pt-1.5 leading-relaxed text-slate-700">
                  {punto}
                </span>
              </li>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- URGENCIA ---------- */

export function Urgencia() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="hero-glow absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <Revelar>
          <p className="wordmark text-[11px] text-gold">Urgencia</p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-4xl">
            Solo para los primeros{" "}
            <span className="text-gold-gradient">100 Fundadores</span>
          </h2>
          <p className="mt-6 text-slate-300">Esta oportunidad desaparecerá cuando:</p>
        </Revelar>

        <Revelar retraso={100}>
          <div className="mx-auto mt-7 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gold/25 bg-navy-800/70 p-6">
              <p className="font-display text-3xl font-extrabold text-gold-gradient">
                100
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Se completen las plazas
              </p>
            </div>
            <div className="rounded-2xl border border-gold/25 bg-navy-800/70 p-6">
              <p className="font-display text-xl font-extrabold text-gold-gradient">
                15 de agosto
              </p>
              <p className="mt-1 text-sm text-slate-300">de 2026</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            Después únicamente existirá la Membresía Anual estándar.
          </p>
        </Revelar>
      </div>
    </section>
  );
}

/* ---------- MENSAJE DEL FUNDADOR ---------- */

export function MensajeFundador() {
  return (
    <section className="border-y border-white/10 bg-navy-900 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <Revelar>
          <div className="text-center">
            <p className="wordmark text-[11px] text-gold">Mensaje del fundador</p>
          </div>

          <blockquote className="mt-8 space-y-5 text-center text-lg leading-relaxed text-slate-200 sm:text-xl">
            <p>
              Durante más de catorce años hemos construido una comunidad basada
              en la formación, la colaboración y el crecimiento personal. Hoy
              iniciamos una nueva etapa con Academia EliteZen.
            </p>
            <p>
              Queremos que las primeras cien personas que crean en este proyecto
              puedan participar desde el principio y formar parte de su
              historia.
            </p>
            <p className="text-white">
              Si compartes nuestra visión, será un honor darte la bienvenida
              como Fundador.
            </p>
          </blockquote>
        </Revelar>

        <Revelar retraso={120}>
          <div className="mt-12 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            {FIRMAS.map((f) => (
              <div key={f.nombre} className="text-center">
                <div className="filete-oro mx-auto mb-3" />
                <p className="font-display font-bold text-white">{f.nombre}</p>
                <p className="mt-0.5 text-sm text-slate-400">{f.cargo}</p>
              </div>
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* ---------- LLAMADA FINAL ---------- */

export function LlamadaFinal() {
  const restantes = CAMPANA.totalPlazas - CAMPANA.plazasOcupadas;

  return (
    <section className="dot-grid relative overflow-hidden">
      <div className="hero-glow absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center sm:py-28">
        <Revelar>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            El futuro no se espera.
            <br />
            <span className="text-gold-gradient">Se construye.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-lg text-slate-300">
            Forma parte del nacimiento de Academia EliteZen y ocupa tu lugar
            entre los 100 Fundadores.
          </p>

          <a
            href="#pago"
            className="btn-gold mt-10 inline-block rounded-full px-10 py-5 text-base tracking-wide sm:text-lg"
          >
            QUIERO SER FUNDADOR
          </a>

          <p className="mt-6 text-sm text-slate-400">
            Quedan <span className="font-semibold text-gold">{restantes}</span>{" "}
            de {CAMPANA.totalPlazas} plazas · Campaña abierta hasta el{" "}
            {CAMPANA.fechaCierre}
          </p>
        </Revelar>
      </div>
    </section>
  );
}
