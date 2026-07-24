"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Encabezado() {
  const [compacto, setCompacto] = useState(false);
  const [sesion, setSesion] = useState<{ conectado: boolean } | null>(null);

  useEffect(() => {
    const alScroll = () => setCompacto(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    fetch("/datos/auth/yo", { cache: "no-store" })
      .then((r) => r.json())
      .then(setSesion)
      .catch(() => setSesion({ conectado: false }));
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-500 ${
        compacto
          ? "border-b border-white/10 bg-navy/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
      style={{ top: "var(--alto-barra, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#inicio" aria-label="Academia EliteZen — ir al inicio">
          <Image
            src="/logo-elitezen.png"
            alt="Academia EliteZen"
            width={1080}
            height={941}
            priority
            className={`w-auto transition-all duration-300 ${
              compacto ? "h-9" : "h-11 sm:h-12"
            }`}
          />
        </a>
        <nav className="flex items-center gap-4">
          <Link
            href={sesion?.conectado ? "/cuenta" : "/entrar"}
            className="text-sm font-semibold text-slate-200 transition hover:text-gold"
          >
            {sesion?.conectado ? "Mi cuenta" : "Entrar"}
          </Link>
          <a
            href="#pago"
            className="btn-gold hidden rounded-full px-5 py-2.5 text-sm sm:inline-block"
          >
            Quiero ser Fundador
          </a>
        </nav>
      </div>
    </header>
  );
}
