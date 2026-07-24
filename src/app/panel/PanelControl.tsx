"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CAMPANA } from "@/lib/campana";
import type { Epin, Pedido } from "@/lib/tipos";

const ETIQUETA_METODO: Record<string, string> = {
  sumup: "SumUp (EUR)",
  bold: "Bold (USD)",
  usdt: "USDT",
  usdc: "USDC",
};

function ChipEstado({ estado }: { estado: string }) {
  const estilos: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    pagado: "bg-emerald-100 text-emerald-800",
    anulado: "bg-slate-200 text-slate-600",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado] ?? ""}`}
    >
      {estado}
    </span>
  );
}

export default function PanelControl() {
  const [clave, setClave] = useState("");
  const [claveActiva, setClaveActiva] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [ocupadas, setOcupadas] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [confirmarAnular, setConfirmarAnular] = useState<Pedido | null>(null);
  const [epinNuevo, setEpinNuevo] = useState<{ pedido: Pedido; epin: Epin } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const cargar = useCallback(async (c: string) => {
    setCargando(true);
    setError("");
    try {
      const r = await fetch("/datos/panel", { headers: { "x-clave": c } });
      const d = await r.json();
      if (!r.ok || !d.ok) {
        setError(d.error || "No se pudo entrar");
        setClaveActiva(null);
        return;
      }
      setPedidos(d.pedidos);
      setOcupadas(d.ocupadas);
      setClaveActiva(c);
      sessionStorage.setItem("panel-clave", c);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const guardada = sessionStorage.getItem("panel-clave");
    if (guardada) cargar(guardada);
  }, [cargar]);

  async function accion(accion: "confirmar" | "anular" | "reabrir", pedido: Pedido) {
    if (!claveActiva) return;
    setMenuAbierto(null);
    setCargando(true);
    try {
      const r = await fetch("/datos/panel", {
        method: "POST",
        headers: { "content-type": "application/json", "x-clave": claveActiva },
        body: JSON.stringify({ accion, id: pedido.id }),
      });
      const d = await r.json();
      if (d.ok && accion === "confirmar" && d.epin) {
        setEpinNuevo({ pedido, epin: d.epin });
        setCopiado(false);
      }
      await cargar(claveActiva);
    } finally {
      setCargando(false);
    }
  }

  /* ---------- pantalla de clave ---------- */
  if (!claveActiva) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-5">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-navy-800/70 p-8 text-center">
          <Image
            src="/logo-elitezen.png"
            alt="Academia EliteZen"
            width={1080}
            height={941}
            className="mx-auto h-20 w-auto"
          />
          <h1 className="mt-5 font-display text-xl font-bold text-white">
            Panel de control
          </h1>
          <p className="mt-1 text-sm text-slate-400">Solo para la administración</p>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (clave) cargar(clave);
            }}
          >
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Clave de acceso"
              autoFocus
              className="w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-center text-white outline-none transition focus:border-gold/60"
            />
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={cargando || !clave}
              className="btn-gold mt-4 w-full rounded-full px-6 py-3 text-sm disabled:opacity-60"
            >
              {cargando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ---------- panel ---------- */
  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const pagados = pedidos.filter((p) => p.estado === "pagado").length;

  return (
    <main className="min-h-screen bg-navy pb-20">
      <header className="border-b border-white/10 bg-navy-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-elitezen.png"
              alt=""
              width={1080}
              height={941}
              className="h-10 w-auto"
            />
            <div>
              <h1 className="font-display text-lg font-bold text-white">
                Panel de control
              </h1>
              <p className="text-xs text-slate-400">Campaña de Fundadores</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => claveActiva && cargar(claveActiva)}
              disabled={cargando}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-gold/50 disabled:opacity-60"
            >
              {cargando ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("panel-clave");
                setClaveActiva(null);
                setClave("");
              }}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* resumen */}
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pt-8 sm:grid-cols-4">
        {[
          { titulo: "Registrados", valor: pedidos.length },
          { titulo: "Pagados", valor: pagados },
          { titulo: "Pendientes", valor: pendientes },
          { titulo: "Plazas libres", valor: Math.max(CAMPANA.totalPlazas - ocupadas, 0) },
        ].map((c) => (
          <div
            key={c.titulo}
            className="rounded-2xl border border-white/10 bg-navy-800/60 p-5"
          >
            <p className="text-sm text-slate-400">{c.titulo}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-gold-gradient">
              {c.valor}
            </p>
          </div>
        ))}
      </section>

      {/* barra de avance */}
      <section className="mx-auto max-w-6xl px-5 pt-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Avance de la campaña</span>
            <span className="font-semibold text-white">
              {ocupadas} de {CAMPANA.totalPlazas}
            </span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max((ocupadas / CAMPANA.totalPlazas) * 100, 1)}%`,
                background:
                  "linear-gradient(90deg, var(--color-gold-deep), var(--color-gold))",
              }}
            />
          </div>
        </div>
      </section>

      {/* tabla de registros */}
      <section className="mx-auto max-w-6xl px-5 pt-8">
        <h2 className="font-display text-lg font-bold text-white">Registros</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-navy-900 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">País</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-navy-800/40">
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Aún no hay registros. Cuando alguien complete el formulario
                    de la página, aparecerá aquí.
                  </td>
                </tr>
              )}
              {pedidos.map((p) => (
                <tr key={p.id} className="text-slate-200">
                  <td className="px-4 py-3 font-medium text-white">{p.nombre}</td>
                  <td className="px-4 py-3">{p.correo}</td>
                  <td className="px-4 py-3">{p.pais ?? "—"}</td>
                  <td className="px-4 py-3">{ETIQUETA_METODO[p.metodo] ?? p.metodo}</td>
                  <td className="px-4 py-3">
                    <ChipEstado estado={p.estado} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.creado_en}</td>
                  <td className="relative px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {p.estado === "pendiente" && (
                        <button
                          type="button"
                          onClick={() => accion("confirmar", p)}
                          className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                        >
                          Confirmar pago
                        </button>
                      )}
                      {/* menú de 3 puntos: aquí vive lo destructivo */}
                      <button
                        type="button"
                        aria-label="Más opciones"
                        onClick={() =>
                          setMenuAbierto(menuAbierto === p.id ? null : p.id)
                        }
                        className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <circle cx="12" cy="5" r="1.8" />
                          <circle cx="12" cy="12" r="1.8" />
                          <circle cx="12" cy="19" r="1.8" />
                        </svg>
                      </button>
                    </div>

                    {menuAbierto === p.id && (
                      <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-navy-900 shadow-2xl">
                        {p.estado === "anulado" ? (
                          <button
                            type="button"
                            onClick={() => accion("reabrir", p)}
                            className="block w-full px-4 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5"
                          >
                            Reabrir pedido
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setMenuAbierto(null);
                              setConfirmarAnular(p);
                            }}
                            className="block w-full px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                          >
                            Anular pedido
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          «Confirmar pago» marca el registro como pagado, genera su ePIN y mueve
          la barra de plazas de la página pública.
        </p>
      </section>

      {/* modal: confirmación de anulación */}
      {confirmarAnular && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-900/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center">
            <h3 className="font-display text-lg font-bold text-navy">
              ¿Anular este pedido?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {confirmarAnular.nombre} · {confirmarAnular.correo}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmarAnular(null)}
                className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  accion("anular", confirmarAnular);
                  setConfirmarAnular(null);
                }}
                className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sí, anular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal: ePIN generado */}
      {epinNuevo && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-900/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center">
            <p className="wordmark text-[11px] text-oro-oscuro">Pago confirmado</p>
            <h3 className="mt-2 font-display text-xl font-bold text-navy">
              ePIN de {epinNuevo.pedido.nombre}
            </h3>
            <p className="mt-4 rounded-2xl border-2 border-dashed border-gold-deep bg-cream px-4 py-5 font-mono text-2xl font-bold tracking-wider text-navy">
              {epinNuevo.epin.codigo}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(epinNuevo.epin.codigo);
                  setCopiado(true);
                }}
                className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
              >
                {copiado ? "¡Copiado!" : "Copiar ePIN"}
              </button>
              <a
                href={`mailto:${epinNuevo.pedido.correo}?subject=${encodeURIComponent(
                  "Tu ePIN de Fundador — Academia EliteZen",
                )}&body=${encodeURIComponent(
                  `Hola ${epinNuevo.pedido.nombre}:\n\n¡Bienvenido a los 100 Fundadores de Academia EliteZen!\n\nTu ePIN de activación es: ${epinNuevo.epin.codigo}\n\nGuárdalo bien: con él activarás tu cuenta cuando la plataforma abra sus puertas.\n\nUn abrazo,\nAcademia EliteZen`,
                )}`}
                className="btn-gold flex-1 rounded-full px-5 py-3 text-sm"
              >
                Enviar por correo
              </a>
            </div>
            <button
              type="button"
              onClick={() => setEpinNuevo(null)}
              className="mt-4 text-sm text-slate-500 transition hover:text-navy"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
