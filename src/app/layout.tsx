// 📍 src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema Complejo Turístico',
  description: 'Sistema de gestión para complejos turísticos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Este layout aplica a TODA la aplicación */}
        {children}
      </body>
    </html>
  );
}