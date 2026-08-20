/* ==========================================================================
   Generador de Paletas Interactivo — Colorfly Studio
   ==========================================================================
   Cada color se genera primero en HSL (más fácil de controlar para que salgan
   tonos agradables) y después se convierte a HEX. Así la app cumple los dos
   formatos que pide la consigna, y el HEX —que es obligatorio mostrar
   siempre— sale directo de esa conversión, sin lógica duplicada.
   ========================================================================== */

/* ---- Referencias al DOM ---- */
const selectorTamanio = document.getElementById("palette-size");
const botonGenerar = document.getElementById("generate-btn");
const botonGuardar = document.getElementById("save-btn");
const contenedorPaleta = document.getElementById("palette-container");
const listaGuardadas = document.getElementById("saved-palettes-list");
const elementoToast = document.getElementById("toast");

// Paleta actualmente mostrada en pantalla — la necesita el botón "Guardar".
let paletaActual = [];

const ICONO_CANDADO_CERRADO = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M17 9h-1V7A4 4 0 0 0 8 7v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm4 8.7V18h-2v-2.3a1.5 1.5 0 1 1 2 0Z"/>
  </svg>
`;

const ICONO_CANDADO_ABIERTO = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M17 9h-6V7a3 3 0 0 1 5.8-1h2.1A5 5 0 0 0 9 7v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-4 7.7V18h-2v-2.3a1.5 1.5 0 1 1 2 0Z"/>
  </svg>
`;

/* ---- Generación de color ---- */

// Entero aleatorio entre minimo y maximo, ambos inclusive.
function obtenerEnteroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

// Saturación y luminosidad acotadas a rangos "agradables": evita colores
// demasiado grises (saturación muy baja) o demasiado oscuros/claros
// (luminosidad extrema), que además complicarían la legibilidad.
function generarHSLAleatorio() {
  const h = obtenerEnteroAleatorio(0, 359);
  const s = obtenerEnteroAleatorio(60, 90);
  const l = obtenerEnteroAleatorio(40, 65);
  return { h, s, l };
}

// Conversión HSL -> HEX (algoritmo estándar).
function hslAHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const aHexadecimal = (x) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");

  return `#${aHexadecimal(f(0))}${aHexadecimal(f(8))}${aHexadecimal(f(4))}`.toUpperCase();
}

// Un color = sus dos formatos, listos para mostrar.
function generarColor() {
  const { h, s, l } = generarHSLAleatorio();
  return {
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    hex: hslAHex(h, s, l),
    bloqueado: false,
  };
}

// Conserva los colores con candado y solo regenera el resto.
function generarPaleta(tamanio) {
  const paleta = [];
  for (let i = 0; i < tamanio; i++) {
    const existente = paletaActual[i];
    if (existente && existente.bloqueado) {
      paleta.push(existente);
    } else {
      paleta.push(generarColor());
    }
  }
  return paleta;
}

/* ---- Render ---- */

function crearBotonBloqueo(color, indice) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "color-lock";
  boton.dataset.accion = "bloquear";
  boton.dataset.indice = String(indice);
  boton.setAttribute("aria-pressed", String(Boolean(color.bloqueado)));
  boton.setAttribute(
    "aria-label",
    color.bloqueado ? "Desbloquear color" : "Bloquear color",
  );
  boton.innerHTML = color.bloqueado ? ICONO_CANDADO_CERRADO : ICONO_CANDADO_ABIERTO;
  return boton;
}

function crearTarjetaColor(color, indice) {
  const tarjeta = document.createElement("li");
  tarjeta.className = color.bloqueado ? "color-card color-card--locked" : "color-card";
  tarjeta.style.setProperty("--indice", String(indice));
  tarjeta.dataset.indice = String(indice);

  const muestra = document.createElement("div");
  muestra.className = "color-swatch";
  muestra.style.backgroundColor = color.hex;

  const informacion = document.createElement("div");
  informacion.className = "color-info";

  const etiquetaHex = document.createElement("span");
  etiquetaHex.className = "color-code color-code--hex";
  etiquetaHex.textContent = color.hex;

  const etiquetaHsl = document.createElement("span");
  etiquetaHsl.className = "color-code color-code--hsl";
  etiquetaHsl.textContent = color.hsl;

  informacion.append(etiquetaHex, etiquetaHsl);
  tarjeta.append(muestra, crearBotonBloqueo(color, indice), informacion);

  return tarjeta;
}

