/**
 * Seguridad de cuentas: hash de contraseñas (PBKDF2-SHA256) y sesiones
 * con token firmado (HMAC) guardado en una cookie HttpOnly.
 * Todo con Web Crypto: funciona igual en Cloudflare Workers y en local.
 */

const codificador = new TextEncoder();
const ITERACIONES = 60_000;
export const NOMBRE_COOKIE = "ez_sesion";
const DIAS_SESION = 30;

/* ---------- utilidades hex/base64 ---------- */

const aHex = (b: Uint8Array) =>
  Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");

const deHex = (h: string) =>
  new Uint8Array((h.match(/.{2}/g) ?? []).map((x) => parseInt(x, 16)));

const aB64url = (b: Uint8Array) =>
  btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const deB64url = (s: string) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new Uint8Array(Array.from(b, (c) => c.charCodeAt(0)));
};

/* ---------- contraseñas ---------- */

export async function hashDeClave(
  clave: string,
  salHex?: string,
): Promise<{ sal: string; hash: string }> {
  const sal = salHex ? deHex(salHex) : crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey(
    "raw",
    codificador.encode(clave),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: sal as BufferSource, iterations: ITERACIONES, hash: "SHA-256" },
    material,
    256,
  );
  return { sal: aHex(sal), hash: aHex(new Uint8Array(bits)) };
}

export async function verificarClave(
  clave: string,
  sal: string,
  hashGuardado: string,
): Promise<boolean> {
  const { hash } = await hashDeClave(clave, sal);
  // comparación en tiempo constante
  if (hash.length !== hashGuardado.length) return false;
  let dif = 0;
  for (let i = 0; i < hash.length; i++) {
    dif |= hash.charCodeAt(i) ^ hashGuardado.charCodeAt(i);
  }
  return dif === 0;
}

/* ---------- secreto de firma ---------- */

export async function secretoDeSesion(): Promise<string | null> {
  if (process.env.SESION_SECRETO) return process.env.SESION_SECRETO;
  if (process.env.PANEL_CLAVE) return process.env.PANEL_CLAVE;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const env = getCloudflareContext().env as Record<string, unknown>;
    const v = env.SESION_SECRETO ?? env.PANEL_CLAVE;
    if (typeof v === "string" && v) return v;
  } catch {
    /* sin contexto de Cloudflare (desarrollo) */
  }
  return process.env.NODE_ENV === "development" ? "secreto-solo-desarrollo" : null;
}

/* ---------- tokens de sesión ---------- */

export interface DatosSesion {
  id: string;
  correo: string;
  nombre: string;
  exp: number;
}

async function claveHmac(secreto: string) {
  return crypto.subtle.importKey(
    "raw",
    codificador.encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function crearToken(
  datos: Omit<DatosSesion, "exp">,
  secreto: string,
): Promise<string> {
  const carga: DatosSesion = {
    ...datos,
    exp: Date.now() + DIAS_SESION * 24 * 60 * 60 * 1000,
  };
  const cuerpo = aB64url(codificador.encode(JSON.stringify(carga)));
  const firma = await crypto.subtle.sign(
    "HMAC",
    await claveHmac(secreto),
    codificador.encode(cuerpo),
  );
  return `${cuerpo}.${aB64url(new Uint8Array(firma))}`;
}

export async function verificarToken(
  token: string,
  secreto: string,
): Promise<DatosSesion | null> {
  const [cuerpo, firma] = token.split(".");
  if (!cuerpo || !firma) return null;
  try {
    const valida = await crypto.subtle.verify(
      "HMAC",
      await claveHmac(secreto),
      deB64url(firma) as BufferSource,
      codificador.encode(cuerpo),
    );
    if (!valida) return null;
    const datos = JSON.parse(
      new TextDecoder().decode(deB64url(cuerpo)),
    ) as DatosSesion;
    if (!datos.exp || datos.exp < Date.now()) return null;
    return datos;
  } catch {
    return null;
  }
}

/* ---------- cookies ---------- */

export function cabeceraCookieSesion(token: string): string {
  const maxAge = DIAS_SESION * 24 * 60 * 60;
  return `${NOMBRE_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function cabeceraCookieSalir(): string {
  return `${NOMBRE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function sesionDePeticion(
  peticion: Request,
): Promise<DatosSesion | null> {
  const secreto = await secretoDeSesion();
  if (!secreto) return null;
  const cookies = peticion.headers.get("cookie") ?? "";
  const cruda = cookies
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${NOMBRE_COOKIE}=`));
  if (!cruda) return null;
  return verificarToken(cruda.slice(NOMBRE_COOKIE.length + 1), secreto);
}
