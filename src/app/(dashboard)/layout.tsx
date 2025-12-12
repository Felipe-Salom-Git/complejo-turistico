import { ReservationsProvider } from '@/contexts/ReservationsContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReservationsProvider>
      {children}
    </ReservationsProvider>
  );
}
