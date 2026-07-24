import Image from "next/image";
import Link from "next/link";

/** Plantilla de las páginas informativas y legales del sitio. */
export default function PaginaLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <main className="dot-grid relative min-h-screen">
      <div className="hero-glow absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-14">
        <Link href="/" className="inline-block">
          <Image
            src="/logo-elitezen.png"
            alt="Academia EliteZen"
            width={1080}
            height={941}
            priority
            className="h-16 w-auto"
          />
        </Link>

        <h1 className="mt-8 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {titulo}
        </h1>
        <div className="filete-oro mt-5" />

        <div className="mt-8 space-y-5 leading-relaxed text-slate-300">
          {children}
        </div>

        <Link
          href="/"
          className="mt-10 inline-block text-sm text-slate-400 transition hover:text-white"
        >
          ← Volver a la página principal
        </Link>
      </div>
    </main>
  );
}

/** Aviso estándar para documentos que el equipo aún está redactando. */
export function DocumentoEnPreparacion() {
  return (
    <>
      <p>
        Estamos terminando de redactar la versión completa de este documento y
        lo publicaremos en esta misma página antes del cierre de la Campaña de
        Fundadores.
      </p>
      <p>
        Si tienes cualquier duda mientras tanto, escríbenos por Instagram a{" "}
        <a
          href="https://instagram.com/elitezenoficial"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          @elitezenoficial
        </a>{" "}
        y con gusto te la resolvemos.
      </p>
    </>
  );
}
