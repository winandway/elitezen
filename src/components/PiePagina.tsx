import Image from "next/image";
import { REDES } from "@/lib/campana";

export default function PiePagina() {
  const anio = 2026;

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between">
        <Image
          src="/logo-elitezen.png"
          alt="Academia EliteZen"
          width={1080}
          height={941}
          className="h-14 w-auto"
        />

        <div className="flex flex-col items-center gap-3 sm:items-end">
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
          <p className="text-center text-xs text-slate-500 sm:text-right">
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
