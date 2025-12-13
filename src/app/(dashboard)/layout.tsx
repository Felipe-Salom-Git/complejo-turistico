import { ReservationsProvider } from '@/contexts/ReservationsContext';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import { DailyPassProvider } from '@/contexts/DailyPassContext';
import { StaffProvider } from '@/contexts/StaffContext';
import { QuotationsProvider } from '@/contexts/QuotationsContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { GuestsProvider } from '@/contexts/GuestsContext';

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
              <GuestsProvider>
                <MessagesProvider>
                  {children}
                </MessagesProvider>
              </GuestsProvider>
            </QuotationsProvider>
          </StaffProvider>
        </DailyPassProvider>
      </MaintenanceProvider>
    </ReservationsProvider>
  );
}
