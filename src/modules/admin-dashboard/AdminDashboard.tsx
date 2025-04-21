import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminRooms from "./control-centers/AdminRooms";
import AdminReservations from "./control-centers/AdminReservations";
import AdminUsers from "./control-centers/AdminUsers";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rooms");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6 text-primary hover:underline hover:text-primary-foreground transition"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Inicio
      </Button>

      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Gestiona habitaciones, reservas y usuarios del hotel Bungalow
          Paradise.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/50 shadow-sm backdrop-blur-sm">
          <TabsTrigger value="rooms">Habitaciones</TabsTrigger>
          <TabsTrigger value="reservations">
            Reservas{" "}
            <Badge variant="secondary" className="text-xs ml-1">
              Pendiente
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="users">
            Usuarios{" "}
            <Badge variant="secondary" className="text-xs ml-1">
              Pendiente
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-6">
          <AdminRooms />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-6">
          <AdminReservations />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
