'use client';

import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ThemeColors } from '../../app/providers/ThemeProvider';

interface EditorPaletaProps {
  themeColors: ThemeColors;
  setThemeColors: (colors: ThemeColors) => void;
}

export function EditorPaleta({
  themeColors,
  setThemeColors,
}: EditorPaletaProps) {
  const defaultColors: ThemeColors = {
    primary: '#2A7B79',
    secondary: '#F5B841',
    background: '#F9FAFB',
    backgroundDark: '#111827',
  };

  const handleReset = () => {
    setThemeColors(defaultColors);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Editor de Paleta de Colores</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Personaliza los colores del sistema
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar Predeterminados
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Configuración de Colores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Color Primario</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  type="color"
                  value={themeColors.primary}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      primary: e.target.value,
                    })
                  }
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={themeColors.primary}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      primary: e.target.value,
                    })
                  }
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usado en botones principales, sidebar activo, enlaces
              </p>
            </div>

            <div>
              <Label>Color Secundario</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  type="color"
                  value={themeColors.secondary}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      secondary: e.target.value,
                    })
                  }
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={themeColors.secondary}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      secondary: e.target.value,
                    })
                  }
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usado en elementos de acento, badges, gráficos
              </p>
            </div>

            <div>
              <Label>Color de Fondo Claro</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  type="color"
                  value={themeColors.background}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      background: e.target.value,
                    })
                  }
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={themeColors.background}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      background: e.target.value,
                    })
                  }
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Fondo principal en modo claro
              </p>
            </div>

            <div>
              <Label>Color de Fondo Oscuro</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  type="color"
                  value={themeColors.backgroundDark}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      backgroundDark: e.target.value,
                    })
                  }
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={themeColors.backgroundDark}
                  onChange={(e) =>
                    setThemeColors({
                      ...themeColors,
                      backgroundDark: e.target.value,
                    })
                  }
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Fondo principal en modo oscuro
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Botones</Label>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Botón Primario
                </Button>
                <Button
                  className="w-full"
                  style={{ backgroundColor: themeColors.secondary }}
                >
                  Botón Secundario
                </Button>
                <Button variant="outline" className="w-full">
                  Botón Outline
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Badges y Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Primario
                </span>
                <span
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: themeColors.secondary }}
                >
                  Secundario
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                  Éxito
                </span>
                <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                  Error
                </span>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Tarjeta de Ejemplo</Label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${themeColors.primary}20`,
                      color: themeColors.primary,
                    }}
                  >
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm">Título de Tarjeta</h3>
                    <p className="text-xs text-gray-500">
                      Descripción de ejemplo
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Esta es una tarjeta de ejemplo para visualizar cómo se verán
                  los colores seleccionados en el diseño.
                </p>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Elementos Interactivos</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <span className="text-sm">Elemento de lista</span>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: themeColors.primary }}
                  ></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <span className="text-sm">Elemento de lista</span>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: themeColors.secondary }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paletas Predefinidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                setThemeColors({
                  primary: '#2A7B79',
                  secondary: '#F5B841',
                  background: '#F9FAFB',
                  backgroundDark: '#111827',
                })
              }
            >
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded bg-[#2A7B79]"></div>
                <div className="w-10 h-10 rounded bg-[#F5B841]"></div>
              </div>
              <p className="text-xs">Predeterminado</p>
            </div>

            <div
              className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                setThemeColors({
                  primary: '#3B82F6',
                  secondary: '#10B981',
                  background: '#F9FAFB',
                  backgroundDark: '#111827',
                })
              }
            >
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded bg-[#3B82F6]"></div>
                <div className="w-10 h-10 rounded bg-[#10B981]"></div>
              </div>
              <p className="text-xs">Océano</p>
            </div>

            <div
              className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                setThemeColors({
                  primary: '#8B5CF6',
                  secondary: '#EC4899',
                  background: '#F9FAFB',
                  backgroundDark: '#111827',
                })
              }
            >
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded bg-[#8B5CF6]"></div>
                <div className="w-10 h-10 rounded bg-[#EC4899]"></div>
              </div>
              <p className="text-xs">Violeta</p>
            </div>

            <div
              className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                setThemeColors({
                  primary: '#EF4444',
                  secondary: '#F59E0B',
                  background: '#F9FAFB',
                  backgroundDark: '#111827',
                })
              }
            >
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded bg-[#EF4444]"></div>
                <div className="w-10 h-10 rounded bg-[#F59E0B]"></div>
              </div>
              <p className="text-xs">Cálido</p>
            </div>

            <div
              className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                setThemeColors({
                  primary: '#1F2937',
                  secondary: '#6B7280',
                  background: '#F9FAFB',
                  backgroundDark: '#111827',
                })
              }
            >
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded bg-[#1F2937]"></div>
                <div className="w-10 h-10 rounded bg-[#6B7280]"></div>
              </div>
              <p className="text-xs">Monocromático</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
