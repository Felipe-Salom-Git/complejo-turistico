// 📍 src/app/(dashboard)/reservas/layout.tsx
export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Podríamos agregar aquí elementos específicos de reservas */}
      {children}
    </div>
  );
}