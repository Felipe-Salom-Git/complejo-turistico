'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Messages {
  confirmacionReserva: string;
  recordatorioCheckin: string;
  bienvenida: string;
  agradecimiento: string;
  cotizacion: string;
}

interface MessagesContextType {
  mensajes: Messages;
  updateMensaje: (key: keyof Messages, value: string) => void;
  saveMensajes: () => void;
}

const defaultMensajes: Messages = {
  confirmacionReserva: `Hola {nombre},

Tu reserva ha sido confirmada exitosamente.

Detalles de la reserva:
- Unidad: {unidad}
- Check-in: {checkin}
- Check-out: {checkout}
- Personas: {pax}

Total: {total}

¡Esperamos verte pronto!

Complejo Turístico Las Gaviotas & Fontana`,

  recordatorioCheckin: `Hola {nombre},

Te recordamos que tu check-in es mañana {checkin} a las 14:00 hs.

Ubicación: {direccion}

Si tienes alguna consulta, no dudes en contactarnos.

¡Hasta mañana!`,

  bienvenida: `¡Bienvenido/a {nombre}!

Esperamos que disfrutes tu estadía en {unidad}.

Horarios importantes:
- Check-out: 10:00 AM
- Desayuno: 8:00 - 10:30 AM
- Pileta: 9:00 AM - 8:00 PM

Ante cualquier consulta, comunícate con recepción.

¡Que tengas una excelente estadía!`,

  agradecimiento: `Estimado/a {nombre},

Gracias por elegirnos para tu estadía.

Esperamos que hayas disfrutado de tu tiempo en nuestro complejo y esperamos verte nuevamente pronto.

Si tienes algún comentario o sugerencia, nos encantaría escucharte.

¡Hasta la próxima!

Complejo Turístico Las Gaviotas & Fontana`,

  cotizacion: `Estimado/a {nombre},

Adjuntamos la cotización solicitada para tu reserva:

Fechas: {checkin} - {checkout}
Unidades: {unidades}
Personas: {pax}

Servicios incluidos:
{servicios}

Total: {total}

Esta cotización tiene validez de {validez} días.

Quedamos a tu disposición para cualquier consulta.

Saludos cordiales,
Complejo Turístico Las Gaviotas & Fontana`,
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [mensajes, setMensajes] = useState<Messages>(defaultMensajes);

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('mensajes');
    if (stored) {
      setMensajes(JSON.parse(stored));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
  }, [mensajes]);

  const updateMensaje = (key: keyof Messages, value: string) => {
    setMensajes(prev => ({ ...prev, [key]: value }));
  };

  const saveMensajes = () => {
    // Explicit save is handled by useEffect, but we keep this for API/Feedback purposes
    // or if we switch to manual save mode later.
    // For now, it just confirms.
    console.log('Mensajes guardados:', mensajes);
  };

  return (
    <MessagesContext.Provider value={{ mensajes, updateMensaje, saveMensajes }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}
