import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, X, MessageCircle, Eye, Car, Dog, Filter } from 'lucide-react';
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Reserva } from " @/types/reserva";


interface ReservationTableProps {
  reservations: Reserva[];
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onSendMessage: (id: string) => void;
}

export function ReservationTable({ reservations, onEdit, onCancel, onSendMessage }: ReservationTableProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reserva | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Cancelación":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Reembolso":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "No show":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
  };

  const getUnitTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "A": "bg-purple-100 text-purple-800 hover:bg-purple-100",
      "B": "bg-blue-100 text-blue-800 hover:bg-blue-100",
      "C": "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
      "C+": "bg-teal-100 text-teal-800 hover:bg-teal-100",
      "D": "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    };
    return colors[type] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  return (
    <>
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="whitespace-nowrap">Fecha Carga</TableHead>
                <TableHead className="whitespace-nowrap">Huésped</TableHead>
                <TableHead className="whitespace-nowrap">Responsable</TableHead>
                <TableHead className="whitespace-nowrap">Check-in</TableHead>
                <TableHead className="whitespace-nowrap">Check-out</TableHead>
                <TableHead className="whitespace-nowrap">Estado</TableHead>
                <TableHead className="whitespace-nowrap">Unidad</TableHead>
                <TableHead className="whitespace-nowrap">Plataforma</TableHead>
                <TableHead className="text-center">Pax</TableHead>
                <TableHead className="text-center">Noches</TableHead>
                <TableHead className="whitespace-nowrap">Valor Total</TableHead>
                <TableHead className="whitespace-nowrap">Forma Pago</TableHead>
                <TableHead className="text-right">Pagado</TableHead>
                <TableHead className="text-right">Adeudado</TableHead>
                <TableHead className="whitespace-nowrap">Resp. Check-in</TableHead>
                <TableHead className="whitespace-nowrap">Observación</TableHead>
                <TableHead className="text-center">Info</TableHead>
                <TableHead className="text-right sticky right-0 bg-gray-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id} className="hover:bg-gray-50">
                  <TableCell className="whitespace-nowrap">{reservation.fechaCreacion.toLocaleDateString()}</TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.huespedNombre}</TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.responsable}</TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.fechaEntrada.toLocaleDateString()}</TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.fechaSalida.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reservation.estado)}>
                      {reservation.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUnitTypeColor(reservation.unidad)}>
                      {reservation.unidad}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.plataforma}</TableCell>
                  <TableCell className="text-center">{reservation.pax}</TableCell>
                  <TableCell className="text-center">{reservation.cantidadNoches}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>${reservation.montos.usd.total.toLocaleString()} USD</span>
                      <span className="text-muted-foreground text-sm">
                        ${reservation.montos.ars.total.toLocaleString()} ARS
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.pagos[0].formaPago}</TableCell>
                  <TableCell className="text-right text-green-700">
                    ${reservation.pagos[0].monto.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-700">
                    ${reservation.montos.ars.saldo.toLocaleString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{reservation.checkInPor}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={reservation.observaciones}>
                    {reservation.observaciones}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      {reservation.mascota && (
                        <div className="text-amber-600" title="Con mascota">
                          <Dog className="h-4 w-4" />
                        </div>
                      )}
                      {
                        <div className="text-blue-600" title={"Por ver"}>
                          <Car className="h-4 w-4" />
                        </div>
                      }
                    </div>
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReservation(reservation)}
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(reservation.id)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSendMessage(reservation.id)}
                        title="Enviar mensaje"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onCancel(reservation.id)}
                        title="Cancelar"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Reserva</DialogTitle>
            <DialogDescription>Información completa de la reserva seleccionada</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Huésped</p>
                <p>{selectedReservation.huespedNombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Responsable</p>
                <p>{selectedReservation.responsable}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Check-in</p>
                <p>{selectedReservation.fechaEntrada.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Check-out</p>
                <p>{selectedReservation.fechaSalida.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <Badge className={getStatusColor(selectedReservation.estado)}>
                  {selectedReservation.estado}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo de Unidad</p>
                <Badge className={getUnitTypeColor(selectedReservation.unidad)}>
                  {selectedReservation.unidad}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Plataforma</p>
                <p>{selectedReservation.plataforma}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cantidad de Pax</p>
                <p>{selectedReservation.pax}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cantidad de Noches</p>
                <p>{selectedReservation.cantidadNoches}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor Total</p>
                <p>${selectedReservation.montos.usd.total.toLocaleString()} USD / ${selectedReservation.montos.ars.total.toLocaleString()} ARS</p>
              </div>
              <div>
                <p className="text-muted-foreground">Forma de Pago</p>
                <p>{selectedReservation.pagos[0].formaPago}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monto Pagado</p>
                <p className="text-green-700">${selectedReservation.pagos[0].monto.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monto Adeudado</p>
                <p className="text-red-700">${selectedReservation.montos.ars.saldo.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Responsable Check-in</p>
                <p>{selectedReservation.creadoPor}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mascota</p>
                <p>{selectedReservation.mascota ? "Sí" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vehículo</p>
                <p>{"Por Ver"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Observación</p>
                <p>{selectedReservation.observaciones}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
