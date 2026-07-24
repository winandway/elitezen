import CtaFlotante from "@/components/CtaFlotante";
import Encabezado from "@/components/Encabezado";
import FormasDePago from "@/components/FormasDePago";
import Hero from "@/components/Hero";
import PiePagina from "@/components/PiePagina";
import {
  Beneficios,
  LlamadaFinal,
  MensajeFundador,
  PorQueSerFundador,
  QueEsEliteZen,
  Urgencia,
  Vision,
} from "@/components/Secciones";

export default function Home() {
  return (
    <>
      <Encabezado />

      <main className="relative overflow-hidden">
        {/* 1. ¿Qué es esto? */}
        <Hero />

        {/* 2. ¿Por qué me interesa? */}
        <PorQueSerFundador />

        {/* 3. ¿Qué ventajas obtengo? · 4. ¿Cómo puedo ganar dinero? */}
        <Beneficios />

        {/* Contexto: la Academia y su recorrido */}
        <QueEsEliteZen />
        <Vision />

        {/* 6. ¿Cómo me inscribo? */}
        <FormasDePago />

        {/* 5. ¿Por qué debo decidir ahora? */}
        <Urgencia />

        <MensajeFundador />
        <LlamadaFinal />
      </main>

      <PiePagina />
      <CtaFlotante />
    </>
  );
}
