-- ============================================================
--  Academia EliteZen — Esquema de base de datos (Cloudflare D1)
--  Se ejecuta de forma idempotente en cada despliegue (YaDominios Cloud).
-- ============================================================

-- Pedidos de Fundador (una fila por intención de compra)
CREATE TABLE IF NOT EXISTS pedidos (
  id            TEXT PRIMARY KEY,              -- id único (uuid)
  nombre        TEXT NOT NULL,
  correo        TEXT NOT NULL,
  pais          TEXT,
  moneda        TEXT NOT NULL,                 -- 'EUR' | 'USD' | 'CRIPTO'
  metodo        TEXT NOT NULL,                 -- 'sumup' | 'bold' | 'usdt' | 'usdc'
  referencia    TEXT,                          -- referencia/nota del pago
  comprobante   TEXT,                          -- clave del archivo en R2 (cripto)
  referido_por  TEXT,                          -- código de quien lo refirió (opcional)
  estado        TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente' | 'pagado' | 'anulado'
  creado_en     TEXT NOT NULL DEFAULT (datetime('now')),
  confirmado_en TEXT
);

CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos (estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_correo ON pedidos (correo);

-- ePINs emitidos (el código que se envía por correo al confirmar el pago)
CREATE TABLE IF NOT EXISTS epins (
  id           TEXT PRIMARY KEY,
  codigo       TEXT NOT NULL UNIQUE,           -- p. ej. EZ-XXXX-XXXX-XXXX
  pedido_id    TEXT NOT NULL,
  correo       TEXT NOT NULL,
  estado       TEXT NOT NULL DEFAULT 'emitido', -- 'emitido' | 'activado'
  emitido_en   TEXT NOT NULL DEFAULT (datetime('now')),
  activado_en  TEXT,
  FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
);

CREATE INDEX IF NOT EXISTS idx_epins_codigo ON epins (codigo);

-- Cuentas de Fundador (registro con correo y contraseña)
CREATE TABLE IF NOT EXISTS usuarios (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  correo      TEXT NOT NULL UNIQUE,
  pais        TEXT,
  clave_sal   TEXT NOT NULL,               -- sal del hash (hex)
  clave_hash  TEXT NOT NULL,               -- PBKDF2-SHA256 (hex)
  creado_en   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios (correo);
