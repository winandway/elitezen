import type { Metadata } from "next";
import PaginaLegal, { DocumentoEnPreparacion } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Términos y condiciones — Academia EliteZen",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <DocumentoEnPreparacion />
    </PaginaLegal>
  );
}
