import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "./ui/button";

interface ReservationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  unitTypeFilter: string;
  onUnitTypeFilterChange: (value: string) => void;
  platformFilter: string;
  onPlatformFilterChange: (value: string) => void;
}

export function ReservationFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  unitTypeFilter,
  onUnitTypeFilterChange,
  platformFilter,
  onPlatformFilterChange,
}: ReservationFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por huésped, responsable, observación..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Confirmada">Confirmada</SelectItem>
              <SelectItem value="Cancelación">Cancelación</SelectItem>
              <SelectItem value="Reembolso">Reembolso</SelectItem>
              <SelectItem value="No show">No show</SelectItem>
            </SelectContent>
          </Select>

          <Select value={unitTypeFilter} onValueChange={onUnitTypeFilterChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Tipo de unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las unidades</SelectItem>
              <SelectItem value="A">Tipo A</SelectItem>
              <SelectItem value="B">Tipo B</SelectItem>
              <SelectItem value="C">Tipo C</SelectItem>
              <SelectItem value="C+">Tipo C+</SelectItem>
              <SelectItem value="D">Tipo D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={onPlatformFilterChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las plataformas</SelectItem>
              <SelectItem value="Booking">Booking</SelectItem>
              <SelectItem value="Airbnb">Airbnb</SelectItem>
              <SelectItem value="Directa">Directa</SelectItem>
              <SelectItem value="Despegar">Despegar</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="bg-white">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
