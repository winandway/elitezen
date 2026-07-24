/**
 * Acceso a datos: usa la base D1 del sitio (env.DB en YaDominios Cloud).
 * En desarrollo local, donde no hay bindings, cae a una memoria temporal
 * para poder probar el flujo completo de la interfaz.
 */

import type {
  D1Base,
  Epin,
  EstadoPedido,
  Metodo,
  Moneda,
  Pedido,
  Usuario,
} from "./tipos";

/* ---------- obtención del binding ---------- */

async function baseD1(): Promise<D1Base | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    const db = (ctx.env as Record<string, unknown>).DB as D1Base | undefined;
    return db ?? null;
  } catch {
    return null;
  }
}

/* ---------- memoria para desarrollo local ---------- */

/* en desarrollo cada ruta se compila aparte: la memoria vive en globalThis
   para que todas vean los mismos datos (en producción manda D1) */
const global = globalThis as unknown as {
  __memoriaElitezen?: { pedidos: Pedido[]; epins: Epin[]; usuarios: Usuario[] };
};
const memoria = (global.__memoriaElitezen ??= {
  pedidos: [],
  epins: [],
  usuarios: [],
});
memoria.usuarios ??= [];

const ahora = () => new Date().toISOString().slice(0, 19).replace("T", " ");

/* ---------- utilidades ---------- */

export function generarId(): string {
  return crypto.randomUUID();
}

/** ePIN legible: EZ-XXXX-XXXX-XXXX sin caracteres confusos (0/O, 1/I...). */
export function generarCodigoEpin(): string {
  const alfabeto = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const letras = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]);
  const g = (i: number) => letras.slice(i, i + 4).join("");
  return `EZ-${g(0)}-${g(4)}-${g(8)}`;
}

/* ---------- operaciones públicas ---------- */

export async function crearPedido(datos: {
  nombre: string;
  correo: string;
  pais: string | null;
  moneda: Moneda;
  metodo: Metodo;
  referido_por: string | null;
}): Promise<{ id: string; reutilizado: boolean }> {
  const db = await baseD1();
  const correo = datos.correo.trim().toLowerCase();

  if (db) {
    // si ya hay un pedido pendiente con el mismo correo y método, se reutiliza
    const previo = await db
      .prepare(
        "SELECT id FROM pedidos WHERE correo = ? AND metodo = ? AND estado = 'pendiente' LIMIT 1",
      )
      .bind(correo, datos.metodo)
      .first<{ id: string }>();
    if (previo) {
      await db
        .prepare("UPDATE pedidos SET nombre = ?, pais = ? WHERE id = ?")
        .bind(datos.nombre, datos.pais, previo.id)
        .run();
      return { id: previo.id, reutilizado: true };
    }

    const id = generarId();
    await db
      .prepare(
        "INSERT INTO pedidos (id, nombre, correo, pais, moneda, metodo, referido_por) VALUES (?,?,?,?,?,?,?)",
      )
      .bind(id, datos.nombre, correo, datos.pais, datos.moneda, datos.metodo, datos.referido_por)
      .run();
    return { id, reutilizado: false };
  }

  const previo = memoria.pedidos.find(
    (p) => p.correo === correo && p.metodo === datos.metodo && p.estado === "pendiente",
  );
  if (previo) {
    previo.nombre = datos.nombre;
    previo.pais = datos.pais;
    return { id: previo.id, reutilizado: true };
  }
  const id = generarId();
  memoria.pedidos.unshift({
    id,
    nombre: datos.nombre,
    correo,
    pais: datos.pais,
    moneda: datos.moneda,
    metodo: datos.metodo,
    referencia: null,
    comprobante: null,
    referido_por: datos.referido_por,
    estado: "pendiente",
    creado_en: ahora(),
    confirmado_en: null,
  });
  return { id, reutilizado: false };
}

export async function contarPlazas(): Promise<{ ocupadas: number }> {
  const db = await baseD1();
  if (db) {
    const fila = await db
      .prepare("SELECT COUNT(*) AS n FROM pedidos WHERE estado = 'pagado'")
      .first<{ n: number }>();
    return { ocupadas: fila?.n ?? 0 };
  }
  return { ocupadas: memoria.pedidos.filter((p) => p.estado === "pagado").length };
}

export async function listarPedidos(): Promise<Pedido[]> {
  const db = await baseD1();
  if (db) {
    const { results } = await db
      .prepare("SELECT * FROM pedidos ORDER BY creado_en DESC LIMIT 500")
      .all<Pedido>();
    return results;
  }
  return memoria.pedidos;
}

export async function epinDePedido(pedidoId: string): Promise<Epin | null> {
  const db = await baseD1();
  if (db) {
    return db
      .prepare("SELECT * FROM epins WHERE pedido_id = ? LIMIT 1")
      .bind(pedidoId)
      .first<Epin>();
  }
  return memoria.epins.find((e) => e.pedido_id === pedidoId) ?? null;
}

