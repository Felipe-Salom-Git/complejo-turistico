'use client';

import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { MetricCard } from '@/components/MetricCard';
import { TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState('');

  const items = [
    {
      id: 1,
      nombre: 'Toallas blancas',
      categoria: 'Lencería',
      cantidad: 45,
      minimo: 30,
      unidad: 'unidades',
      ubicacion: 'Depósito A',
      ultimaActualizacion: '2025-10-15',
    },
    {
      id: 2,
      nombre: 'Jabón líquido',
      categoria: 'Limpieza',
      cantidad: 12,
      minimo: 20,
      unidad: 'litros',
      ubicacion: 'Depósito B',
      ultimaActualizacion: '2025-10-16',
    },
    {
      id: 3,
      nombre: 'Sábanas Queen',
      categoria: 'Lencería',
      cantidad: 60,
      minimo: 40,
      unidad: 'sets',
      ubicacion: 'Depósito A',
      ultimaActualizacion: '2025-10-14',
    },
    {
      id: 4,
      nombre: 'Papel higiénico',
      categoria: 'Consumibles',
      cantidad: 150,
      minimo: 100,
      unidad: 'rollos',
      ubicacion: 'Depósito B',
      ultimaActualizacion: '2025-10-17',
    },
    {
      id: 5,
      nombre: 'Desinfectante',
      categoria: 'Limpieza',
      cantidad: 8,
      minimo: 15,
      unidad: 'litros',
      ubicacion: 'Depósito B',
      ultimaActualizacion: '2025-10-16',
    },
    {
      id: 6,
      nombre: 'Almohadas',
      categoria: 'Lencería',
      cantidad: 80,
      minimo: 50,
      unidad: 'unidades',
      ubicacion: 'Depósito A',
      ultimaActualizacion: '2025-10-13',
    },
  ];

  const getStockStatus = (cantidad: number, minimo: number) => {
    const percentage = (cantidad / minimo) * 100;
    if (percentage < 50) return 'critico';
    if (percentage < 100) return 'bajo';
    return 'normal';
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'critico':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Crítico
          </Badge>
        );
      case 'bajo':
        return (
          <Badge className="bg-yellow-500 text-white gap-1">
            <AlertCircle className="w-3 h-3" />
            Bajo
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-500 text-white gap-1">
            <Package className="w-3 h-3" />
            Normal
          </Badge>
        );
    }
  };

  const itemsCriticos = items.filter(
    (item) => getStockStatus(item.cantidad, item.minimo) === 'critico'
  ).length;

  const itemsBajos = items.filter(
    (item) => getStockStatus(item.cantidad, item.minimo) === 'bajo'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Stock e Inventario</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Control de insumos y materiales del complejo
          </p>
        </div>
        <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Artículos"
          value={items.length}
          icon={Package}
          description="En inventario"
          color="#2A7B79"
        />
        <MetricCard
          title="Stock Crítico"
          value={itemsCriticos}
          icon={AlertTriangle}
          description="Requiere atención"
          color="#EF4444"
        />
        <MetricCard
          title="Stock Bajo"
          value={itemsBajos}
          icon={TrendingDown}
          description="Por reponer"
          color="#F59E0B"
        />
        <MetricCard
          title="Stock Normal"
          value={items.length - itemsCriticos - itemsBajos}
          icon={TrendingUp}
          description="Nivel adecuado"
          color="#10B981"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventario</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar artículo..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artículo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Última Act.</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const status = getStockStatus(item.cantidad, item.minimo);
                const percentage = (item.cantidad / item.minimo) * 100;

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell>
                      {item.cantidad} {item.unidad}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{item.cantidad}</span>
                          <span>Min: {item.minimo}</span>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className={
                            status === 'critico'
                              ? '[&>div]:bg-red-500'
                              : status === 'bajo'
                              ? '[&>div]:bg-yellow-500'
                              : '[&>div]:bg-green-500'
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getStockBadge(status)}</TableCell>
                    <TableCell>{item.ubicacion}</TableCell>
                    <TableCell>{item.ultimaActualizacion}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {itemsCriticos > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Stock Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items
                .filter(
                  (item) =>
                    getStockStatus(item.cantidad, item.minimo) === 'critico'
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg"
                  >
                    <div>
                      <p className="text-sm">
                        {item.nombre} - {item.cantidad} {item.unidad}{' '}
                        disponibles
                      </p>
                      <p className="text-xs text-gray-500">
                        Mínimo requerido: {item.minimo} {item.unidad}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Reabastecer
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
