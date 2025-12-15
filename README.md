# Sistema de Gestión de Complejo Turístico

Este proyecto es una aplicación web moderna para la gestión de reservas, huéspedes y operaciones de un complejo turístico (PMS - Property Management System).

## 🚀 Tecnologías

Construido con un stack tecnológico moderno y robusto:
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: Radix UI / Shadcn UI
- **Iconos**: Lucide React
- **Estado Global**: React Context API con persistencia local (LocalStorage)

## 📂 Estructura del Proyecto

- `src/app`: Páginas y rutas de la aplicación (Dashboard, Reservas, etc.).
- `src/components`:
  - `/ui`: Componentes base reutilizables (Botones, Inputs, Cards).
  - `/dashboard`: Widgets y componentes específicos del negocio.
- `src/contexts`: Lógica de negocio y estado global (Reservas, Huéspedes, Pagos).
- `src/types`: Definiciones de tipos e interfaces del dominio.
- `src/lib`: Utilidades y constantes.

## 🛠️ Instalación y Ejecución

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```

3.  Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 💡 Funcionamiento del Sistema

### Gestión de Reservas
El núcleo del sistema es el `ReservationsContext`, que actúa como una base de datos en memoria (persistida en LocalStorage para esta versión). Maneja:
- Creación, edición y cancelación de reservas.
- Lógica de asignación de unidades.
- Cálculos financieros (Totales en USD, pagos parciales).
- Control de estados (Activa, Limpieza, Check-out).

### Gestión de Huéspedes
`GuestsContext` mantiene una base de datos centralizada de clientes, permitiendo historial de visitas y autocompletado en nuevas reservas.

### Calendario
La vista de calendario visualiza la ocupación por unidad y fecha, permitiendo interactuar directamente con las reservas.
