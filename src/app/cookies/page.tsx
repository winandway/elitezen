import type { Metadata } from "next";
import PaginaLegal, { DocumentoEnPreparacion } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de cookies — Academia EliteZen",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return (
    <PaginaLegal titulo="Política de cookies">
      <DocumentoEnPreparacion />
    </PaginaLegal>
  );
}
