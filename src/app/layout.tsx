import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppShell } from ' @/components/AppShell';

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
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
