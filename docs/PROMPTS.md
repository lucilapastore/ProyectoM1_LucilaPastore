# Documentación del uso de IA

Siguiendo lo aprendido en el módulo, se usó **Claude** (Anthropic) como
apoyo durante todo el desarrollo: desde el chat web para planificación,
diseño y generación de código, y **Claude Code** para las operaciones de
terminal (Git, GitHub CLI). Esta documentación detalla los prompts
utilizados en cada etapa y cómo influyeron en las decisiones técnicas y de
organización del proyecto.

> 📸 Agregar acá capturas del chat que respalden los prompts listados abajo
> (o linkear a la carpeta de Drive donde estén).

## Prompts utilizados y su impacto en el desarrollo

### 1. Planificación del trabajo

**Prompt:**
> "Este es el calendario del Módulo 1 y antes del jueves debo presentar el
> trabajo integrador del Módulo 1" (con captura del calendario, seguido de
> la consigna oficial y la rúbrica en PDF)

**Cómo influyó en el desarrollo:** a partir de la consigna y la rúbrica se
armó un plan de trabajo dividido en 8 bloques con horarios, ordenado según
la prioridad que marca la guía del proyecto: primero el MVP obligatorio
(estructura, estilos, lógica, deploy) y recién después los extras y la
documentación. Esta decisión de secuencia evitó el error común que
advierte la propia guía: "priorizar extras antes de que el MVP funcione".

### 2. Estructura HTML

**Prompt:**
> "vamos con el paso 2" (siguiendo el plan ya acordado, para la estructura
> semántica de la app)

**Cómo influyó en el desarrollo:** definió el uso de etiquetas semánticas
(`header`, `main`, `footer`, `section`) en vez de `div` genéricos, aplicando
directamente el objetivo del módulo de "estructurar documentos web
utilizando etiquetas HTML5 semánticas". También se tomaron decisiones
puntuales de accesibilidad desde este primer paso, no como agregado
posterior: asociar cada `<label>` con su `<select>` mediante `for`/`id`, y
declarar la región del toast con `aria-live="polite"` desde el HTML, antes
de escribir una sola línea de JavaScript.

### 3. Diseño visual (CSS)

**Prompt:**
> "vamos con el paso 3"

**Cómo influyó en el desarrollo:** llevó a una decisión de diseño
deliberada: usar una paleta de color neutra para toda la interfaz, para
que los colores generados por el usuario —y no el "chrome" de la
aplicación— fueran siempre el foco visual. De esa misma conversación salió
el diseño de las tarjetas de color como fichas de pintura, con el código
del color separado del swatch. Esta decisión resuelve de raíz un problema
de accesibilidad: garantiza contraste de texto suficiente sin importar qué
color aleatorio se genere, en vez de intentar calcular contraste dinámico
color por color.

### 4. Lógica de generación de colores (JavaScript)

**Prompt:**
> "si" (confirmando avanzar al paso 4: generación de colores, render
> dinámico y microfeedback)

**Cómo influyó en el desarrollo:** se implementaron funciones separadas y
pequeñas para cada responsabilidad (generar HSL aleatorio, convertir a
HEX, renderizar tarjetas, mostrar el toast), en línea con la buena
práctica de la guía de "separar la lógica en funciones pequeñas" y "evitar
código duplicado". La decisión de generar el color primero en HSL y
convertirlo a HEX —en vez de generar ambos formatos por separado— vino
directamente de la sugerencia de la IA, y evitó tener dos fuentes de
verdad para un mismo color.

### 5. Deploy en GitHub Pages

**Prompt:**
> "como deployo a github pages?"

**Cómo influyó en el desarrollo:** se decidió activar el deploy temprano
(antes de terminar los extras), siguiendo la recomendación de probar en
producción con tiempo de sobra para detectar errores. Esto también influyó
en una decisión previa del HTML: usar rutas relativas sin barra inicial
(`css/styles.css`, no `/css/styles.css`), necesario para que los archivos
se sirvan correctamente desde un project page de GitHub Pages.

### 6. Extra credit: guardado en localStorage

**Prompt:** selección de "Guardado en localStorage" entre las opciones de
extra credit sugeridas por la IA.

**Cómo influyó en el desarrollo:** definió una funcionalidad completa de
persistencia (guardar, cargar y eliminar paletas) aplicando conceptos del
módulo sobre manipulación del DOM y manejo de eventos. También introdujo
dos decisiones técnicas puntuales: usar delegación de eventos para la
lista de guardadas (un solo listener para cualquier cantidad de ítems,
en vez de uno por elemento) y envolver las operaciones de `localStorage`
en `try/catch`, para que la app no se rompa si el storage está lleno o
deshabilitado.

### 7. Flujo de trabajo con Git

**Prompt:**
> "por favor en cada paso que vamos haciendo, indicame cuando commitear y
> los commits messages"

**Cómo influyó en el desarrollo:** a partir de este pedido, cada paso del
desarrollo cerró con comandos de `git add` / `git commit` listos para
usar, siguiendo la convención `tipo: descripción` (`feat`, `style`, `docs`)
pedida por la guía del proyecto. Esto también llevó a separar en commits
distintos cambios que, aunque se hicieron en el mismo momento, correspondían
a responsabilidades distintas — por ejemplo, un ajuste de estilos CSS
separado del commit de la lógica JS que lo necesitaba.

## Reflexión general

El uso de IA en este proyecto no se limitó a autocompletar código: se usó
como apoyo para pensar decisiones de arquitectura y diseño (por qué
separar el código HEX del swatch de color, por qué usar delegación de
eventos, por qué generar en HSL y convertir a HEX en vez de generar ambos
formatos por separado) y para mantener un flujo de Git ordenado desde el
primer commit. Cada pieza de código sugerida se probó manualmente en el
navegador antes de darla por válida, lo que permitió avanzar paso a paso
entendiendo el flujo completo de desarrollo Frontend —estructura, estilos,
lógica, versionado y despliegue— en vez de simplemente copiar una
solución ya armada.