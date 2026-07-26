import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/PaginaLegal";
import { EMPRESA } from "@/lib/campana";

export const metadata: Metadata = {
  title: "Términos y condiciones — Academia EliteZen",
  description:
    "Condiciones de la Campaña de Fundadores y de la Membresía Fundador de Academia EliteZen, operada por Evolution Community Global, S.L.",
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="pt-4 font-display text-xl font-bold text-white">{children}</h2>
);

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <p className="text-sm text-slate-400">
        Última actualización: 26 de julio de 2026
      </p>

      <H>1. Quiénes somos</H>
      <p>
        El sitio web{" "}
        <span className="font-semibold text-white">elitezenacademy.com</span>{" "}
        es operado por{" "}
        <span className="font-semibold text-white">{EMPRESA.nombre}</span>, con
        CIF {EMPRESA.cif}, constituida en {EMPRESA.pais} (en adelante, «la
        Academia» o «nosotros»). Contacto:{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        .
      </p>
      <p>
        <span className="font-semibold text-white">Academia EliteZen</span> es
        el proyecto educativo digital de Evolution Community, una comunidad de
        formación con más de dos décadas de trayectoria. La Academia siempre ha
        operado de forma digital (clases y eventos en directo a través de
        videoconferencia y otras plataformas) y ahora lanza su propia
        plataforma en línea, donde sus miembros podrán acceder a los cursos y
        servicios de manera más práctica, moderna y directa.
      </p>

      <H>2. Objeto</H>
      <p>
        Estos términos regulan la{" "}
        <span className="font-semibold text-white">Campaña de Fundadores</span>
        : la adquisición de la{" "}
        <span className="font-semibold text-white">Membresía Fundador</span> de
        Academia EliteZen por parte de las primeras 100 personas que decidan
        incorporarse a la nueva plataforma desde su nacimiento. La campaña
        permanecerá abierta hasta el 15 de agosto de 2026 o hasta completarse
        las 100 plazas, lo que ocurra primero.
      </p>

      <H>3. La Membresía Fundador</H>
      <p>La Membresía Fundador incluye:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Acceso a la plataforma de Academia EliteZen desde su lanzamiento,
          con formación en sus especialidades: network marketing, inteligencia
          artificial, tecnología blockchain e inteligencia financiera.
        </li>
        <li>
          Precio de la membresía garantizado durante 3 años desde la
          activación.
        </li>
        <li>20% de descuento en cursos premium, eventos y conferencias.</li>
        <li>
          Participación en el reparto del 2% del importe total de las
          membresías, distribuido mensualmente de forma proporcional entre los
          Fundadores activos.
        </li>
        <li>
          Acceso al plan de comisiones por recomendación (20% primer nivel,
          10% segundo nivel) y al Rango Embajador (5% adicional al alcanzar 50
          miembros activos), conforme al apartado 7.
        </li>
        <li>
          Su número de Fundador (del 1 al 100), asignado por orden de
          confirmación del pago.
        </li>
      </ul>

      <H>4. Precio y formas de pago</H>
      <p>
        El precio de la Membresía Fundador es de{" "}
        <span className="font-semibold text-white">49 € (IVA incluido)</span>{" "}
        para pagos en euros, o{" "}
        <span className="font-semibold text-white">
          56 USD (impuestos incluidos)
        </span>{" "}
        para pagos en dólares. El pago se procesa a través de pasarelas
        seguras de terceros (SumUp para euros; Bold para dólares). No
        almacenamos datos de tarjetas: los datos de pago los gestiona
        directamente la pasarela correspondiente.
      </p>
      <p>
        La membresía es de carácter anual. Durante los 3 primeros años desde la
        activación, las renovaciones mantienen el precio de Fundador indicado.
      </p>

      <H>5. ePIN y activación</H>
      <p>
        Una vez verificado el pago, el Fundador recibe un{" "}
        <span className="font-semibold text-white">ePIN</span>: un código
        personal e intransferible que queda ligado a su cuenta y que también se
        envía a su correo electrónico. Con ese ePIN activará su membresía en la
        plataforma de Academia EliteZen cuando esta abra sus puertas. El ePIN
        no es un instrumento de pago ni un valor negociable: es el comprobante
        de activación de la membresía adquirida.
      </p>

      <H>6. Derecho de desistimiento (consumidores)</H>
      <p>
        Si eres consumidor, dispones de un plazo de{" "}
        <span className="font-semibold text-white">14 días naturales</span>{" "}
        desde el pago para desistir de la compra sin necesidad de
        justificación, con reembolso íntegro del importe abonado. Para
        ejercerlo, escribe a{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>{" "}
        indicando tu nombre y el correo con el que te registraste. Si la
        plataforma se activa y utilizas tu ePIN antes de que venza ese plazo,
        consientes el inicio de la prestación del servicio.
      </p>

      <H>7. Plan de comisiones</H>
      <p>
        El plan de comisiones por recomendación es un beneficio de la
        membresía sujeto a estas condiciones básicas: (a) mantener la
        membresía activa; (b) que las nuevas inscripciones recomendadas sean
        reales y cumplan estos términos; y (c) cumplir la normativa fiscal
        aplicable a las cantidades percibidas en el país de residencia de cada
        Fundador. Las condiciones operativas del plan (calendario de pagos,
        métodos y requisitos de verificación) se comunicarán a los Fundadores
        junto con el lanzamiento de la plataforma.
      </p>

      <H>8. Obligaciones del usuario</H>
      <p>
        El usuario se compromete a facilitar datos veraces, a custodiar sus
        credenciales y su ePIN, a hacer un uso lícito del sitio y a no
        revender ni transferir la membresía sin autorización escrita de la
        Academia. La Academia puede suspender cuentas ante indicios razonables
        de fraude o uso indebido, informando al usuario.
      </p>

      <H>9. Propiedad intelectual</H>
      <p>
        La marca EliteZen, su logotipo y todos los contenidos del sitio y de la
        futura plataforma (cursos, materiales, diseños) pertenecen a{" "}
        {EMPRESA.nombre} o a sus licenciantes. La membresía otorga un derecho
        de uso personal y no exclusivo, no una cesión de derechos.
      </p>

      <H>10. Responsabilidad</H>
      <p>
        La plataforma digital de Academia EliteZen se encuentra en fase de
        lanzamiento; las fechas de disponibilidad comunicadas son estimadas.
        Mientras tanto, la Academia continúa prestando su formación por los
        canales digitales que ha utilizado siempre. Nada en estos términos
        limita los derechos que la ley reconoce a los consumidores ni la
        responsabilidad que legalmente no pueda excluirse.
      </p>

      <H>11. Protección de datos</H>
      <p>
        El tratamiento de datos personales se rige por nuestra{" "}
        <Link
          href="/privacidad"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          Política de privacidad
        </Link>{" "}
        y nuestra{" "}
        <Link
          href="/cookies"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          Política de cookies
        </Link>
        , conformes al Reglamento (UE) 2016/679 (RGPD).
      </p>

      <H>12. Ley aplicable y reclamaciones</H>
      <p>
        Estos términos se rigen por la legislación española. Si eres
        consumidor, conservas además las protecciones imperativas de la ley de
        tu país de residencia habitual. Puedes dirigir cualquier reclamación a{" "}
        <a
          href={`mailto:${EMPRESA.correo}`}
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          {EMPRESA.correo}
        </a>
        . Los consumidores de la Unión Europea disponen también de la
        plataforma europea de resolución de litigios en línea:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <H>13. Modificaciones</H>
      <p>
        Podremos actualizar estos términos por razones legales u operativas.
        La versión vigente estará siempre publicada en esta página, con su
        fecha de actualización. Los cambios no afectarán a los derechos ya
        adquiridos por los Fundadores.
      </p>
    </PaginaLegal>
  );
}
