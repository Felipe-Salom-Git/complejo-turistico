'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlancosTab } from '@/components/stock/BlancosTab';
import { MatafuegosTab } from '@/components/stock/MatafuegosTab';
import { CocinaTab } from '@/components/stock/CocinaTab';
import { MantenimientoTab } from '@/components/stock/MantenimientoTab';
import { MinutasTab } from '@/components/stock/MinutasTab';
import { LimpiezaTab } from '@/components/stock/LimpiezaTab';

export default function Stock() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Stock e Inventario</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Control de insumos y materiales del complejo
          </p>
        </div>
      </div>

      <Tabs defaultValue="blancos" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="blancos">Blancos</TabsTrigger>
          <TabsTrigger value="matafuegos">Matafuegos</TabsTrigger>
          <TabsTrigger value="cocina">Cocina</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="minutas">Minutas</TabsTrigger>
          <TabsTrigger value="limpieza">Limpieza</TabsTrigger>
        </TabsList>

        <TabsContent value="blancos">
          <BlancosTab />
        </TabsContent>

        <TabsContent value="matafuegos">
          <MatafuegosTab />
        </TabsContent>

        <TabsContent value="cocina">
          <CocinaTab />
        </TabsContent>

        <TabsContent value="mantenimiento">
          <MantenimientoTab />
        </TabsContent>

        <TabsContent value="minutas">
          <MinutasTab />
        </TabsContent>

        <TabsContent value="limpieza">
          <LimpiezaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