/** Marca el pedido como pagado y emite su ePIN (idempotente). */
export async function confirmarPedido(
  pedidoId: string,
): Promise<{ ok: boolean; epin?: Epin; error?: string }> {
  const db = await baseD1();

  if (db) {
    const pedido = await db
      .prepare("SELECT * FROM pedidos WHERE id = ? LIMIT 1")
      .bind(pedidoId)
      .first<Pedido>();
    if (!pedido) return { ok: false, error: "Pedido no encontrado" };

    const existente = await epinDePedido(pedidoId);
    if (existente) return { ok: true, epin: existente };

    await db
      .prepare(
        "UPDATE pedidos SET estado = 'pagado', confirmado_en = datetime('now') WHERE id = ?",
      )
      .bind(pedidoId)
      .run();

    const epin: Epin = {
      id: generarId(),
      codigo: generarCodigoEpin(),
      pedido_id: pedidoId,
      correo: pedido.correo,
      estado: "emitido",
      emitido_en: ahora(),
      activado_en: null,
    };
    await db
      .prepare(
        "INSERT INTO epins (id, codigo, pedido_id, correo) VALUES (?,?,?,?)",
      )
      .bind(epin.id, epin.codigo, epin.pedido_id, epin.correo)
      .run();
    return { ok: true, epin };
  }

  const pedido = memoria.pedidos.find((p) => p.id === pedidoId);
  if (!pedido) return { ok: false, error: "Pedido no encontrado" };
  const existente = memoria.epins.find((e) => e.pedido_id === pedidoId);
  if (existente) return { ok: true, epin: existente };
  pedido.estado = "pagado";
  pedido.confirmado_en = ahora();
  const epin: Epin = {
    id: generarId(),
    codigo: generarCodigoEpin(),
    pedido_id: pedidoId,
    correo: pedido.correo,
    estado: "emitido",
    emitido_en: ahora(),
    activado_en: null,
  };
  memoria.epins.push(epin);
  return { ok: true, epin };
}

export async function cambiarEstadoPedido(
  pedidoId: string,
  estado: EstadoPedido,
): Promise<boolean> {
  const db = await baseD1();
  if (db) {
    await db
      .prepare("UPDATE pedidos SET estado = ? WHERE id = ?")
      .bind(estado, pedidoId)
      .run();
    return true;
  }
  const pedido = memoria.pedidos.find((p) => p.id === pedidoId);
  if (!pedido) return false;
  pedido.estado = estado;
  return true;
}

/* ---------- cuentas de Fundador ---------- */

export async function crearUsuario(datos: {
  nombre: string;
  correo: string;
  pais: string | null;
  clave_sal: string;
  clave_hash: string;
}): Promise<{ ok: boolean; usuario?: Usuario; error?: string }> {
  const correo = datos.correo.trim().toLowerCase();
  const db = await baseD1();

  const usuario: Usuario = {
    id: generarId(),
    nombre: datos.nombre,
    correo,
    pais: datos.pais,
    clave_sal: datos.clave_sal,
    clave_hash: datos.clave_hash,
    creado_en: ahora(),
  };

  if (db) {
    const existe = await db
      .prepare("SELECT id FROM usuarios WHERE correo = ? LIMIT 1")
      .bind(correo)
      .first<{ id: string }>();
    if (existe) return { ok: false, error: "Ya existe una cuenta con ese correo" };
    await db
      .prepare(
        "INSERT INTO usuarios (id, nombre, correo, pais, clave_sal, clave_hash) VALUES (?,?,?,?,?,?)",
      )
      .bind(usuario.id, usuario.nombre, correo, usuario.pais, usuario.clave_sal, usuario.clave_hash)
      .run();
    return { ok: true, usuario };
  }

  if (memoria.usuarios.some((u) => u.correo === correo)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo" };
  }
  memoria.usuarios.push(usuario);
  return { ok: true, usuario };
}

export async function usuarioPorCorreo(correo: string): Promise<Usuario | null> {
  const c = correo.trim().toLowerCase();
  const db = await baseD1();
  if (db) {
    return db
      .prepare("SELECT * FROM usuarios WHERE correo = ? LIMIT 1")
      .bind(c)
      .first<Usuario>();
  }
  return memoria.usuarios.find((u) => u.correo === c) ?? null;
}

/** Pedido vigente de un correo (el más reciente que no esté anulado). */
export async function pedidoActivoDeCorreo(correo: string): Promise<Pedido | null> {
  const c = correo.trim().toLowerCase();
  const db = await baseD1();
  if (db) {
    return db
      .prepare(
        "SELECT * FROM pedidos WHERE correo = ? AND estado != 'anulado' ORDER BY creado_en DESC LIMIT 1",
      )
      .bind(c)
      .first<Pedido>();
  }
  return (
    memoria.pedidos.find((p) => p.correo === c && p.estado !== "anulado") ?? null
  );
}

/** Posición (1..100) entre los pagos confirmados, por fecha de confirmación. */
export async function numeroDeFundador(correo: string): Promise<number | null> {
  const c = correo.trim().toLowerCase();
  const db = await baseD1();
  if (db) {
    const { results } = await db
      .prepare(
        "SELECT correo FROM pedidos WHERE estado = 'pagado' ORDER BY confirmado_en ASC, creado_en ASC",
      )
      .all<{ correo: string }>();
    const i = results.findIndex((r) => r.correo === c);
    return i === -1 ? null : i + 1;
  }
  const pagados = memoria.pedidos
    .filter((p) => p.estado === "pagado")
    .sort((a, b) => (a.confirmado_en ?? "").localeCompare(b.confirmado_en ?? ""));
  const i = pagados.findIndex((p) => p.correo === c);
  return i === -1 ? null : i + 1;
}

/* ---------- clave del panel ---------- */

export async function claveDelPanel(): Promise<string | null> {
  if (process.env.PANEL_CLAVE) return process.env.PANEL_CLAVE;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    const v = (ctx.env as Record<string, unknown>).PANEL_CLAVE;
    return typeof v === "string" && v ? v : null;
  } catch {
    return null;
  }
}
