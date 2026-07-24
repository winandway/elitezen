/** Tipos compartidos del sistema de pedidos y ePINs. */

export type Moneda = "EUR" | "USD" | "CRIPTO";
export type Metodo = "sumup" | "bold" | "usdt" | "usdc";
export type EstadoPedido = "pendiente" | "pagado" | "anulado";

export interface Pedido {
  id: string;
  nombre: string;
  correo: string;
  pais: string | null;
  moneda: Moneda;
  metodo: Metodo;
  referencia: string | null;
  comprobante: string | null;
  referido_por: string | null;
  estado: EstadoPedido;
  creado_en: string;
  confirmado_en: string | null;
}

export interface Epin {
  id: string;
  codigo: string;
  pedido_id: string;
  correo: string;
  estado: "emitido" | "activado";
  emitido_en: string;
  activado_en: string | null;
}

/** Subconjunto de la interfaz D1 que usamos (evita depender de workers-types). */
export interface D1Consulta {
  bind(...valores: unknown[]): D1Consulta;
  all<T = unknown>(): Promise<{ results: T[] }>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface D1Base {
  prepare(sql: string): D1Consulta;
}
