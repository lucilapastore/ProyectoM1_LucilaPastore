# Generador de Paletas Interactivo

Proyecto Integrador — Módulo 1, Full Stack (Henry)

## Contexto

Colorfly Studio es una agencia de branding que necesita una herramienta simple
para generar paletas de colores de forma rápida, como punto de partida para
sus propuestas visuales. Esta app resuelve eso: un botón, un tamaño de
paleta a elección, y una propuesta de colores lista para explorar.

## Demo

🔗 **Demo en vivo:** https://lucilapastore.github.io/ProyectoM1_LucilaPastore/

📸 **Capturas y GIF del flujo:** [link a la carpeta de Google Drive]

## Funcionalidades

**Obligatorias (consigna):**
- Selector de tamaño de paleta (6, 8 o 9 colores)
- Generación de colores aleatorios en dos formatos: HSL y HEX
- Cada color se muestra junto a su código HEX
- Render dinámico de las tarjetas según el tamaño elegido
- Microfeedback visible (toast) al generar
- HTML semántico
- Accesibilidad básica: labels asociados, contraste garantizado, foco visible

**Extra credit implementado:**
- Guardado de paletas en `localStorage`: guardar la paleta actual, ver un
  historial de guardadas (hasta 12), cargar cualquiera de vuelta a la vista
  principal, o eliminarla. Persiste aunque cierres el navegador.
- Bloqueo de colores: el candado conserva ese tono al generar de nuevo.
- Copiar HEX al portapapeles haciendo clic en un color.
- Animaciones sutiles en tarjetas, botones, candado y toast.
- Mejoras visuales de UI: estados vacíos, títulos visibles y hover más claro.
- Diseño responsive para tablet y celular.
- Branding de Colorfly Studio: logo, nombre de agencia, favicon y footer.

## Cómo usar la app

1. Elegí la cantidad de colores en el selector.
2. Hacé clic en **Generar paleta**.
3. Cada tarjeta muestra el color, su código HEX (formato principal) y su
   valor HSL (formato secundario).
4. Si te gusta una paleta, hacé clic en **Guardar paleta** — queda en la
   sección "Paletas guardadas".
5. Desde ahí podés **Cargar** una paleta guardada de vuelta a la vista
   principal, o **Eliminar** la que no quieras conservar.

## Cómo correr el proyecto en local

No requiere instalación ni dependencias — es HTML, CSS y JS vanilla.

1. Cloná el repositorio: `git clone [URL-DEL-REPO]`
2. Abrí `index.html` directamente en el navegador, o usá una extensión tipo
   Live Server (VS Code) para recarga automática.

## Cómo desplegar (GitHub Pages)

1. Pusheá los cambios a `main`: `git push origin main`
2. En GitHub: **Settings → Pages → Source: "Deploy from a branch"**,
   Branch: `main`, carpeta `/ (root)`.
3. GitHub genera la URL pública en uno o dos minutos.

## Estructura del proyecto

```
[NOMBRE-DEL-REPO]/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── img/
│   └── logo.svg
├── docs/
│   └── PROMPTS.md        # documentación del uso de IA
└── README.md
```

## Decisiones técnicas

- **Paleta neutra para la interfaz:** como la app *es* una herramienta de
  color, el fondo, las tarjetas y los botones usan tonos neutros a
  propósito, para que los colores generados sean siempre el foco visual.
- **Tarjetas tipo ficha de pintura:** cada color se muestra como un swatch
  grande, con el código HEX en una etiqueta aparte (nunca escrito encima
  del color aleatorio). Esto garantiza contraste de texto suficiente sin
  importar qué color se genere.
- **HSL y HEX en cada tarjeta:** se genera el color en HSL (más fácil de
  acotar a tonos agradables) y se convierte a HEX para mostrarlo siempre,
  cumpliendo los dos formatos que pide la consigna sin lógica duplicada.
- **Delegación de eventos en la lista de guardadas:** un solo listener
  maneja los botones "Cargar" y "Eliminar" de cualquier cantidad de
  paletas guardadas, en vez de agregar un listener por ítem.
- **`localStorage` con manejo de errores:** lectura y escritura están
  envueltas en `try/catch` para no romper la app si el storage está lleno,
  deshabilitado, o los datos guardados están corruptos.
- **Accesibilidad integrada, no agregada después:** labels asociados,
  `:focus-visible` en todo elemento interactivo, y el toast con
  `role="status"` y `aria-live="polite"` para que se anuncie solo a
  lectores de pantalla.

## Tecnologías

HTML5 · CSS3 (custom properties, Grid, Flexbox) · JavaScript vanilla (DOM,
eventos, `localStorage`) · Git / GitHub · GitHub Pages · Google Fonts

## Uso de IA

El desarrollo se apoyó en Claude (Anthropic) para planificación y                                                   resolución de dudas, y en Claude Code para las operaciones de
Git/GitHub. El detalle de los prompts usados y su impacto está documentado
en [`docs/PROMPTS.md`](docs/PROMPTS.md).

## Autor

[Lucila Pastore] — Proyecto Integrador Módulo 1, Henry
