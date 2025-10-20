'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function Calendario() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // Mock data for reservations
  const reservations = {
    '2025-10-17': [
      { unidad: 'Cabaña 8', huesped: 'García, M.', tipo: 'checkin' },
      { unidad: 'Suite 12', huesped: 'Rodríguez, J.', tipo: 'checkout' },
    ],
    '2025-10-18': [
      { unidad: 'Cabaña 3', huesped: 'López, A.', tipo: 'checkin' },
    ],
    '2025-10-20': [
      { unidad: 'Suite 7', huesped: 'Martínez, C.', tipo: 'checkout' },
      { unidad: 'Cabaña 15', huesped: 'Pérez, L.', tipo: 'checkin' },
    ],
    '2025-10-22': [
      { unidad: 'Suite 5', huesped: 'González, R.', tipo: 'checkin' },
    ],
    '2025-10-25': [
      { unidad: 'Cabaña 8', huesped: 'García, M.', tipo: 'checkout' },
    ],
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getReservationsForDay = (day: number) => {
    const dateKey = formatDate(day);
    return reservations[dateKey] || [];
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Calendario</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Vista de reservas y disponibilidad
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(new Date())}
              >
                Hoy
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-sm text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayReservations = getReservationsForDay(day);
              const hasReservations = dayReservations.length > 0;

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday(day)
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } ${
                    hasReservations
                      ? 'hover:shadow-lg cursor-pointer transition-shadow'
                      : ''
                  }`}
                >
                  <div
                    className={`text-sm ${
                      isToday(day) ? 'font-bold' : ''
                    }`}
                  >
                    {day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayReservations.slice(0, 2).map((res, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          res.tipo === 'checkin'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        } ${isToday(day) ? 'opacity-80' : ''}`}
                      >
                        {res.tipo === 'checkin' ? '→' : '←'} {res.unidad}
                      </div>
                    ))}
                    {dayReservations.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayReservations.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(reservations)
                .flatMap(([date, resList]) =>
                  resList
                    .filter((res) => res.tipo === 'checkin')
                    .map((res) => ({ ...res, date }))
                )
                .slice(0, 5)
                .map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg"
                  >
                    <div>
                      <p className="text-sm">{res.huesped}</p>
                      <p className="text-xs text-gray-500">{res.unidad}</p>
                    </div>
                    <Badge variant="outline">{res.date}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Check-outs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(reservations)
                .flatMap(([date, resList]) =>
                  resList
                    .filter((res) => res.tipo === 'checkout')
                    .map((res) => ({ ...res, date }))
                )
                .slice(0, 5)
                .map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg"
                  >
                    <div>
                      <p className="text-sm">{res.huesped}</p>
                      <p className="text-xs text-gray-500">{res.unidad}</p>
                    </div>
                    <Badge variant="outline">{res.date}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
