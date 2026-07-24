# Panel de control — Campaña de Fundadores

## Qué es

Sistema interno para llevar el control de todas las personas que se
registran en la landing. Vive en **`/panel`** (no aparece en buscadores).

## Cómo funciona el flujo completo

1. El visitante toca **QUIERO SER FUNDADOR** → crea su **cuenta**
   (nombre, correo, país y contraseña) en `/registro` → entra a su área
   privada `/cuenta` → elige la moneda y toca pagar → su pedido queda
   **pendiente** en la base y se abre la pasarela (SumUp o Bold).
2. El administrador entra a `/panel` con la clave, ve el registro y
   comprueba el pago en su cuenta de SumUp/Bold.
3. Toca **«Confirmar pago»** → el registro pasa a **pagado**, se genera su
   **ePIN** (formato `EZ-XXXX-XXXX-XXXX`) y aparece un modal con dos botones:
   **Copiar ePIN** y **Enviar por correo** (abre el correo ya redactado).
4. La barra **«Quedan X de 100»** de la página pública avanza sola con cada
   pago confirmado.
5. El Fundador, al entrar a su cuenta (`/entrar`), ve su plaza confirmada
   con **su número de Fundador (#1 a #100)** y su **ePIN** siempre a mano.

Otras acciones: el menú de tres puntos (⋮) de cada fila permite **Anular
pedido** (con confirmación) y **Reabrir** los anulados. Confirmar dos veces
un mismo pedido devuelve siempre el mismo ePIN (no se duplican).

## Requisito único: la clave del panel

El panel se protege con la variable de entorno **`PANEL_CLAVE`**, que se
configura en el panel de YaDominios (tu sitio → **Variables de entorno**):

- Nombre: `PANEL_CLAVE`
- Valor: la clave que tú elijas (larga y difícil de adivinar)

La misma variable firma las sesiones de los Fundadores. Si algún día
quieres separarlas, agrega también `SESION_SECRETO` (opcional).

Al guardarla, el sitio se republica solo y la clave queda activa. Sin esa
variable, el panel muestra un aviso y no deja entrar a nadie.

> La clave nunca va en el código ni en el repositorio (que es público).

## Rutas técnicas (referencia)

| Ruta | Método | Uso |
|---|---|---|
| `/datos/pedido` | POST | Registro público (crea pedido pendiente) |
| `/datos/auth/registro` | POST | Crear cuenta de Fundador (abre sesión) |
| `/datos/auth/entrar` | POST | Iniciar sesión |
| `/datos/auth/salir` | POST | Cerrar sesión |
| `/datos/auth/yo` | GET | ¿Hay sesión abierta? |
| `/datos/cuenta` | GET/POST | Estado del Fundador y reserva de su pedido |
| `/datos/plazas` | GET | Contador público de plazas |
| `/datos/panel` | GET/POST | Lista y acciones del panel (cabecera `x-clave`) |

Se usa el prefijo `/datos` porque en YaDominios Cloud las rutas `/api/*`
quedan capturadas por el enrutado de archivos estáticos.

## Pendiente para automatizar del todo (futuro)

- Envío automático del correo con el ePIN (requiere una clave de Resend).
- Webhook de Bold para confirmar pagos sin intervención manual.
- API de SumUp (requiere credenciales del dueño) para lo mismo en euros.
