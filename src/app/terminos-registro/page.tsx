import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/PaginaLegal";
import { EMPRESA } from "@/lib/campana";

export const metadata: Metadata = {
  title: "Términos del registro — Academia EliteZen",
  description:
    "Condiciones de creación y uso de la cuenta de Fundador en Academia EliteZen.",
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="pt-4 font-display text-xl font-bold text-white">{children}</h2>
);

export default function TerminosRegistro() {
  return (
    <PaginaLegal titulo="Términos del registro">
      <p className="text-sm text-slate-400">
        Última actualización: 26 de julio de 2026
      </p>

      <H>1. La cuenta de Fundador</H>
      <p>
        Para reservar una plaza en la Campaña de Fundadores es necesario crear
        una cuenta con nombre, correo electrónico y contraseña. La cuenta es
        personal e intransferible, y solo se permite una cuenta por persona.
        El registro está reservado a mayores de 18 años.
      </p>

      <H>2. Veracidad de los datos</H>
      <p>
        Los datos facilitados deben ser veraces y estar actualizados. El
        correo electrónico es el canal oficial de comunicación: a él llegan la
        bienvenida, el ePIN de activación y los avisos de la Academia
        operada por {EMPRESA.nombre}.
      </p>

      <H>3. Contraseña y seguridad</H>
      <p>
        La contraseña se guarda cifrada: ni siquiera nuestro equipo puede
        verla. Eres responsable de custodiarla y de toda actividad realizada
        desde tu cuenta. Si sospechas un acceso no autorizado, escríbenos de
        inmediato a{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        .
      </p>

      <H>4. El ePIN</H>
      <p>
        El ePIN emitido al confirmarse el pago es personal e intransferible y
        queda ligado a tu cuenta y a tu correo. No lo compartas: cualquier
        persona con tu ePIN podría intentar activar tu membresía. La Academia
        nunca te pedirá el ePIN ni la contraseña por teléfono o mensajería.
      </p>

      <H>5. Baja y eliminación de la cuenta</H>
      <p>
        Puedes solicitar la eliminación de tu cuenta escribiendo a{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        . Si existe una membresía pagada, la baja se tramita conforme a los{" "}
        <Link
          href="/terminos"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          Términos y condiciones
        </Link>{" "}
        (incluido el derecho de desistimiento, si aplica).
      </p>

      <H>6. Suspensión</H>
      <p>
        Podremos suspender o cancelar cuentas ante indicios razonables de
        fraude, suplantación de identidad o uso contrario a estos términos,
        informando a la persona afectada y dándole la oportunidad de
        responder.
      </p>
    </PaginaLegal>
  );
}
