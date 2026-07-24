import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Quiénes somos — Academia EliteZen",
  description:
    "EliteZen es una plataforma educativa integral que integra conocimiento práctico, espiritual y empresarial para transformar vidas y comunidades.",
};

export default function QuienesSomos() {
  return (
    <PaginaLegal titulo="Quiénes somos">
      <p>
        <span className="font-semibold text-white">EliteZen</span> es una
        plataforma educativa integral que integra conocimiento práctico,
        espiritual y empresarial para transformar vidas y comunidades. Ofrece
        programas diseñados por expertos en diversas áreas, visibilizando
        historias y conocimientos únicos que de otro modo quedarían ocultos.
      </p>

      <h2 className="pt-3 font-display text-xl font-bold text-white">
        Nuestra misión
      </h2>
      <p>
        Brindar una educación accesible y de impacto global, permitiendo a los
        usuarios aprender de manera eficiente y significativa, fomentando la
        participación, la creatividad y el crecimiento personal. Inspiramos a
        cada usuario a ser un faro de luz, compartiendo su historia y
        conocimiento con el mundo, y construyendo un legado colectivo.
      </p>

      <h2 className="pt-3 font-display text-xl font-bold text-white">
        Nuestra visión
      </h2>
      <p>
        Ser la plataforma líder en educación global, reconocida por inspirar,
        conectar y transformar vidas a través de una oferta educativa
        innovadora, diversa y enfocada en el bienestar personal y empresarial.
      </p>

      <h2 className="pt-3 font-display text-xl font-bold text-white">
        Nuestros valores
      </h2>
      <ul className="space-y-3">
        <li>
          <span className="font-semibold text-white">Excelencia:</span>{" "}
          inspiramos a nuestros usuarios y colaboradores a alcanzar la
          excelencia personal y profesional en cada aspecto de su vida.
        </li>
        <li>
          <span className="font-semibold text-white">Liderazgo consciente:</span>{" "}
          promovemos un liderazgo que combine habilidades estratégicas con
          empatía y conciencia social.
        </li>
        <li>
          <span className="font-semibold text-white">Transformación:</span>{" "}
          impulsamos la transformación continua, tanto a nivel personal como
          comunitario, mediante el aprendizaje significativo.
        </li>
        <li>
          <span className="font-semibold text-white">Empoderamiento:</span>{" "}
          empoderamos a las personas para que compartan sus talentos y
          conocimientos con el mundo, creando un legado positivo.
        </li>
      </ul>
    </PaginaLegal>
  );
}
