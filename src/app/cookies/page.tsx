import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";
import { EMPRESA } from "@/lib/campana";

export const metadata: Metadata = {
  title: "Política de cookies — Academia EliteZen",
  description:
    "Cookies utilizadas por elitezenacademy.com: solo cookies técnicas imprescindibles, sin rastreo ni publicidad.",
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="pt-4 font-display text-xl font-bold text-white">{children}</h2>
);

export default function Cookies() {
  return (
    <PaginaLegal titulo="Política de cookies">
      <p className="text-sm text-slate-400">
        Última actualización: 26 de julio de 2026
      </p>

      <H>1. Qué son las cookies</H>
      <p>
        Son pequeños archivos que el navegador guarda para que un sitio pueda
        recordar información entre visitas, como tu sesión iniciada.
      </p>

      <H>2. Las cookies de este sitio</H>
      <p>
        <span className="font-semibold text-white">
          Solo usamos cookies técnicas imprescindibles.
        </span>{" "}
        No utilizamos cookies de publicidad, de rastreo ni de analítica de
        terceros. Por eso no necesitas aceptar ningún aviso al navegar.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-mono text-sm text-gold">ez_sesion</span> —
          mantiene tu sesión de Fundador iniciada. Propia, segura (HttpOnly),
          caduca a los 30 días o al cerrar sesión.
        </li>
        <li>
          Almacenamiento local del navegador para funciones técnicas del panel
          de administración (solo aplica a la administración del sitio).
        </li>
      </ul>

      <H>3. Cómo gestionarlas</H>
      <p>
        Puedes borrar o bloquear las cookies desde la configuración de tu
        navegador. Ten en cuenta que sin la cookie de sesión no podrás
        mantenerte dentro de tu cuenta.
      </p>

      <H>4. Cambios en esta política</H>
      <p>
        Si algún día incorporamos herramientas que usen cookies no técnicas
        (por ejemplo, analítica), actualizaremos esta página y, cuando la ley
        lo exija, pediremos tu consentimiento previamente. Dudas:{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        .
      </p>
    </PaginaLegal>
  );
}
