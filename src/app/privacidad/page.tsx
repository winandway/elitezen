import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/PaginaLegal";
import { EMPRESA } from "@/lib/campana";

export const metadata: Metadata = {
  title: "Política de privacidad — Academia EliteZen",
  description:
    "Cómo trata Evolution Community Global, S.L. los datos personales de los usuarios de elitezenacademy.com (RGPD).",
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="pt-4 font-display text-xl font-bold text-white">{children}</h2>
);

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p className="text-sm text-slate-400">
        Última actualización: 26 de julio de 2026
      </p>

      <H>1. Responsable del tratamiento</H>
      <p>
        <span className="font-semibold text-white">{EMPRESA.nombre}</span>,
        CIF {EMPRESA.cif}, {EMPRESA.pais}. Correo de contacto:{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        . Esta política cumple el Reglamento (UE) 2016/679 (RGPD) y la
        normativa española de protección de datos, y aplica a todos los
        usuarios del sitio, residan donde residan.
      </p>

      <H>2. Qué datos tratamos</H>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-semibold text-white">Datos de cuenta:</span>{" "}
          nombre, correo electrónico, país (opcional) y contraseña (guardada
          cifrada, nunca en texto legible).
        </li>
        <li>
          <span className="font-semibold text-white">Datos de la reserva:</span>{" "}
          moneda y método de pago elegidos, estado del pedido, fechas y ePIN
          emitido.
        </li>
        <li>
          <span className="font-semibold text-white">Lo que NO tratamos:</span>{" "}
          números de tarjeta ni credenciales bancarias. El pago ocurre en las
          plataformas seguras de SumUp o Bold, que actúan como responsables
          independientes de esos datos.
        </li>
      </ul>

      <H>3. Para qué y con qué base legal</H>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Gestionar tu cuenta, tu reserva y tu membresía (ejecución del
          contrato).
        </li>
        <li>
          Enviarte correos transaccionales: bienvenida, ePIN y avisos sobre tu
          membresía (ejecución del contrato).
        </li>
        <li>
          Atender tus solicitudes y el ejercicio de tus derechos (obligación
          legal).
        </li>
        <li>
          Prevenir fraude y proteger el servicio (interés legítimo).
        </li>
      </ul>
      <p>No enviamos publicidad ni cedemos tus datos con fines comerciales.</p>

      <H>4. Quién accede a tus datos</H>
      <p>
        Solo los proveedores imprescindibles para operar el servicio, como
        encargados del tratamiento: el proveedor de alojamiento del sitio y su
        base de datos, y Resend (envío de correos transaccionales). Algunos de
        estos proveedores pueden estar ubicados fuera del Espacio Económico
        Europeo; en ese caso el tratamiento se ampara en las garantías
        previstas por el RGPD, como las cláusulas contractuales tipo.
      </p>

      <H>5. Cuánto tiempo los conservamos</H>
      <p>
        Mientras tu cuenta esté activa y, tras su baja, durante los plazos de
        prescripción legal (fiscales y de consumo). Las cuentas sin membresía
        pueden eliminarse a solicitud del titular de forma inmediata.
      </p>

      <H>6. Tus derechos</H>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso,
        rectificación, supresión, oposición, limitación y portabilidad
        escribiendo a{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        . Si consideras que no hemos atendido debidamente tus derechos, puedes
        reclamar ante la Agencia Española de Protección de Datos
        (aepd.es) o la autoridad de control de tu país.
      </p>

      <H>7. Seguridad</H>
      <p>
        Aplicamos medidas técnicas apropiadas: contraseñas cifradas con
        algoritmos de derivación robustos, sesiones firmadas en cookies
        seguras HttpOnly, comunicaciones bajo HTTPS y acceso restringido al
        panel de administración.
      </p>

      <H>8. Cookies</H>
      <p>
        Este sitio solo utiliza cookies técnicas imprescindibles. Consulta la{" "}
        <Link
          href="/cookies"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          Política de cookies
        </Link>
        .
      </p>
    </PaginaLegal>
  );
}
