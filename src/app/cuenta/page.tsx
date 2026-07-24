import type { Metadata } from "next";
import { Suspense } from "react";
import AreaFundador from "./AreaFundador";

export const metadata: Metadata = {
  title: "Mi cuenta de Fundador — Academia EliteZen",
  robots: { index: false, follow: false },
};

export default function PaginaCuenta() {
  return (
    <Suspense>
      <AreaFundador />
    </Suspense>
  );
}
