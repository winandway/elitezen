/** Lluvia de confeti en canvas, sin dependencias. Devuelve una función para detenerla. */
export function lanzarConfeti(
  canvas: HTMLCanvasElement,
  duracionMs = 4200,
): () => void {
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
  let rafId = 0;

  const cuadro = (t: number) => {
    const paso = t - inicio;
    ctx.clearRect(0, 0, ancho, alto);

    const restante = Math.max(0, duracionMs - paso);
    ctx.globalAlpha = restante > 900 ? 1 : restante / 900;

    for (const p of piezas) {
      p.x += p.vx + Math.sin(paso / 480 + p.giro) * 0.7;
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
        ctx.scale(1, 0.4 + Math.abs(Math.sin(paso / 300 + p.giro)) * 0.6);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    if (paso < duracionMs) {
      rafId = requestAnimationFrame(cuadro);
    } else {
      ctx.clearRect(0, 0, ancho, alto);
    }
  };

  rafId = requestAnimationFrame(cuadro);
  return () => cancelAnimationFrame(rafId);
}
