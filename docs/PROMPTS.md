# Documentación del uso de IA

Este proyecto se desarrolló con apoyo de **Claude** (Anthropic), usado desde
el chat web para planificación, diseño y generación de código, y desde
**Claude Code** para las operaciones de terminal (Git, GitHub CLI).

> 📸 Agregar acá capturas del chat que respalden los prompts listados abajo
> (o linkear a la carpeta de Drive donde estén).

## Cómo se usó la IA en cada etapa

### 1. Planificación del trabajo

**Prompt:** *"Este es el calendario del Módulo 1 y antes del jueves debo
presentar el trabajo integrador del Módulo 1"* (con captura del calendario)

**Resultado:** a partir del calendario y, después, de la consigna oficial y
la rúbrica (subidas como PDF), se armó un plan de trabajo dividido en 8
bloques con horarios, pensado para cubrir primero el MVP obligatorio y
dejar los extras y la documentación para el final — siguiendo la
recomendación de la guía del proyecto de "priorizar que el botón principal
y la generación de paletas funcionen correctamente" antes que nada.

### 2. Estructura HTML

**Prompt:** *"vamos con el paso 2"* (siguiendo el plan ya acordado)

**Resultado:** estructura semántica (`header`, `main`, `footer`, `section`)
con el selector de tamaño, el botón principal y el contenedor de la paleta.
Decisiones puntuales sugeridas por la IA y aceptadas: usar `<ul>` para el
contenedor de colores (es una colección de ítems, no un `<div>` genérico),
asociar el `<label>` al `<select>` explícitamente, y agregar una región
`aria-live` para el toast desde el HTML, antes incluso de escribir el JS.

### 3. Diseño visual (CSS)

**Prompt:** *"vamos con el paso 3"*

**Resultado:** paleta de color neutra para la interfaz (para no competir
visualmente con los colores generados) y las tarjetas de color diseñadas
como fichas de pintura, con el código separado del swatch para garantizar
contraste de texto sin importar qué color aleatorio se genere. Se ajustó
después (paso 4) para acomodar los dos formatos de color requeridos.

### 4. Lógica de generación de colores (JavaScript)

**Prompt:** *"si"* (confirmando avanzar al paso 4 del plan)

**Resultado:** funciones para generar valores HSL aleatorios acotados a
rangos agradables, conversión HSL → HEX, render dinámico de tarjetas según
el tamaño elegido, y el sistema de toast para el microfeedback.

### 5. Deploy

**Prompts:** *"como deployo a github pages?"*

**Resultado:** guía paso a paso para activar GitHub Pages desde
Settings → Pages, más una alternativa por línea de comando (`gh api`) para
hacerlo desde la terminal con Claude Code.

### 6. Extra credit: guardado en localStorage

**Prompt:** selección de *"Guardado en localStorage"* entre las opciones de
extra credit sugeridas.

**Resultado:** sistema completo de guardar / cargar / eliminar paletas,
persistido en `localStorage` con manejo de errores, y un tope de 12
paletas guardadas para no dejar crecer la lista indefinidamente.

### 7. Flujo de trabajo con Git

**Prompt:** *"por favor en cada paso que vamos haciendo, indicame cuando
commitear y los commits messages"*

**Resultado:** a partir de ese pedido, cada paso del desarrollo cerró con
comandos de `git add` / `git commit` listos para pegar, siguiendo la
convención `tipo: descripción` (`feat`, `style`) pedida por la guía del
proyecto — separando por ejemplo los ajustes de estilos de la lógica nueva
en commits distintos.

## Reflexión sobre el uso de IA

La IA se usó como par de trabajo para tomar decisiones de diseño y
arquitectura (por ejemplo, por qué separar el código HEX del swatch de
color, o por qué usar delegación de eventos en la lista de guardadas), no
solo para autocompletar código. Las decisiones técnicas quedaron
documentadas en el `README.md` principal, y cada pieza de código generada
se probó manualmente en el navegador antes de darla por válida y avanzar
al siguiente paso.
