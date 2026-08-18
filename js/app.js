/* ==========================================================================
   Generador de Paletas Interactivo — Colorfly Studio
   ==========================================================================
   Cada color se genera primero en HSL (más fácil de controlar para que salgan
   tonos agradables) y después se convierte a HEX. Así la app cumple los dos
   formatos que pide la consigna, y el HEX —que es obligatorio mostrar
   siempre— sale directo de esa conversión, sin lógica duplicada.
   ========================================================================== */

/* ---- Referencias al DOM ---- */
const sizeSelect = document.getElementById("palette-size");
const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");
const toastEl = document.getElementById("toast");

/* ---- Generación de color ---- */

// Entero aleatorio entre min y max, ambos inclusive.
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Saturación y luminosidad acotadas a rangos "agradables": evita colores
// demasiado grises (saturación muy baja) o demasiado oscuros/claros
// (luminosidad extrema), que además complicarían la legibilidad.
function generateRandomHSL() {
  const h = getRandomInt(0, 359);
  const s = getRandomInt(60, 90);
  const l = getRandomInt(40, 65);
  return { h, s, l };
}

// Conversión HSL -> HEX (algoritmo estándar).
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

// Un color = sus dos formatos, listos para mostrar.
function generateColor() {
  const { h, s, l } = generateRandomHSL();
  return {
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    hex: hslToHex(h, s, l),
  };
}

function generatePalette(size) {
  const palette = [];
  for (let i = 0; i < size; i++) {
    palette.push(generateColor());
  }
  return palette;
}

/* ---- Render ---- */

function createColorCard(color) {
  const card = document.createElement("li");
  card.className = "color-card";

  const swatch = document.createElement("div");
  swatch.className = "color-swatch";
  swatch.style.backgroundColor = color.hex;

  const info = document.createElement("div");
  info.className = "color-info";

  const hexLabel = document.createElement("span");
  hexLabel.className = "color-code color-code--hex";
  hexLabel.textContent = color.hex;

  const hslLabel = document.createElement("span");
  hslLabel.className = "color-code color-code--hsl";
  hslLabel.textContent = color.hsl;

  info.append(hexLabel, hslLabel);
  card.append(swatch, info);

  return card;
}

function renderPalette(colors) {
  paletteContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  colors.forEach((color) => fragment.appendChild(createColorCard(color)));
  paletteContainer.appendChild(fragment);
}

/* ---- Microfeedback (toast) ----
   Usa el atributo [hidden] del HTML, que ya tiene role="status" y
   aria-live="polite" — el mensaje se anuncia solo a lectores de pantalla. */

let toastTimeoutId = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;

  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toastEl.hidden = true;
  }, 2500);
}

/* ---- Evento principal ---- */

function handleGenerateClick() {
  const size = parseInt(sizeSelect.value, 10);
  const palette = generatePalette(size);
  renderPalette(palette);
  showToast(`Paleta de ${size} colores generada`);
}

generateBtn.addEventListener("click", handleGenerateClick);
