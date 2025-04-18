import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservationCard, { type Reservation } from "./ReservationCard";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ReservationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleCancelReservation = (id: string) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.reservationId === id
          ? { ...reservation, status: "Cancelled" as const }
          : reservation
      )
    );
  };

  let pastReservations: Reservation[] = [];
  let upcomingReservations: Reservation[] = [];

  reservations.forEach((res) => {
    if (res.status === "Cancelled" || res.status === "Completed") {
      pastReservations.push(res);
    } else if (res.status === "Confirmed") {
      upcomingReservations.push(res);
    }
  });

  useEffect(() => {
    api
      .get(`api/Reservation/user/view-reservations?userId=${user?.id}`)
      .then((res) => {
        const toSave = res.data as Reservation[];
        setReservations(toSave);
      })
      .catch(() => setReservations([]));
  }, []);

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mis Reservaciones
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Consulta y gestiona tus reservaciones actuales y anteriores
          </p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-8">
        <TabsList className="bg-muted p-1 rounded-lg border border-border w-fit mx-auto">
          <TabsTrigger
            value="upcoming"
            className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:border data-[state=active]:border-border"
          >
            Actuales y Próximas
            {upcomingReservations.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {upcomingReservations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:border data-[state=active]:border-border"
          >
            Reservaciones Pasadas
          </TabsTrigger>
        </TabsList>

        {/* Próximas reservaciones */}
        <TabsContent value="upcoming" className="space-y-6">
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map((reservation) => (
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                onCancelReservation={handleCancelReservation}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                No hay reservaciones próximas
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                No tienes reservaciones actuales o próximas. Explora nuestras
                habitaciones para reservar tu próxima estadía.
              </p>
              <Button onClick={() => navigate("/bookings")} className="bg-primary text-primary-foreground hover:bg-primary/90 transition">
                Explorar Habitaciones
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Pasadas */}
        <TabsContent value="past" className="space-y-6">
          {pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                onCancelReservation={handleCancelReservation}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                No hay reservaciones pasadas
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Aún no tienes reservaciones pasadas con nosotros.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition">
                Reserva tu Primera Estadía
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
