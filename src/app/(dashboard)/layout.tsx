import { ReservationsProvider } from '@/contexts/ReservationsContext';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import { DailyPassProvider } from '@/contexts/DailyPassContext';
import { StaffProvider } from '@/contexts/StaffContext';
import { QuotationsProvider } from '@/contexts/QuotationsContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { GuestsProvider } from '@/contexts/GuestsContext';
import { StockProvider } from '@/contexts/StockContext';

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
                  <StockProvider>
                    {children}
                  </StockProvider>
                </MessagesProvider>
              </GuestsProvider>
            </QuotationsProvider>
          </StaffProvider>
        </DailyPassProvider>
      </MaintenanceProvider>
    </ReservationsProvider>
  );
}
