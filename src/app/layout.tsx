import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE = "https://elitezenacademy.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Academia EliteZen — Campaña de Fundadores",
  description:
    "Forma parte de los 100 Fundadores de Academia EliteZen. Participa desde el inicio en una plataforma internacional de aprendizaje, crecimiento y comunidad.",
  keywords: [
    "Academia EliteZen",
    "Fundadores",
    "educación",
    "crecimiento personal",
    "comunidad",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE,
    siteName: "Academia EliteZen",
    title: "Academia EliteZen — Campaña de Fundadores",
    description:
      "Solo existirán 100 Fundadores. Participa desde el nacimiento de Academia EliteZen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia EliteZen — Campaña de Fundadores",
    description:
      "Solo existirán 100 Fundadores. Participa desde el nacimiento de Academia EliteZen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        {/* Si el visitante no tiene JavaScript, el contenido se ve igual */}
        <noscript>
          <style>{`.revelar{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
