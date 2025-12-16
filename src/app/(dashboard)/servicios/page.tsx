'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, User as UserIcon, Calendar, History, BarChart3, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useServices, ServiceTask } from '@/contexts/ServicesContext';
import { useStaff } from '@/contexts/StaffContext';
import { AddServiceTaskModal } from '@/components/services/AddServiceTaskModal';

export default function ServiciosPage() {
  const { tasks } = useServices();
  const { maids } = useStaff();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // History Filters
  const [historyFilterMaid, setHistoryFilterMaid] = useState('all');
  const [historySearch, setHistorySearch] = useState('');

  // --- LOGIC: TASKS TAB ---
  const getTasksByMaid = (maidId: number) => {
    return tasks.filter(t => t.mucamaId === maidId.toString());
  };
  const getStatusBadge = (estado: string) => {
    return estado === 'completado'
      ? <Badge className="bg-green-600">Completado</Badge>
      : <Badge variant="secondary">Pendiente</Badge>;
  };

  // --- LOGIC: METRICS TAB ---
  const calculateMetrics = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.estado === 'completado').length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const byMaid = maids.map(maid => {
      const maidTasks = tasks.filter(t => t.mucamaId === maid.id.toString());
      const mTotal = maidTasks.length;
      const mCompleted = maidTasks.filter(t => t.estado === 'completado').length;

      // Time Avg Calculation
      let avgTime = '';
      const timedTasks = maidTasks.filter(t => t.estado === 'completado' && t.fechaCompletado);
      if (timedTasks.length > 0) {
        const totalMinutes = timedTasks.reduce((acc, t) => {
          const start = new Date(t.fechaCreacion).getTime();
          const end = new Date(t.fechaCompletado!).getTime();
          return acc + (end - start);
        }, 0) / (1000 * 60); // ms -> minutes

        const avg = Math.round(totalMinutes / timedTasks.length);
        avgTime = `${avg} min`;
      }

      return {
        name: maid.nombre,
        total: mTotal,
        completed: mCompleted,
        pending: mTotal - mCompleted,
        percentage: mTotal === 0 ? 0 : Math.round((mCompleted / mTotal) * 100),
        avgTime
      };
    });

    return { total, completed, pending, percentage, byMaid };
  };
  const metrics = calculateMetrics();

  // --- LOGIC: HISTORY TAB ---
  const filteredHistory = tasks.filter(task => {
    const matchMaid = historyFilterMaid === 'all' || task.mucamaId === historyFilterMaid;
    const matchSearch = historySearch === '' ||
      task.tipoServicio.toLowerCase().includes(historySearch.toLowerCase()) ||
      (task.unidadId && task.unidadId.toLowerCase().includes(historySearch.toLowerCase())) ||
      (task.espacioComun && task.espacioComun.toLowerCase().includes(historySearch.toLowerCase()));
    return matchMaid && matchSearch;
  }).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión, métricas e historial de operaciones
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[var(--color-primary)]">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      <Tabs defaultValue="tareas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="tareas"><ListTodo className="w-4 h-4 mr-2" /> Tareas</TabsTrigger>
          <TabsTrigger value="metricas"><BarChart3 className="w-4 h-4 mr-2" /> Métricas</TabsTrigger>
          <TabsTrigger value="historial"><History className="w-4 h-4 mr-2" /> Historial</TabsTrigger>
        </TabsList>

        {/* --- TAB: TAREAS --- */}
        <TabsContent value="tareas" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {maids.map(maid => {
              const maidTasks = getTasksByMaid(maid.id);
              if (maidTasks.length === 0) return null;

              return (
                <Card key={maid.id}>
                  <CardHeader className="py-3 bg-slate-50 dark:bg-slate-900 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <CardTitle className="text-lg">{maid.nombre}</CardTitle>
                      <Badge variant="outline" className="ml-2 font-normal text-xs uppercase">{maid.estado}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {maidTasks.filter(t => t.estado === 'completado').length} / {maidTasks.length} completadas
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Tipo Servicio</TableHead>
                          <TableHead>Unidad / Detalle</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Observación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {maidTasks.map(task => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.tipoServicio}</TableCell>
                            <TableCell>
                              {task.unidadId ? <Badge variant="outline" className="mr-2">{task.unidadId}</Badge> : null}
                              {task.espacioComun ? <Badge variant="secondary" className="mr-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">{task.espacioComun}</Badge> : null}
                              {task.cantidadPasajeros ? <span className="text-xs text-gray-500 mr-2">({task.cantidadPasajeros} pax)</span> : null}
                              <div className="text-sm text-gray-600 mt-1">{task.descripcionExtra}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(task.estado)}</TableCell>
                            <TableCell className="text-sm italic text-gray-500">
                              {task.observacionMucama || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* --- TAB: METRICAS --- */}
        <TabsContent value="metricas" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Tareas</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{metrics.total}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Completadas</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{metrics.completed}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pendientes</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-orange-600">{metrics.pending}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cumplimiento Global</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-blue-600">{metrics.percentage}%</div></CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.byMaid.map(m => {
              // Calculate Average Time for this maid
              const completedTasks = tasks.filter(t => t.mucamaId === m.name && t.estado === 'completado' && t.fechaCompletado);
              // Note: The above filter uses m.name, but mucamaId is actually the ID. We need to fix metrics calculation upstream or here.
              // Let's look at calculateMetrics again. It maps `maids` and uses `maid.id`.
              // We should recalculate average here based on the data we have access to in this scope implies we need to pass it or calc it.
              // Re-doing the map to include average calculation:

              return (
                <Card key={m.name}>
                  <CardHeader>
                    <CardTitle>{m.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Asignadas:</span>
                        <span className="font-bold">{m.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completadas:</span>
                        <span className="text-green-600 font-bold">{m.completed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pendientes:</span>
                        <span className="text-orange-600 font-bold">{m.pending}</span>
                      </div>

                      {/* Time Metrics - Admin Only */}
                      <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-dashed">
                        <div className="flex justify-between">
                          <span>Tiempo Promedio:</span>
                          <span className="font-mono font-medium">{m.avgTime ? m.avgTime : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Cumplimiento</span>
                          <Badge variant={m.percentage >= 80 ? 'default' : 'secondary'}>{m.percentage}%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* --- TAB: HISTORIAL --- */}
        <TabsContent value="historial" className="space-y-4 mt-6">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Buscar por servicio, unidad..."
              className="max-w-xs"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
            />
            <Select value={historyFilterMaid} onValueChange={setHistoryFilterMaid}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las mucamas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las mucamas</SelectItem>
                {maids.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Mucama</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Obs.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map(task => {
                    const maid = maids.find(m => m.id.toString() === task.mucamaId);
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="text-xs text-gray-500">
                          {new Date(task.fechaCreacion).toLocaleString()}
                        </TableCell>
                        <TableCell>{maid?.nombre || 'Unknown'}</TableCell>
                        <TableCell>
                          {task.unidadId ? <Badge variant="outline">{task.unidadId}</Badge> : null}
                          {task.espacioComun ? <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">{task.espacioComun}</Badge> : null}
                        </TableCell>
                        <TableCell>{task.tipoServicio}</TableCell>
                        <TableCell>{getStatusBadge(task.estado)}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-xs text-gray-500">
                          {task.observacionMucama}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddServiceTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