function renderizarPaleta(colores) {
  contenedorPaleta.innerHTML = "";
  const fragmento = document.createDocumentFragment();
  colores.forEach((color, indice) => {
    fragmento.appendChild(crearTarjetaColor(color, indice));
  });
  contenedorPaleta.appendChild(fragmento);
}

function actualizarTarjetaBloqueo(indice) {
  const color = paletaActual[indice];
  const tarjeta = contenedorPaleta.querySelector(`[data-indice="${indice}"]`);
  if (!color || !tarjeta) return;

  tarjeta.classList.toggle("color-card--locked", color.bloqueado);

  const boton = tarjeta.querySelector("[data-accion='bloquear']");
  boton.setAttribute("aria-pressed", String(color.bloqueado));
  boton.setAttribute(
    "aria-label",
    color.bloqueado ? "Desbloquear color" : "Bloquear color",
  );
  boton.innerHTML = color.bloqueado ? ICONO_CANDADO_CERRADO : ICONO_CANDADO_ABIERTO;
}

function alternarBloqueo(indice) {
  const color = paletaActual[indice];
  if (!color) return;

  color.bloqueado = !color.bloqueado;
  actualizarTarjetaBloqueo(indice);
  mostrarToast(color.bloqueado ? "Color bloqueado" : "Color desbloqueado");
}

/* ---- Guardado en localStorage ----
   Persiste paletas completas (no solo la última) para que el usuario pueda
   volver a cargarlas después, incluso si cierra el navegador. */

const CLAVE_ALMACENAMIENTO = "colorfly-saved-palettes";
const MAX_PALETAS_GUARDADAS = 12;

function obtenerPaletasGuardadas() {
  try {
    const datosCrudos = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return datosCrudos ? JSON.parse(datosCrudos) : [];
  } catch (error) {
    console.warn("No se pudieron leer las paletas guardadas:", error);
    return [];
  }
}

function establecerPaletasGuardadas(paletas) {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(paletas));
  } catch (error) {
    console.warn("No se pudo guardar en localStorage:", error);
  }
}

