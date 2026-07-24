/**
 * Configuración central de la Campaña de Fundadores.
 * Todo lo que el dueño puede querer cambiar vive aquí.
 */

export const CAMPANA = {
  totalPlazas: 100,
  /** Plazas ya confirmadas. En la Fase 3 se lee en vivo desde D1. */
  plazasOcupadas: 0,
  fechaCierre: "15 de agosto de 2026",
};

export const PRECIOS = {
  eur: { importe: "49 €", moneda: "EUR", nota: "IVA incluido" },
  usd: { importe: "49 USD", moneda: "USD", nota: "IVA incluido" },
};

export const ENLACES_PAGO = {
  /** Europa — SumUp */
  eur: "https://pay.sumup.com/b2c/QMTCHOSD",
  /** Sudamérica e internacional — Bold */
  usd: "https://checkout.bold.co/payment/LNK_EAAUA83CYM",
};

/**
 * Billeteras de criptomonedas (BNB Smart Chain — BEP20).
 * Mientras estén vacías, el bloque de cripto NO se muestra en la página.
 * Al pegar las direcciones reales, aparece automáticamente.
 */
export const CRIPTO = {
  usdt: "",
  usdc: "",
};

export const REDES = {
  instagram: "https://instagram.com/elitezenoficial",
};

export const BENEFICIOS = [
  {
    titulo: "Membresía Fundador",
    destacado: "49 € IVA incluido",
    texto: "Precio garantizado durante 3 años.",
  },
  {
    titulo: "Descuentos exclusivos",
    destacado: "20% de descuento",
    texto:
      "En cursos premium, eventos, conferencias y actividades organizadas por la Academia.",
  },
  {
    titulo: "Participación en el crecimiento",
    destacado: "2% de las membresías",
    texto:
      "Repartido mensualmente, de forma proporcional e igualitaria, entre todos los Fundadores activos.",
  },
  {
    titulo: "Genera ingresos desde el primer día",
    destacado: "20% + 10%",
    texto:
      "Plan de comisiones de dos niveles. No hay que esperar ningún plazo para empezar.",
  },
  {
    titulo: "Rango Embajador",
    destacado: "+5% adicional",
    texto:
      "Al alcanzar 50 miembros activos en tu red, sobre todas las nuevas membresías.",
  },
];

export const AREAS = [
  "Desarrollo Personal",
  "Liderazgo",
  "Network Marketing Profesional",
  "Inteligencia Artificial",
  "Tecnología",
  "Blockchain",
  "Educación Financiera",
  "Salud Integral",
  "Emprendimiento",
  "Comunidad Internacional",
];

export const VISION = [
  "Una comunidad internacional en constante crecimiento.",
  "Formación continua con expertos de distintas disciplinas.",
  "Herramientas digitales para el desarrollo profesional.",
  "Eventos presenciales y online.",
  "Un ecosistema colaborativo donde aprender, emprender y generar oportunidades.",
];

export const FIRMAS = [
  { nombre: "Rafael Henares", cargo: "Fundador de Evolution Community" },
  { nombre: "Juan David Matiz", cargo: "Fundador de Academia EliteZen" },
];
