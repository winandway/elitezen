import Image from "next/image";
import Link from "next/link";
import { REDES } from "@/lib/campana";

const ENLACES = [
  { texto: "Quiénes somos", href: "/quienes-somos" },
  { texto: "Términos y condiciones", href: "/terminos" },
  { texto: "Términos del registro", href: "/terminos-registro" },
  { texto: "Política de privacidad", href: "/privacidad" },
  { texto: "Política de cookies", href: "/cookies" },
];

export default function PiePagina() {
  const anio = 2026;

  return (
    /* pb-28 en celular: aire para que el botón flotante no tape el crédito */
    <footer className="border-t border-white/10 bg-navy-900 pb-28 sm:pb-10">
      <div className="mx-auto max-w-6xl px-5 pt-12">
        {/* marca */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo-elitezen.png"
            alt="Academia EliteZen"
            width={1080}
            height={941}
            className="h-16 w-auto"
          />
          <a
            href={REDES.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <rect
                x="3" y="3" width="18" height="18" rx="5"
                stroke="currentColor" strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
            </svg>
            @elitezenoficial
          </a>
        </div>

        {/* enlaces del sitio */}
        <nav
          aria-label="Enlaces del sitio"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="text-sm text-slate-400 transition hover:text-gold"
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        {/* crédito */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-xs leading-relaxed text-slate-500">
            © {anio} elitezenacademy.com | All rights reserved. Developed by{" "}
            <a
              href="https://windoce.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-400 transition hover:text-gold"
            >
              Windoce LLC
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
