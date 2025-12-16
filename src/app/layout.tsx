
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { HandoffProvider } from '@/contexts/HandoffContext';
import { DailyPassProvider } from '@/contexts/DailyPassContext';
import { SWRegister } from '@/components/SWRegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Complejo Turístico',
  description: 'Sistema de Gestión',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={inter.className}>
        <SWRegister />
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
