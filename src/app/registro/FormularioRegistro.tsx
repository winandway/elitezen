"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FormularioRegistro() {
  const router = useRouter();
  const parametros = useSearchParams();
  const pagar = parametros.get("pagar");

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [verClave, setVerClave] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError("");
    try {
      const r = await fetch("/datos/auth/registro", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: f.get("nombre"),
          correo: f.get("correo"),
          pais: f.get("pais"),
          clave: f.get("clave"),
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) {
        setError(d.error || "No se pudo crear la cuenta");
        setEnviando(false);
        return;
      }
      router.push(pagar ? `/cuenta?pagar=${pagar}` : "/cuenta");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <main className="dot-grid relative min-h-screen">
      <div className="hero-glow absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <Link href="/" className="mx-auto">
          <Image
            src="/logo-elitezen.png"
            alt="Academia EliteZen"
            width={1080}
            height={941}
            priority
            className="h-20 w-auto"
          />
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-navy-800/70 p-7 backdrop-blur sm:p-8">
          <p className="wordmark text-center text-[11px] text-gold">
            Campaña de Fundadores
          </p>
          <h1 className="mt-3 text-center font-display text-2xl font-bold text-white">
            Crea tu cuenta de Fundador
          </h1>
          <p className="mt-2 text-center text-sm text-slate-300">
            Es el primer paso para reservar tu plaza entre los 100.
          </p>

          <form onSubmit={enviar} className="mt-7 space-y-4">
            <div>
              <label htmlFor="r-nombre" className="block text-sm font-semibold text-slate-200">
                Nombre completo
              </label>
              <input
                id="r-nombre"
                name="nombre"
                required
                minLength={2}
                maxLength={120}
                placeholder="Nombre y apellido"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-white outline-none transition focus:border-gold/60"
              />
            </div>
            <div>
              <label htmlFor="r-correo" className="block text-sm font-semibold text-slate-200">
                Correo electrónico
              </label>
              <input
                id="r-correo"
                name="correo"
                type="email"
                required
                maxLength={200}
                placeholder="correo@ejemplo.com"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-white outline-none transition focus:border-gold/60"
              />
            </div>
            <div>
              <label htmlFor="r-pais" className="block text-sm font-semibold text-slate-200">
                País <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                id="r-pais"
                name="pais"
                maxLength={60}
                placeholder="País donde vives"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-white outline-none transition focus:border-gold/60"
              />
            </div>
            <div>
              <label htmlFor="r-clave" className="block text-sm font-semibold text-slate-200">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="r-clave"
                  name="clave"
                  type={verClave ? "text" : "password"}
                  required
                  minLength={8}
                  maxLength={100}
                  placeholder="Mínimo 8 caracteres"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 pr-16 text-white outline-none transition focus:border-gold/60"
                />
                <button
                  type="button"
                  onClick={() => setVerClave(!verClave)}
                  className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-xs font-semibold text-slate-400 transition hover:text-gold"
                >
                  {verClave ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="btn-gold w-full rounded-full px-8 py-4 text-base tracking-wide disabled:opacity-60"
            >
              {enviando ? "Creando tu cuenta..." : "CREAR MI CUENTA"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              href={pagar ? `/entrar?pagar=${pagar}` : "/entrar"}
              className="font-semibold text-gold underline-offset-2 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 text-center text-sm text-slate-400 transition hover:text-white"
        >
          ← Volver a la página principal
        </Link>
      </div>
    </main>
  );
}
