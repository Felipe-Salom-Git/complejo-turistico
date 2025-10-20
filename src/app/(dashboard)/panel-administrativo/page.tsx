'use client';

import React from 'react';
import { Shield, Users, Settings, Lock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';

export function PanelAdministrativo() {
  const usuarios = [
    {
      id: 1,
      nombre: 'Admin Usuario',
      email: 'admin@complejo.com',
      rol: 'Administrador',
      estado: 'activo',
      ultimoAcceso: '2025-10-17 14:30',
    },
    {
      id: 2,
      nombre: 'Recepción María',
      email: 'maria@complejo.com',
      rol: 'Recepción',
      estado: 'activo',
      ultimoAcceso: '2025-10-17 12:15',
    },
    {
      id: 3,
      nombre: 'Mantenimiento Juan',
      email: 'juan@complejo.com',
      rol: 'Mantenimiento',
      estado: 'activo',
      ultimoAcceso: '2025-10-17 10:45',
    },
    {
      id: 4,
      nombre: 'Limpieza Ana',
      email: 'ana@complejo.com',
      rol: 'Limpieza',
      estado: 'activo',
      ultimoAcceso: '2025-10-17 09:20',
    },
  ];

  const actividadReciente = [
    {
      id: 1,
      usuario: 'Admin Usuario',
      accion: 'Creó nueva reserva',
      timestamp: '2025-10-17 14:30',
      ip: '192.168.1.100',
    },
    {
      id: 2,
      usuario: 'Recepción María',
      accion: 'Modificó reserva #1234',
      timestamp: '2025-10-17 13:15',
      ip: '192.168.1.101',
    },
    {
      id: 3,
      usuario: 'Mantenimiento Juan',
      accion: 'Completó ticket #45',
      timestamp: '2025-10-17 12:00',
      ip: '192.168.1.102',
    },
    {
      id: 4,
      usuario: 'Admin Usuario',
      accion: 'Exportó reporte de ocupación',
      timestamp: '2025-10-17 11:30',
      ip: '192.168.1.100',
    },
  ];

  const permisos = [
    { modulo: 'Dashboard', ver: true, crear: true, editar: true, eliminar: true },
    { modulo: 'Reservas', ver: true, crear: true, editar: true, eliminar: true },
    { modulo: 'Huéspedes', ver: true, crear: true, editar: true, eliminar: false },
    { modulo: 'Stock', ver: true, crear: true, editar: true, eliminar: false },
    { modulo: 'Mantenimiento', ver: true, crear: true, editar: true, eliminar: false },
    { modulo: 'Panel Admin', ver: true, crear: false, editar: false, eliminar: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Panel Administrativo</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión de usuarios, roles y permisos
          </p>
        </div>
        <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
          <Users className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Usuarios Activos
            </CardTitle>
            <Users className="w-5 h-5 text-[var(--color-primary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">8</div>
            <p className="text-xs text-gray-500 mt-1">Total de usuarios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Sesiones Activas
            </CardTitle>
            <Activity className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">4</div>
            <p className="text-xs text-gray-500 mt-1">Usuarios conectados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Roles Definidos
            </CardTitle>
            <Shield className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">5</div>
            <p className="text-xs text-gray-500 mt-1">Perfiles de acceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Seguridad
            </CardTitle>
            <Lock className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">100%</div>
            <p className="text-xs text-gray-500 mt-1">Sistema seguro</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{usuario.rol}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 text-white">
                          {usuario.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{usuario.ultimoAcceso}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            Permisos
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm">Administrador</h4>
                      <Badge>Acceso Total</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Control completo del sistema, gestión de usuarios y
                      configuraciones
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm">Recepción</h4>
                      <Badge variant="secondary">Limitado</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Gestión de reservas, check-in/out, huéspedes
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm">Mantenimiento</h4>
                      <Badge variant="secondary">Limitado</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Gestión de tickets de mantenimiento y stock
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm">Limpieza</h4>
                      <Badge variant="secondary">Limitado</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Acceso a tareas de limpieza y servicios
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matriz de Permisos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Módulo</TableHead>
                      <TableHead className="text-center">Ver</TableHead>
                      <TableHead className="text-center">Crear</TableHead>
                      <TableHead className="text-center">Editar</TableHead>
                      <TableHead className="text-center">Eliminar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permisos.map((permiso, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-sm">
                          {permiso.modulo}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch checked={permiso.ver} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch checked={permiso.crear} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch checked={permiso.editar} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch checked={permiso.eliminar} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actividad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actividadReciente.map((actividad) => (
                    <TableRow key={actividad.id}>
                      <TableCell>{actividad.usuario}</TableCell>
                      <TableCell>{actividad.accion}</TableCell>
                      <TableCell>{actividad.timestamp}</TableCell>
                      <TableCell>{actividad.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticación de dos factores</Label>
                    <p className="text-xs text-gray-500">
                      Requiere código adicional al iniciar sesión
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Expiración de sesiones</Label>
                    <p className="text-xs text-gray-500">
                      Cerrar sesión automáticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Registro de actividad</Label>
                    <p className="text-xs text-gray-500">
                      Guardar historial de acciones
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificar inicios de sesión</Label>
                    <p className="text-xs text-gray-500">
                      Alertas por email
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Política de Contraseñas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Longitud mínima</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 caracteres</SelectItem>
                      <SelectItem value="8">8 caracteres</SelectItem>
                      <SelectItem value="10">10 caracteres</SelectItem>
                      <SelectItem value="12">12 caracteres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Expiración de contraseña</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Requerir mayúsculas</Label>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Requerir números</Label>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Requerir caracteres especiales</Label>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
