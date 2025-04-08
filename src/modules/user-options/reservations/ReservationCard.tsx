import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/api";

export type Reservation = {
  reservationId: string;
  rooms: Array<{
    name: string;
    type: string;
  }>;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: "Confirmed" | "Cancelled" | "Completed";
  location: string;
};

interface ReservationCardProps {
  reservation: Reservation;
  onCancelReservation: (id: string) => void;
}

export default function ReservationCard({
  reservation,
  onCancelReservation,
}: ReservationCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelReservation = async () => {
    setIsCancelling(true);

    try {
      await api.put(
        `/api/Reservation/cancel-reservation?reservationId=${reservation.reservationId}`
      );

      onCancelReservation(reservation.reservationId);

      toast("Reservación cancelada", {
        description: "Tu reservación ha sido cancelada exitosamente.",
      });
    } catch (error) {
      toast.error("Error al Cancelar Reservación");
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "Active";
      case "Completed":
        return "Completed";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const nights = Math.ceil(
    (new Date(reservation.checkOut).getTime() -
      new Date(reservation.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const canCancel =
    reservation.status === "Confirmed" &&
    new Date(reservation.checkIn) > new Date();
  const isPast =
    reservation.status === "Cancelled" ||
    new Date(reservation.checkIn) < new Date();

  return (
    <>
      <Card
        className={`overflow-hidden p-0 ${
          reservation.status === "Confirmed" ? "border-primary" : ""
        }`}
      >
        <div className="p-4">
          <div className="flex flex-col h-full">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {reservation.rooms.length > 1
                      ? `Reservación (${reservation.rooms.length} habitaciones)`
                      : reservation.rooms[0].name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{reservation.location}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-medium mr-2">
                    ${reservation.totalPrice.toFixed(2)}
                  </p>
                  <Badge className={getStatusColor(reservation.status)}>
                    {getStatusLabel(reservation.status)}
                  </Badge>
                </div>
              </div>

              {/* Lista de habitaciones si hay más de una */}
              {reservation.rooms.length > 1 && (
                <div className="mt-3 border-l-2 border-muted pl-3">
                  <p className="text-sm font-medium mb-1">
                    Habitaciones en esta reservación:
                  </p>
                  <ul className="space-y-1">
                    {reservation.rooms.map((room, index) => (
                      <li key={index} className="text-sm">
                        {room.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div>
                      Check-in: {format(reservation.checkIn, "MMM dd, yyyy")}
                    </div>
                    <div>
                      Check-out: {format(reservation.checkOut, "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div>
                      {reservation.numberOfGuests} huésped
                      {reservation.numberOfGuests !== 1 ? "es" : ""}
                    </div>
                    <div>
                      {nights} noche{nights !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Confirmación: BP-{reservation.reservationId}</span>
                </div>
              </div>
            </div>

            {!isPast && (
              <div className="pt-4 mt-auto">
                {canCancel ? (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancelar reservación
                  </Button>
                ) : (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>
                      Las reservaciones activas no pueden cancelarse en línea.
                      Por favor contacte a recepción.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Diálogo de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar reservación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar tu reservación{" "}
              {reservation.rooms.length > 1
                ? `de ${reservation.rooms.length} habitaciones`
                : `en ${reservation.rooms[0].name}`}
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-3 rounded-md mt-2 text-sm">
            <div className="font-medium">Detalles de la reservación:</div>
            <div className="mt-1">
              <div>Check-in: {format(reservation.checkIn, "MMM dd, yyyy")}</div>
              <div>
                Check-out: {format(reservation.checkOut, "MMM dd, yyyy")}
              </div>
              <div>Confirmación: BP-{reservation.reservationId}</div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 sm:space-x-0 sm:justify-end">
            <Button
              variant="destructive"
              onClick={handleCancelReservation}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelando..." : "Cancelar reservación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
