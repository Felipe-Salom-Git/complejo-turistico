import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { HandoffProvider } from '@/contexts/HandoffContext';
import { DailyPassProvider } from '@/contexts/DailyPassContext';

export const metadata: Metadata = {
  title: 'Las Gaviotas & Fontana - Sistema de Gestión',
  description: 'Sistema de gestión del complejo turístico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <HandoffProvider>
              <DailyPassProvider>
                {children}
              </DailyPassProvider>
            </HandoffProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
