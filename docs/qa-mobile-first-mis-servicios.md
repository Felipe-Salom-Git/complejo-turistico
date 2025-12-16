# QA Mobile-First: Mis Servicios (PWA)

Documentación de pruebas para asegurar la operatividad en dispositivos móviles.

## 1️⃣ Instalación PWA (Progressive Web App)
Objetivo: Asegurar que la app se puede instalar y comportar como nativa.

- [ ] **Instalación**: Al acceder a `/mis-servicios` desde Chrome/Safari, ¿aparece la opción "Agregar a Inicio" o "Instalar"?
- [ ] **Modo Standalone**: Al abrir desde el ícono de inicio, ¿se oculta la barra de direcciones del navegador?
- [ ] **Ícono**: ¿El ícono se ve nítido y correcto en el menú de aplicaciones?
- [ ] **Splash Screen**: (Opcional) ¿Hay una transición suave al abrir la app?

## 2️⃣ Notificaciones
Objetivo: Verificar la correcta recepción y diferenciación de alertas.

- [ ] **Permiso**: Al dar clic en "Activar Notificaciones", ¿el navegador pide permiso correctamente?
- [ ] **Silenciosa (Default)**:
    - Crear tarea normal desde Recepción.
    - Celular en reposo / App cerrada.
    - ¿Llega notificación sin sonido/vibración invasiva?
    - ¿Aparece en la bandeja de notificaciones?
- [ ] **Urgente (Critical)**:
    - Crear tarea marcada como "URGENTE" desde Recepción.
    - ¿El celular vibra/suena (según config del usuario)?
    - ¿El título indica claramente la urgencia (ej. "🔴")?
- [ ] **Interacción**: Al tocar la notificación, ¿se abre la app en la pantalla de "Mis Servicios"?

## 3️⃣ Uso Operativo (Ergonomía)
Objetivo: Asegurar que se puede usar cómodamente con una mano mientras se trabaja.

- [ ] **Tamaño de Toque**: ¿Los checkboxes de las tareas son lo suficientemente grandes para "dedos de trabajo"?
- [ ] **Scroll**: ¿El desplazamiento por la lista de tareas es fluido?
- [ ] **Observaciones**: Al intentar escribir una observación:
    - ¿El teclado virtual tapa el campo de texto?
    - ¿El botón de "Guardar" sigue visible?
- [ ] **Legibilidad**: ¿El texto (Unidad, Tipo de Servicio) se lee bien bajo la luz del sol (contraste)?

## 4️⃣ Conectividad y Robustez
Objetivo: Simular condiciones reales de mala señal en el complejo.

- [ ] **Modo Avión**:
    - Cargar la lista de tareas.
    - Activar modo avión.
    - ¿La lista sigue visible? (Cache SW)
- [ ] **Recuperación**:
    - Completar una tarea en modo avión (si la app lo permite localmente) o intentar recargar.
    - Desactivar modo avión.
    - ¿Se sincroniza o al menos no crashea?
- [ ] **Pantalla Blanca**: Verificar que nunca se quede la pantalla en blanco (White Screen of Death).

## 5️⃣ Simulación de Turno Real
1. Mucama entra al turno, abre la PWA.
2. Recibe notificación "Nueva Tarea: Cabaña 4 - Check-out".
3. Va a la cabaña con el celular en el bolsillo.
4. Termina, saca el celular, marca "Completado".
5. Recibe notificación URGENTE "Repaso Baño Cabaña 2".
6. Siente la vibración, revisa y acude de inmediato.

## 6️⃣ Errores y Mensajes
- [ ] Si falla la conexión, ¿hay un mensaje amigable?
- [ ] Si no hay tareas, ¿el mensaje de "No hay tareas" es claro?
