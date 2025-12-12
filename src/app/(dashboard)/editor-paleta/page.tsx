'use client';

import React, { useState } from 'react';
import { Palette, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExtendedThemeColors {
  // Colores principales
  primary: string;
  secondary: string;
  accent: string;
  
  // Fondos
  background: string;
  backgroundDark: string;
  cardBg: string;
  cardBgDark: string;
  navbarBg: string;
  navbarBgDark: string;
  sidebarBg: string;
  sidebarBgDark: string;
  
  // Textos
  textPrimary: string;
  textSecondary: string;
  textPrimaryDark: string;
  textSecondaryDark: string;
  
  // Bordes
  border: string;
  borderDark: string;
  
  // Estados
  success: string;
  warning: string;
  error: string;
  info: string;
}

export default function EditorPaleta() {
  const defaultColors: ExtendedThemeColors = {
    primary: '#2A7B79',
    secondary: '#F5B841',
    accent: '#3B82F6',
    background: '#F9FAFB',
    backgroundDark: '#111827',
    cardBg: '#FFFFFF',
    cardBgDark: '#1F2937',
    navbarBg: '#FFFFFF',
    navbarBgDark: '#1F2937',
    sidebarBg: '#FFFFFF',
    sidebarBgDark: '#1F2937',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textPrimaryDark: '#F9FAFB',
    textSecondaryDark: '#9CA3AF',
    border: '#E5E7EB',
    borderDark: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  };

  const colorPresets = [
    {
      name: 'Océano',
      colors: { ...defaultColors, primary: '#0EA5E9', secondary: '#06B6D4', accent: '#8B5CF6' }
    },
    {
      name: 'Bosque',
      colors: { ...defaultColors, primary: '#059669', secondary: '#84CC16', accent: '#10B981' }
    },
    {
      name: 'Atardecer',
      colors: { ...defaultColors, primary: '#F97316', secondary: '#FBBF24', accent: '#EF4444' }
    },
    {
      name: 'Lavanda',
      colors: { ...defaultColors, primary: '#8B5CF6', secondary: '#A78BFA', accent: '#EC4899' }
    },
    {
      name: 'Corporativo',
      colors: { ...defaultColors, primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' }
    },
  ];

  const [themeColors, setThemeColors] = useState<ExtendedThemeColors>(defaultColors);

  const applyColors = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    // Colores principales
    root.style.setProperty('--color-primary', themeColors.primary);
    root.style.setProperty('--color-secondary', themeColors.secondary);
    root.style.setProperty('--color-accent', themeColors.accent);
    root.style.setProperty('--primary', themeColors.primary);
    root.style.setProperty('--secondary', themeColors.secondary);
    root.style.setProperty('--accent', themeColors.accent);
    
    // Fondos
    const bgColor = isDark ? themeColors.backgroundDark : themeColors.background;
    const cardBg = isDark ? themeColors.cardBgDark : themeColors.cardBg;
    const navbarBg = isDark ? themeColors.navbarBgDark : themeColors.navbarBg;
    const sidebarBg = isDark ? themeColors.sidebarBgDark : themeColors.sidebarBg;
    
    root.style.setProperty('--background', bgColor);
    root.style.setProperty('--card', cardBg);
    root.style.setProperty('--navbar-bg', navbarBg);
    root.style.setProperty('--sidebar-bg', sidebarBg);
    
    // Textos
    const textPrimary = isDark ? themeColors.textPrimaryDark : themeColors.textPrimary;
    const textSecondary = isDark ? themeColors.textSecondaryDark : themeColors.textSecondary;
    root.style.setProperty('--foreground', textPrimary);
    root.style.setProperty('--muted-foreground', textSecondary);
    
    // Bordes
    const borderColor = isDark ? themeColors.borderDark : themeColors.border;
    root.style.setProperty('--border', borderColor);
    
    // Estados
    root.style.setProperty('--success', themeColors.success);
    root.style.setProperty('--warning', themeColors.warning);
    root.style.setProperty('--error', themeColors.error);
    root.style.setProperty('--destructive', themeColors.error);
    root.style.setProperty('--info', themeColors.info);
  };

  const handleReset = () => {
    setThemeColors(defaultColors);
    applyColorsWithValues(defaultColors);
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setThemeColors(preset.colors);
    applyColorsWithValues(preset.colors);
  };

  const applyColorsWithValues = (colors: ExtendedThemeColors) => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    
    const bgColor = isDark ? colors.backgroundDark : colors.background;
    const cardBg = isDark ? colors.cardBgDark : colors.cardBg;
    const navbarBg = isDark ? colors.navbarBgDark : colors.navbarBg;
    const sidebarBg = isDark ? colors.sidebarBgDark : colors.sidebarBg;
    
    root.style.setProperty('--background', bgColor);
    root.style.setProperty('--card', cardBg);
    root.style.setProperty('--navbar-bg', navbarBg);
    root.style.setProperty('--sidebar-bg', sidebarBg);
    
    const textPrimary = isDark ? colors.textPrimaryDark : colors.textPrimary;
    const textSecondary = isDark ? colors.textSecondaryDark : colors.textSecondary;
    root.style.setProperty('--foreground', textPrimary);
    root.style.setProperty('--muted-foreground', textSecondary);
    
    const borderColor = isDark ? colors.borderDark : colors.border;
    root.style.setProperty('--border', borderColor);
    
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);
    root.style.setProperty('--destructive', colors.error);
    root.style.setProperty('--info', colors.info);
  };

  const ColorInput = ({ label, value, onChange, description }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description: string;
  }) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-3 mt-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 h-12 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editor de Paleta de Colores</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Personaliza completamente los colores del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
            onClick={applyColors}
          >
            <Palette className="w-4 h-4 mr-2" />
            Aplicar Cambios
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar
          </Button>
        </div>
      </div>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Paletas Predefinidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[var(--color-primary)] transition-colors group"
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.colors.primary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.colors.secondary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.colors.accent }} />
                </div>
                <p className="text-sm font-medium group-hover:text-[var(--color-primary)]">{preset.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de colores */}
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">Principales</TabsTrigger>
          <TabsTrigger value="backgrounds">Fondos</TabsTrigger>
          <TabsTrigger value="text">Textos</TabsTrigger>
          <TabsTrigger value="states">Estados</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Colores Principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ColorInput
                label="Color Primario"
                value={themeColors.primary}
                onChange={(v) => setThemeColors({ ...themeColors, primary: v })}
                description="Botones principales, enlaces, elementos activos"
              />
              <ColorInput
                label="Color Secundario"
                value={themeColors.secondary}
                onChange={(v) => setThemeColors({ ...themeColors, secondary: v })}
                description="Badges, elementos de acento secundarios"
              />
              <ColorInput
                label="Color de Acento"
                value={themeColors.accent}
                onChange={(v) => setThemeColors({ ...themeColors, accent: v })}
                description="Elementos destacados, notificaciones"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backgrounds" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Modo Claro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ColorInput
                  label="Fondo Principal"
                  value={themeColors.background}
                  onChange={(v) => setThemeColors({ ...themeColors, background: v })}
                  description="Fondo general de la aplicación"
                />
                <ColorInput
                  label="Fondo Navbar"
                  value={themeColors.navbarBg}
                  onChange={(v) => setThemeColors({ ...themeColors, navbarBg: v })}
                  description="Fondo de la barra superior"
                />
                <ColorInput
                  label="Fondo Sidebar"
                  value={themeColors.sidebarBg}
                  onChange={(v) => setThemeColors({ ...themeColors, sidebarBg: v })}
                  description="Fondo de la barra lateral"
                />
                <ColorInput
                  label="Fondo de Tarjetas"
                  value={themeColors.cardBg}
                  onChange={(v) => setThemeColors({ ...themeColors, cardBg: v })}
                  description="Fondo de cards y paneles"
                />
                <ColorInput
                  label="Color de Bordes"
                  value={themeColors.border}
                  onChange={(v) => setThemeColors({ ...themeColors, border: v })}
                  description="Bordes y separadores"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modo Oscuro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ColorInput
                  label="Fondo Principal"
                  value={themeColors.backgroundDark}
                  onChange={(v) => setThemeColors({ ...themeColors, backgroundDark: v })}
                  description="Fondo general de la aplicación"
                />
                <ColorInput
                  label="Fondo Navbar"
                  value={themeColors.navbarBgDark}
                  onChange={(v) => setThemeColors({ ...themeColors, navbarBgDark: v })}
                  description="Fondo de la barra superior"
                />
                <ColorInput
                  label="Fondo Sidebar"
                  value={themeColors.sidebarBgDark}
                  onChange={(v) => setThemeColors({ ...themeColors, sidebarBgDark: v })}
                  description="Fondo de la barra lateral"
                />
                <ColorInput
                  label="Fondo de Tarjetas"
                  value={themeColors.cardBgDark}
                  onChange={(v) => setThemeColors({ ...themeColors, cardBgDark: v })}
                  description="Fondo de cards y paneles"
                />
                <ColorInput
                  label="Color de Bordes"
                  value={themeColors.borderDark}
                  onChange={(v) => setThemeColors({ ...themeColors, borderDark: v })}
                  description="Bordes y separadores"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Modo Claro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ColorInput
                  label="Texto Principal"
                  value={themeColors.textPrimary}
                  onChange={(v) => setThemeColors({ ...themeColors, textPrimary: v })}
                  description="Títulos, textos principales"
                />
                <ColorInput
                  label="Texto Secundario"
                  value={themeColors.textSecondary}
                  onChange={(v) => setThemeColors({ ...themeColors, textSecondary: v })}
                  description="Descripciones, textos auxiliares"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modo Oscuro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ColorInput
                  label="Texto Principal"
                  value={themeColors.textPrimaryDark}
                  onChange={(v) => setThemeColors({ ...themeColors, textPrimaryDark: v })}
                  description="Títulos, textos principales"
                />
                <ColorInput
                  label="Texto Secundario"
                  value={themeColors.textSecondaryDark}
                  onChange={(v) => setThemeColors({ ...themeColors, textSecondaryDark: v })}
                  description="Descripciones, textos auxiliares"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Colores de Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ColorInput
                label="Éxito"
                value={themeColors.success}
                onChange={(v) => setThemeColors({ ...themeColors, success: v })}
                description="Mensajes de éxito, confirmaciones"
              />
              <ColorInput
                label="Advertencia"
                value={themeColors.warning}
                onChange={(v) => setThemeColors({ ...themeColors, warning: v })}
                description="Alertas, avisos importantes"
              />
              <ColorInput
                label="Error"
                value={themeColors.error}
                onChange={(v) => setThemeColors({ ...themeColors, error: v })}
                description="Errores, acciones destructivas"
              />
              <ColorInput
                label="Información"
                value={themeColors.info}
                onChange={(v) => setThemeColors({ ...themeColors, info: v })}
                description="Mensajes informativos, ayuda"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vista previa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Vista Previa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button style={{ backgroundColor: themeColors.primary, color: 'white' }}>
                Botón Primario
              </Button>
              <Button style={{ backgroundColor: themeColors.secondary, color: 'white' }}>
                Botón Secundario
              </Button>
              <Button style={{ backgroundColor: themeColors.accent, color: 'white' }}>
                Botón Acento
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-1 rounded" style={{ backgroundColor: themeColors.success, color: 'white' }}>
                Éxito
              </div>
              <div className="px-3 py-1 rounded" style={{ backgroundColor: themeColors.warning, color: 'white' }}>
                Advertencia
              </div>
              <div className="px-3 py-1 rounded" style={{ backgroundColor: themeColors.error, color: 'white' }}>
                Error
              </div>
              <div className="px-3 py-1 rounded" style={{ backgroundColor: themeColors.info, color: 'white' }}>
                Info
              </div>
            </div>
            <div className="p-4 rounded-lg border-2" style={{ 
              backgroundColor: themeColors.cardBg, 
              borderColor: themeColors.border,
              color: themeColors.textPrimary 
            }}>
              <h3 className="font-bold mb-2">Tarjeta de Ejemplo</h3>
              <p style={{ color: themeColors.textSecondary }}>
                Este es un texto secundario en una tarjeta de ejemplo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
