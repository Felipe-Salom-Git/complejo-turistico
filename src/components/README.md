# Componentes del Sistema

## `/ui`
Esta carpeta contiene componentes de interfaz genéricos y reutilizables, basados en **Shadcn UI**. Son agnósticos al negocio y se utilizan para construir la interfaz visual (Botones, Modales, Tablas, Inputs).

## `/dashboard`
Contiene componentes de alto nivel ("Widgets") que están acoplados a la lógica de negocio.
- **Widgets**: Muestran resúmenes, estadísticas o herramientas rápidas (ej. `CheckInWidget`, `CheckOutWidget`).
- Suelen consumir los Contextos (`useReservations`, etc.) para mostrar datos reales.