function formatearFechaGuardado(cadenaIso) {
  return new Date(cadenaIso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function guardarPaleta(colores) {
  const paletas = obtenerPaletasGuardadas();
  const entrada = {
    id: Date.now(),
    savedAt: new Date().toISOString(),
    colors: colores,
  };

  const actualizadas = [entrada, ...paletas].slice(0, MAX_PALETAS_GUARDADAS);
  establecerPaletasGuardadas(actualizadas);
  renderizarPaletasGuardadas();
}

function eliminarPaletaGuardada(id) {
  const paletas = obtenerPaletasGuardadas().filter((entrada) => entrada.id !== id);
  establecerPaletasGuardadas(paletas);
  renderizarPaletasGuardadas();
  mostrarToast("Paleta eliminada");
}

function cargarPaletaGuardada(id) {
  const entrada = obtenerPaletasGuardadas().find((elemento) => elemento.id === id);
  if (!entrada) return;

  paletaActual = entrada.colors.map((color) => ({
    ...color,
    bloqueado: Boolean(color.bloqueado),
  }));
  renderizarPaleta(paletaActual);
  selectorTamanio.value = String(paletaActual.length);
  mostrarToast("Paleta cargada");
}

function crearItemGuardado(entrada) {
  const elemento = document.createElement("li");
  elemento.className = "saved-palette-item";

  const franja = document.createElement("div");
  franja.className = "saved-swatch-strip";
  entrada.colors.forEach((color) => {
    const punto = document.createElement("span");
    punto.className = "saved-swatch";
    punto.style.backgroundColor = color.hex;
    franja.appendChild(punto);
  });

  const metadatos = document.createElement("span");
  metadatos.className = "saved-meta";
  metadatos.textContent = formatearFechaGuardado(entrada.savedAt);

  const botonCargar = document.createElement("button");
  botonCargar.type = "button";
  botonCargar.className = "saved-action";
  botonCargar.textContent = "Cargar";
  botonCargar.dataset.action = "load";
  botonCargar.dataset.id = entrada.id;

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "saved-action saved-action--delete";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.setAttribute(
    "aria-label",
    `Eliminar paleta guardada (${metadatos.textContent})`,
  );
  botonEliminar.dataset.action = "delete";
  botonEliminar.dataset.id = entrada.id;

  elemento.append(franja, metadatos, botonCargar, botonEliminar);
  return elemento;
}

function renderizarPaletasGuardadas() {
  const paletas = obtenerPaletasGuardadas();
  listaGuardadas.innerHTML = "";

  if (paletas.length === 0) {
    const estadoVacio = document.createElement("li");
    estadoVacio.className = "saved-empty";
    estadoVacio.textContent = "Todavía no guardaste ninguna paleta.";
    listaGuardadas.appendChild(estadoVacio);
    return;
  }

  const fragmento = document.createDocumentFragment();
  paletas.forEach((entrada) => fragmento.appendChild(crearItemGuardado(entrada)));
  listaGuardadas.appendChild(fragmento);
}

/* ---- Microfeedback (toast) ----
   Usa el atributo [hidden] del HTML, que ya tiene role="status" y
   aria-live="polite" — el mensaje se anuncia solo a lectores de pantalla. */

let idTemporizadorToast = null;

function mostrarToast(mensaje) {
  elementoToast.textContent = mensaje;
  elementoToast.hidden = false;

  if (idTemporizadorToast) clearTimeout(idTemporizadorToast);
  idTemporizadorToast = setTimeout(() => {
    elementoToast.hidden = true;
  }, 2500);
}

/* ---- Eventos ---- */

function manejarClicGenerar() {
  const tamanio = parseInt(selectorTamanio.value, 10);
  const paleta = generarPaleta(tamanio);
  const todosBloqueados =
    paleta.length > 0 && paleta.every((color) => color.bloqueado);

  if (todosBloqueados && paleta.length === paletaActual.length) {
    mostrarToast("Todos los colores están bloqueados");
    return;
  }

  paletaActual = paleta;
  renderizarPaleta(paleta);
  mostrarToast(`Paleta de ${tamanio} colores generada`);
}

function manejarClicPaleta(evento) {
  const botonBloqueo = evento.target.closest("[data-accion='bloquear']");
  if (!botonBloqueo) return;

  alternarBloqueo(Number(botonBloqueo.dataset.indice));
}

function manejarClicGuardar() {
  if (paletaActual.length === 0) {
    mostrarToast("Generá una paleta antes de guardarla");
    return;
  }
  guardarPaleta(paletaActual);
  mostrarToast("Paleta guardada");
}

// Delegación de eventos: un solo listener para "Cargar" y "Eliminar",
// sin importar cuántos ítems haya en la lista de guardadas.
function manejarClicListaGuardadas(evento) {
  const boton = evento.target.closest("[data-action]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (boton.dataset.action === "load") {
    cargarPaletaGuardada(id);
  } else if (boton.dataset.action === "delete") {
    eliminarPaletaGuardada(id);
  }
}

botonGenerar.addEventListener("click", manejarClicGenerar);
botonGuardar.addEventListener("click", manejarClicGuardar);
contenedorPaleta.addEventListener("click", manejarClicPaleta);
listaGuardadas.addEventListener("click", manejarClicListaGuardadas);

/* ---- Estado inicial ----
   Si ya hay paletas guardadas de una sesión anterior, se muestran apenas
   carga la página. */
renderizarPaletasGuardadas();
