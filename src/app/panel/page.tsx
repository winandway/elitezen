import type { Metadata } from "next";
import PanelControl from "./PanelControl";

export const metadata: Metadata = {
  title: "Panel de control — Academia EliteZen",
  robots: { index: false, follow: false },
};

export default function PaginaPanel() {
  return <PanelControl />;
}
