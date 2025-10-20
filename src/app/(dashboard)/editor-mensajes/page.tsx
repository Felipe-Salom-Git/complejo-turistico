'use client';

import React, { useState } from 'react';
import { Save, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';

export function EditorMensajes() {
  const [mensajes, setMensajes] = useState({
    confirmacionReserva: `Hola {nombre},

Tu reserva ha sido confirmada exitosamente.

Detalles de la reserva:
- Unidad: {unidad}
- Check-in: {checkin}
- Check-out: {checkout}
- Personas: {pax}

Total: ${'{total}'}

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

Total: ${'{total}'}

Esta cotización tiene validez de {validez} días.

Quedamos a tu disposición para cualquier consulta.

Saludos cordiales,
Complejo Turístico Las Gaviotas & Fontana`,
  });

  const handleSave = () => {
    // Save logic here
    alert('Mensajes guardados exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Editor de Mensajes Predeterminados</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Personaliza las plantillas de mensajes automáticos
          </p>
        </div>
        <Button
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
          onClick={handleSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Plantillas de Mensajes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="confirmacion">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="confirmacion">Confirmación</TabsTrigger>
              <TabsTrigger value="recordatorio">Recordatorio</TabsTrigger>
              <TabsTrigger value="bienvenida">Bienvenida</TabsTrigger>
              <TabsTrigger value="agradecimiento">Agradecimiento</TabsTrigger>
              <TabsTrigger value="cotizacion">Cotización</TabsTrigger>
            </TabsList>

            <TabsContent value="confirmacion" className="space-y-4">
              <div>
                <Label>Mensaje de Confirmación de Reserva</Label>
                <Textarea
                  className="mt-2 min-h-[300px]"
                  value={mensajes.confirmacionReserva}
                  onChange={(e) =>
                    setMensajes({
                      ...mensajes,
                      confirmacionReserva: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variables disponibles: {'{nombre}'}, {'{unidad}'},{' '}
                  {'{checkin}'}, {'{checkout}'}, {'{pax}'}, {'{total}'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="recordatorio" className="space-y-4">
              <div>
                <Label>Mensaje de Recordatorio de Check-in</Label>
                <Textarea
                  className="mt-2 min-h-[300px]"
                  value={mensajes.recordatorioCheckin}
                  onChange={(e) =>
                    setMensajes({
                      ...mensajes,
                      recordatorioCheckin: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variables disponibles: {'{nombre}'}, {'{checkin}'},{' '}
                  {'{direccion}'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="bienvenida" className="space-y-4">
              <div>
                <Label>Mensaje de Bienvenida</Label>
                <Textarea
                  className="mt-2 min-h-[300px]"
                  value={mensajes.bienvenida}
                  onChange={(e) =>
                    setMensajes({ ...mensajes, bienvenida: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variables disponibles: {'{nombre}'}, {'{unidad}'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="agradecimiento" className="space-y-4">
              <div>
                <Label>Mensaje de Agradecimiento</Label>
                <Textarea
                  className="mt-2 min-h-[300px]"
                  value={mensajes.agradecimiento}
                  onChange={(e) =>
                    setMensajes({
                      ...mensajes,
                      agradecimiento: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variables disponibles: {'{nombre}'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cotizacion" className="space-y-4">
              <div>
                <Label>Mensaje de Cotización</Label>
                <Textarea
                  className="mt-2 min-h-[300px]"
                  value={mensajes.cotizacion}
                  onChange={(e) =>
                    setMensajes({ ...mensajes, cotizacion: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variables disponibles: {'{nombre}'}, {'{checkin}'},{' '}
                  {'{checkout}'}, {'{unidades}'}, {'{pax}'}, {'{servicios}'}
                  , {'{total}'}, {'{validez}'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm whitespace-pre-wrap">
              {mensajes.confirmacionReserva
                .replace('{nombre}', 'Juan Pérez')
                .replace('{unidad}', 'Cabaña 8')
                .replace('{checkin}', '2025-10-20')
                .replace('{checkout}', '2025-10-25')
                .replace('{pax}', '4')
                .replace('{total}', '35,000')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
