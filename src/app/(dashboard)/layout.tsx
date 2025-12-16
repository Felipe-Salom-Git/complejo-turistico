import { ReservationsProvider } from '@/contexts/ReservationsContext';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import { StaffProvider } from '@/contexts/StaffContext';
import { QuotationsProvider } from '@/contexts/QuotationsContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { GuestsProvider } from '@/contexts/GuestsContext';
import { StockProvider } from '@/contexts/StockContext';

import { AppShell } from '@/components/AppShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReservationsProvider>
      <MaintenanceProvider>
          <StaffProvider>
            <QuotationsProvider>
              <GuestsProvider>
                <MessagesProvider>
                  <StockProvider>
                    <AppShell>{children}</AppShell>
                  </StockProvider>
                </MessagesProvider>
              </GuestsProvider>
            </QuotationsProvider>
          </StaffProvider>
      </MaintenanceProvider>
    </ReservationsProvider>
  );
}
