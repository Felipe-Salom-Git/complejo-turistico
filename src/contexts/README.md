# Contextos (Gestión de Estado)

Esta carpeta contiene la lógica de negocio principal de la aplicación.

## `ReservationsContext.tsx`
Gestiona el ciclo de vida de las reservas y la disponibilidad de unidades.
- **Estado**: Lista de todas las reservas (`Reservation[]`).
- **Persistencia**: `localStorage.getItem('reservations')`.
- **Acciones Clave**: `addReservation`, `checkIn`, `checkOut`, `findAvailableUnit`.

## `GuestsContext.tsx`
Base de datos de clientes.
- **Estado**: Lista de huéspedes (`Guest[]`).
- **Acciones Clave**: `addGuest`, `incrementVisits`.

## `MessagesContext.tsx`
Sistema de mensajería interna o recordatorios para el staff.

## Patrones
Todos los contextos siguen el patrón Provider/Hook:
1.  **Provider**: Envuelve la aplicación en `app/layout.tsx` o `providers.tsx`.
2.  **Hook**: Se consume via `useReservations()`, `useGuests()`, etc.
