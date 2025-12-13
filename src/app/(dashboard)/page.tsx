import { CheckInWidget } from '@/components/dashboard/CheckInWidget';
import { CheckOutWidget } from '@/components/dashboard/CheckOutWidget';
import { MaintenanceWidget } from '@/components/dashboard/MaintenanceWidget';
import { DailyPassWidget } from '@/components/dashboard/DailyPassWidget';
import { StaffCleaningWidget } from '@/components/dashboard/StaffCleaningWidget';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Operaciones</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Resumen diario de actividades
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CheckInWidget />
        <CheckOutWidget />
        <MaintenanceWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DailyPassWidget />
        <StaffCleaningWidget />
      </div>
    </div>
  );
}
