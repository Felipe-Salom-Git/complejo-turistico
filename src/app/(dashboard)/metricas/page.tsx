'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/MetricCard';
import {
  DollarSign,
  TrendingUp,
  Users,
  Home,
  Calendar,
  Star,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export default function Metricas() {
  const revenueData = [
    { month: 'Ene', ingresos: 45000, gastos: 25000 },
    { month: 'Feb', ingresos: 52000, gastos: 28000 },
    { month: 'Mar', ingresos: 68000, gastos: 32000 },
    { month: 'Abr', ingresos: 61000, gastos: 30000 },
    { month: 'May', ingresos: 75000, gastos: 33000 },
    { month: 'Jun', ingresos: 82000, gastos: 35000 },
  ];

  const occupancyData = [
    { month: 'Ene', ocupacion: 65 },
    { month: 'Feb', ocupacion: 75 },
    { month: 'Mar', ocupacion: 85 },
    { month: 'Abr', ocupacion: 80 },
    { month: 'May', ocupacion: 90 },
    { month: 'Jun', ocupacion: 95 },
  ];

  const unitTypeData = [
    { name: 'Cabañas', value: 45 },
    { name: 'Suites', value: 30 },
    { name: 'Deluxe', value: 15 },
    { name: 'Premium', value: 10 },
  ];

  const originData = [
    { origen: 'Buenos Aires', cantidad: 120 },
    { origen: 'Córdoba', cantidad: 85 },
    { origen: 'Rosario', cantidad: 60 },
    { origen: 'Mendoza', cantidad: 45 },
    { origen: 'Otros', cantidad: 90 },
  ];

  const COLORS = ['#2A7B79', '#F5B841', '#3B82F6', '#10B981'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Métricas y Análisis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Estadísticas y reportes del complejo
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <option>Último mes</option>
            <option>Últimos 3 meses</option>
            <option>Últimos 6 meses</option>
            <option>Último año</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos Totales"
          value="$383,000"
          icon={DollarSign}
          description="Últimos 6 meses"
          trend={{ value: 28.5, isPositive: true }}
          color="#2A7B79"
        />
        <MetricCard
          title="Ocupación Promedio"
          value="81.7%"
          icon={Home}
          description="Últimos 6 meses"
          trend={{ value: 12.3, isPositive: true }}
          color="#10B981"
        />
        <MetricCard
          title="Huéspedes Totales"
          value="1,248"
          icon={Users}
          description="Últimos 6 meses"
          trend={{ value: 15.8, isPositive: true }}
          color="#3B82F6"
        />
        <MetricCard
          title="Ticket Promedio"
          value="$32,450"
          icon={TrendingUp}
          description="Por reserva"
          trend={{ value: 8.2, isPositive: true }}
          color="#F5B841"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stackId="1"
                  stroke="#2A7B79"
                  fill="#2A7B79"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="gastos"
                  stackId="2"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ocupación</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ocupacion"
                  stroke="#F5B841"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferencia por Tipo de Unidad</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={unitTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {unitTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origen de Visitantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={originData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="origen" type="category" />
                <Tooltip />
                <Bar dataKey="cantidad" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Temporada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Temporada Alta</span>
                  <span className="text-sm">95%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[var(--color-primary)] h-2 rounded-full"
                    style={{ width: '95%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Temporada Media</span>
                  <span className="text-sm">78%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[var(--color-secondary)] h-2 rounded-full"
                    style={{ width: '78%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Temporada Baja</span>
                  <span className="text-sm">52%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: '52%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calificación Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-16 h-16 text-[var(--color-secondary)] fill-current" />
                  <span className="text-5xl">4.8</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Basado en 324 reseñas
                </p>
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 text-[var(--color-secondary)] fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas Anticipadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm">0-7 días</span>
                </div>
                <span className="text-sm">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-secondary)]" />
                  <span className="text-sm">8-15 días</span>
                </div>
                <span className="text-sm">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">16-30 días</span>
                </div>
                <span className="text-sm">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-sm">+30 días</span>
                </div>
                <span className="text-sm">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
