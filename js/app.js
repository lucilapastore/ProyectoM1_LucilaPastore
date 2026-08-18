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
const saveBtn = document.getElementById("save-btn");
const paletteContainer = document.getElementById("palette-container");
const savedList = document.getElementById("saved-palettes-list");
const toastEl = document.getElementById("toast");

// Paleta actualmente mostrada en pantalla — la necesita el botón "Guardar".
let currentPalette = [];

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

/* ---- Guardado en localStorage ----
   Persiste paletas completas (no solo la última) para que el usuario pueda
   volver a cargarlas después, incluso si cierra el navegador. */

const STORAGE_KEY = "colorfly-saved-palettes";
const MAX_SAVED_PALETTES = 12;

function getSavedPalettes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("No se pudieron leer las paletas guardadas:", error);
    return [];
  }
}

function setSavedPalettes(palettes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
  } catch (error) {
    console.warn("No se pudo guardar en localStorage:", error);
  }
}

function formatSavedDate(isoString) {
  return new Date(isoString).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function savePalette(colors) {
  const palettes = getSavedPalettes();
  const entry = {
    id: Date.now(),
    savedAt: new Date().toISOString(),
    colors,
  };

  const updated = [entry, ...palettes].slice(0, MAX_SAVED_PALETTES);
  setSavedPalettes(updated);
  renderSavedPalettes();
}

function deleteSavedPalette(id) {
  const palettes = getSavedPalettes().filter((entry) => entry.id !== id);
  setSavedPalettes(palettes);
  renderSavedPalettes();
  showToast("Paleta eliminada");
}

function loadSavedPalette(id) {
  const entry = getSavedPalettes().find((item) => item.id === id);
  if (!entry) return;

  currentPalette = entry.colors;
  renderPalette(entry.colors);
  sizeSelect.value = String(entry.colors.length);
  showToast("Paleta cargada");
}

function createSavedItem(entry) {
  const item = document.createElement("li");
  item.className = "saved-palette-item";

  const strip = document.createElement("div");
  strip.className = "saved-swatch-strip";
  entry.colors.forEach((color) => {
    const dot = document.createElement("span");
    dot.className = "saved-swatch";
    dot.style.backgroundColor = color.hex;
    strip.appendChild(dot);
  });

  const meta = document.createElement("span");
  meta.className = "saved-meta";
  meta.textContent = formatSavedDate(entry.savedAt);

  const loadBtn = document.createElement("button");
  loadBtn.type = "button";
  loadBtn.className = "saved-action";
  loadBtn.textContent = "Cargar";
  loadBtn.dataset.action = "load";
  loadBtn.dataset.id = entry.id;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "saved-action saved-action--delete";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.setAttribute(
    "aria-label",
    `Eliminar paleta guardada (${meta.textContent})`,
  );
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = entry.id;

  item.append(strip, meta, loadBtn, deleteBtn);
  return item;
}

function renderSavedPalettes() {
  const palettes = getSavedPalettes();
  savedList.innerHTML = "";

  if (palettes.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "saved-empty";
    emptyState.textContent = "Todavía no guardaste ninguna paleta.";
    savedList.appendChild(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  palettes.forEach((entry) => fragment.appendChild(createSavedItem(entry)));
  savedList.appendChild(fragment);
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

/* ---- Eventos ---- */

function handleGenerateClick() {
  const size = parseInt(sizeSelect.value, 10);
  const palette = generatePalette(size);
  currentPalette = palette;
  renderPalette(palette);
  showToast(`Paleta de ${size} colores generada`);
}

function handleSaveClick() {
  if (currentPalette.length === 0) {
    showToast("Generá una paleta antes de guardarla");
    return;
  }
  savePalette(currentPalette);
  showToast("Paleta guardada");
}

// Delegación de eventos: un solo listener para "Cargar" y "Eliminar",
// sin importar cuántos ítems haya en la lista de guardadas.
function handleSavedListClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "load") {
    loadSavedPalette(id);
  } else if (button.dataset.action === "delete") {
    deleteSavedPalette(id);
  }
}

generateBtn.addEventListener("click", handleGenerateClick);
saveBtn.addEventListener("click", handleSaveClick);
savedList.addEventListener("click", handleSavedListClick);

/* ---- Estado inicial ----
   Si ya hay paletas guardadas de una sesión anterior, se muestran apenas
   carga la página. */
renderSavedPalettes();
