import type { Metadata } from "next";
import { Suspense } from "react";
import FormularioRegistro from "./FormularioRegistro";

export const metadata: Metadata = {
  title: "Crea tu cuenta de Fundador — Academia EliteZen",
  description:
    "Regístrate para reservar tu plaza entre los 100 Fundadores de Academia EliteZen.",
};

export default function PaginaRegistro() {
  return (
    <Suspense>
      <FormularioRegistro />
    </Suspense>
  );
}
