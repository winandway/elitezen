"use client";

import { useEffect, useRef, useState } from "react";

const ALTO_BARRA = "48px";

/** Lluvia de confeti en canvas, sin dependencias. Dura ~4 segundos. */
function lanzarConfeti(canvas: HTMLCanvasElement, duracionMs = 4200) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ancho = window.innerWidth;
  const alto = window.innerHeight;
  canvas.width = ancho * dpr;
  canvas.height = alto * dpr;
  ctx.scale(dpr, dpr);

  const COLORES = ["#fed175", "#fbda59", "#ce9d2a", "#ffffff", "#34d399"];
  const N = ancho < 640 ? 90 : 150;

  const piezas = Array.from({ length: N }, () => ({
    x: Math.random() * ancho,
    y: -20 - Math.random() * alto * 0.5,
    vx: (Math.random() - 0.5) * 1.6,
    vy: 2 + Math.random() * 3.2,
    giro: Math.random() * Math.PI * 2,
    vGiro: (Math.random() - 0.5) * 0.22,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    color: COLORES[Math.floor(Math.random() * COLORES.length)],
    forma: Math.random() < 0.25 ? "circulo" : "papel",
  }));

  const inicio = performance.now();
  const DURACION = duracionMs;
  let rafId = 0;

  const cuadro = (t: number) => {
    const paso = t - inicio;
    ctx.clearRect(0, 0, ancho, alto);

    // desvanecer al final
    const restante = Math.max(0, DURACION - paso);
    ctx.globalAlpha = restante > 900 ? 1 : restante / 900;

    for (const p of piezas) {
      p.x += p.vx + Math.sin((paso / 480) + p.giro) * 0.7;
      p.y += p.vy;
      p.giro += p.vGiro;
      if (p.y > alto + 24) {
        p.y = -16;
        p.x = Math.random() * ancho;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.color;
      if (p.forma === "circulo") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // la escala simula el volteo del papelito
        ctx.scale(1, 0.4 + Math.abs(Math.sin(paso / 300 + p.giro)) * 0.6);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    if (paso < DURACION) {
      rafId = requestAnimationFrame(cuadro);
    } else {
      ctx.clearRect(0, 0, ancho, alto);
    }
  };

  rafId = requestAnimationFrame(cuadro);
  return () => cancelAnimationFrame(rafId);
}

/**
 * Barra de bienvenida que baja al entrar, con lluvia de confeti.
 * Empuja la cabecera fija mediante la variable CSS --alto-barra.
 */
export default function BarraBienvenida() {
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [conConfeti, setConConfeti] = useState(false);

  useEffect(() => {
    const sinMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = setTimeout(() => {
      setVisible(true);
      document.documentElement.style.setProperty("--alto-barra", ALTO_BARRA);
      if (!sinMovimiento) setConConfeti(true);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!conConfeti || !canvasRef.current) return;
    // ?confeti=<segundos> alarga la lluvia (útil para demostraciones)
    const extra = Number(
      new URLSearchParams(window.location.search).get("confeti"),
    );
    const duracion =
      extra > 0 ? Math.min(extra, 20) * 1000 : 4200;
    const detener = lanzarConfeti(canvasRef.current, duracion);
    const fin = setTimeout(() => setConConfeti(false), duracion + 400);
    return () => {
      detener();
      clearTimeout(fin);
    };
  }, [conConfeti]);

  const cerrar = () => {
    setVisible(false);
    document.documentElement.style.setProperty("--alto-barra", "0px");
  };

  return (
    <>
      {conConfeti && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70]"
        />
      )}

      <div
        role="status"
        className={`fixed inset-x-0 top-0 z-[60] transition-transform duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: ALTO_BARRA }}
      >
        <div
          className="flex h-full items-center justify-center gap-3 px-10 text-center"
          style={{
            background:
              "linear-gradient(90deg, var(--color-gold-deep), var(--color-gold) 35%, var(--color-gold-bright) 65%, var(--color-gold-deep))",
          }}
        >
          <p className="font-display text-xs font-bold tracking-wide text-navy-900 sm:text-sm">
            <span className="hidden sm:inline">
              ¡Bienvenido! Estás a tiempo de ser uno de los 100 Fundadores —{" "}
            </span>
            <span className="sm:hidden">¡Bienvenido! — </span>
            <a href="#pago" className="underline underline-offset-2">
              aprovecha tu lugar
            </a>
          </p>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar aviso de bienvenida"
            className="absolute right-3 rounded-full p-1.5 text-navy-900/70 transition hover:bg-navy-900/10 hover:text-navy-900"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
