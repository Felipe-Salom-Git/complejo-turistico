'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Download,
  Upload,
  Database,
  FileText,
  Calendar,
  Users,
  Home,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Operaciones() {
  const backupHistory = [
    { id: 1, fecha: '2025-10-17 02:00', tipo: 'Completo', tamaño: '2.4 GB' },
    { id: 2, fecha: '2025-10-16 02:00', tipo: 'Completo', tamaño: '2.3 GB' },
    { id: 3, fecha: '2025-10-15 02:00', tipo: 'Completo', tamaño: '2.3 GB' },
  ];

  const systemStatus = [
    { servicio: 'Base de Datos', estado: 'operativo', uptime: '99.9%' },
    { servicio: 'API Gateway', estado: 'operativo', uptime: '99.8%' },
    { servicio: 'Sistema de Pagos', estado: 'operativo', uptime: '99.7%' },
    { servicio: 'Notificaciones', estado: 'operativo', uptime: '98.5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Operaciones del Sistema</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión técnica y configuraciones avanzadas
          </p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemStatus.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{item.servicio}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.uptime}</Badge>
                        <Badge className="bg-green-500 text-white">
                          {item.estado}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Versión del sistema:
                    </span>
                    <span className="text-sm">v2.5.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Última actualización:
                    </span>
                    <span className="text-sm">2025-10-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Registros en base de datos:
                    </span>
                    <span className="text-sm">15,248</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Espacio utilizado:
                    </span>
                    <span className="text-sm">8.5 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-[var(--color-primary)] h-2 rounded-full"
                      style={{ width: '17%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Usuarios activos:
                    </span>
                    <span className="text-sm">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tiempo de actividad:
                    </span>
                    <span className="text-sm">45 días, 12 horas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Database className="w-8 h-8" />
                  <span>Optimizar BD</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Download className="w-8 h-8" />
                  <span>Exportar Datos</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Upload className="w-8 h-8" />
                  <span>Importar Datos</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Settings className="w-8 h-8" />
                  <span>Configuración</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestión de Backups</CardTitle>
                <Button className="bg-[var(--color-primary)]">
                  <Download className="w-4 h-4 mr-2" />
                  Crear Backup Ahora
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm">
                    Los backups automáticos se realizan diariamente a las 02:00
                    AM
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Próximo backup programado: Mañana a las 02:00
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm">Historial de Backups</h4>
                  {backupHistory.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="text-sm">{backup.fecha}</p>
                        <p className="text-xs text-gray-500">
                          {backup.tipo} - {backup.tamaño}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Restaurar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generar Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-[var(--color-primary)]" />
                    <div>
                      <h4 className="text-sm">Reporte de Reservas</h4>
                      <p className="text-xs text-gray-500">
                        Lista completa de reservas
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Generar PDF
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-8 h-8 text-[var(--color-primary)]" />
                    <div>
                      <h4 className="text-sm">Reporte de Huéspedes</h4>
                      <p className="text-xs text-gray-500">
                        Base de datos completa
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Generar Excel
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-8 h-8 text-[var(--color-primary)]" />
                    <div>
                      <h4 className="text-sm">Reporte de Ocupación</h4>
                      <p className="text-xs text-gray-500">
                        Estadísticas mensuales
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Generar PDF
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Home className="w-8 h-8 text-[var(--color-primary)]" />
                    <div>
                      <h4 className="text-sm">Reporte de Mantenimiento</h4>
                      <p className="text-xs text-gray-500">
                        Historial de tickets
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Generar PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm">Booking.com</h4>
                    <p className="text-xs text-gray-500">
                      Sincronización de reservas
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">Activo</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm">Mercado Pago</h4>
                    <p className="text-xs text-gray-500">
                      Procesamiento de pagos
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">Activo</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm">WhatsApp Business</h4>
                    <p className="text-xs text-gray-500">
                      Mensajería automática
                    </p>
                  </div>
                  <Badge variant="secondary">Inactivo</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm">Google Calendar</h4>
                    <p className="text-xs text-gray-500">
                      Sincronización de eventos
                    </p>
                  </div>
                  <Badge variant="secondary">Inactivo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
