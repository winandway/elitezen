import type { Metadata } from "next";
import { Suspense } from "react";
import FormularioEntrar from "./FormularioEntrar";

export const metadata: Metadata = {
  title: "Entrar — Academia EliteZen",
  description: "Accede a tu cuenta de Fundador de Academia EliteZen.",
};

export default function PaginaEntrar() {
  return (
    <Suspense>
      <FormularioEntrar />
    </Suspense>
  );
}
