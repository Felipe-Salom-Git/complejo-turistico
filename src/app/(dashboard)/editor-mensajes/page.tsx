'use client';

import React, { useState } from 'react';
import { Save, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useMessages } from '@/contexts/MessagesContext';

export default function EditorMensajes() {
  const { mensajes, updateMensaje, saveMensajes } = useMessages();

  const handleSave = () => {
    saveMensajes();
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
                    updateMensaje("confirmacionReserva", e.target.value)
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
                    updateMensaje("recordatorioCheckin", e.target.value)
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
                    updateMensaje("bienvenida", e.target.value)
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
                    updateMensaje("agradecimiento", e.target.value)
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
                    updateMensaje("cotizacion", e.target.value)
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
