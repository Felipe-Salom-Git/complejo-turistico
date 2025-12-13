import { ReservationsProvider } from '@/contexts/ReservationsContext';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import { DailyPassProvider } from '@/contexts/DailyPassContext';
import { StaffProvider } from '@/contexts/StaffContext';
import { MessagesProvider } from '@/contexts/MessagesContext';

import { QuotationsProvider } from '@/contexts/QuotationsContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReservationsProvider>
      <MaintenanceProvider>
        <DailyPassProvider>
          <StaffProvider>
            <QuotationsProvider>
              <MessagesProvider>
                {children}
              </MessagesProvider>
            </QuotationsProvider>
          </StaffProvider>
        </DailyPassProvider>
      </MaintenanceProvider>
    </ReservationsProvider>
  );
}
