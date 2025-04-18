import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Bed,
  Bath,
  Users,
  ShoppingCart,
  Plus,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IRoom {
  id: number;
  roomNumber: number;
  type: string;
  price: number;
  status: string;
  description: string;
  beds: number;
  guestsPerRoom: number;
  name: string;
  imageUrl: string;
  bathrooms: number;
  reservedDateRanges: [string, string][];
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const { addToCart, cartItems, getCartDates, isRoomInCart } = useCart();

  const [rooms, setRooms] = useState<IRoom[]>([]);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState<string>("All");
  const [showCartAlert, setShowCartAlert] = useState(false);

  // Initialize date pickers with cart dates if they exist
  useEffect(() => {
    const { checkIn, checkOut } = getCartDates();
    if (cartItems.length > 0 && checkIn && checkOut) {
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      setShowCartAlert(true);
    }
  }, [cartItems, getCartDates]);

  // Filter rooms based on search criteria and availability for the selected dates
  const filteredRooms = rooms.filter((room) => {
    const matchesPrice =
      room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesType = roomType === "All" || room.type === roomType;

    // By default, assume the room is available.
    let isAvailable = true;

    // Only filter by availability if both dates are selected.
    if (checkInDate && checkOutDate) {
      isAvailable = room.reservedDateRanges.every((range) => {
        // Assume each range is [reservedCheckIn, reservedCheckOut]
        const [reservedCheckIn, reservedCheckOut] = range;
        // Convert reserved dates to Date objects (if they aren't already)
        const reservedIn = new Date(reservedCheckIn);
        const reservedOut = new Date(reservedCheckOut);
        // There is no conflict if the selected check-out is on or before the reserved check-in,
        // OR the selected check-in is on or after the reserved check-out.
        return (
          checkOutDate.getTime() <= reservedIn.getTime() ||
          checkInDate.getTime() >= reservedOut.getTime()
        );
      });
    }

    return matchesPrice && matchesType && isAvailable;
  });

  const goToCart = () => {
    navigate("/bookings/cart");
  };

  const handleAddToCart = (room: IRoom) => {
    if (!checkInDate || !checkOutDate) {
      //   toast({
      //     title: "Please select dates",
      //     description: "You need to select both check-in and check-out dates",
      //     variant: "destructive",
      //   })

      toast.error("Por favor, selecciona las fechas", {
        description:
          "Necesitas seleccionar tanto la fecha de check-in como la de check-out",
      });

      return;
    }

    const result = addToCart({
      ...room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });

    if (result.success) {
      toast("Añadido al carrito", {
        description: `${room.name} ha sido añadido a tu carrito`,
      });
    } else {
      toast.error("No se pudo añadir al carrito", {
        description: result.message,
      });
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/api/room");
        setRooms(res.data ?? []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setRooms([]);
      }
    };

    fetchRooms();
  }, []);

  // Handle date changes
  const handleCheckInChange = (date: Date | undefined) => {
    if (cartItems.length > 0) {
      const { checkIn } = getCartDates();
      if (checkIn && date && date.toDateString() !== checkIn.toDateString()) {
        toast.error("Restricción de fechas", {
          description:
            "Ya tienes elementos en tu carrito con fechas diferentes. Por favor, vacía tu carrito primero o usa las mismas fechas.",
        });

        // toast({
        //   title: "Date restriction",
        //   description:
        //     "You already have items in your cart with different dates. Please clear your cart first or use the same dates.",
        //   variant: "destructive",
        // });
        return;
      }
    }
    setCheckInDate(date);
    // Reset checkout date if it's before the new check-in date
    if (date && checkOutDate && checkOutDate <= date) {
      setCheckOutDate(undefined);
    }
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    if (cartItems.length > 0) {
      const { checkOut } = getCartDates();
      if (checkOut && date && date.toDateString() !== checkOut.toDateString()) {
        toast.error("Restricción de fechas", {
          description:
            "Ya tienes elementos en tu carrito con fechas diferentes. Por favor, vacía tu carrito primero o utiliza las mismas fechas.",
        });

        // toast({
        //   title: "Date restriction",
        //   description:
        //     "You already have items in your cart with different dates. Please clear your cart first or use the same dates.",
        //   variant: "destructive",
        // });
        return;
      }
    }
    setCheckOutDate(date);
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-10">
      {/* Encabezado y botón del carrito */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Encuentra tu bungalow perfecto
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-border hover:bg-muted"
          onClick={goToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Carrito</span>
          {cartItems.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 bg-primary/10 text-primary"
            >
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Alerta si hay elementos en carrito */}
      {showCartAlert && cartItems.length > 0 && (
        <Alert className="bg-muted border-border text-muted-foreground">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Tienes elementos en tu carrito. Todas las nuevas habitaciones deben
            ser reservadas para las mismas fechas:{" "}
            <span className="font-medium text-foreground">
              {checkInDate && format(checkInDate, "MMM dd, yyyy")} a{" "}
              {checkOutDate && format(checkOutDate, "MMM dd, yyyy")}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <div className="bg-card rounded-xl shadow-md border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Rango de precios */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Rango de precios: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
              className="pt-4 px-2"
            />
          </div>

          {/* Fecha check-in */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Fecha de check-in
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={cartItems.length > 0}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate
                    ? format(checkInDate, "MMM dd, yyyy")
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={checkInDate}
                  onSelect={handleCheckInChange}
                  disabled={(date) => date < new Date()}
                  className="bg-white rounded-md shadow-md text-foreground"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Fecha check-out */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Fecha de check-out
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={cartItems.length > 0}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate
                    ? format(checkOutDate, "MMM dd, yyyy")
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={checkOutDate}
                  onSelect={handleCheckOutChange}
                  disabled={(date) => !checkInDate || date <= checkInDate}
                  className="bg-white rounded-md shadow-md text-foreground"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tipo de habitación */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tipo de habitación
            </label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Todas las habitaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Todas las habitaciones</SelectItem>
                <SelectItem value="Single">Individual</SelectItem>
                <SelectItem value="Double">Doble</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid de habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const roomInCart = isRoomInCart(room.id);
          return (
            <Card
              key={room.id}
              className={`overflow-hidden p-0 rounded-xl border shadow-md transition ${
                roomInCart ? "border-primary" : "border-border"
              }`}
            >
              <div className="relative h-48">
                <img
                  src={room.imageUrl || "/placeholder.svg"}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {roomInCart && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary text-primary-foreground"
                    >
                      En el carrito
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  <p className="text-lg font-bold text-primary">
                    ${room.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /noche
                    </span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {room.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{room.guestsPerRoom} huéspedes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={16} />
                    <span>{room.guestsPerRoom <= 2 ? 1 : 2} camas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath size={16} />
                    <span>{room.bathrooms} baño</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="flex-1" onClick={goToCart} variant="outline">
                  Ir al carrito
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleAddToCart(room)}
                  disabled={!checkInDate || !checkOutDate || roomInCart}
                  title={
                    roomInCart
                      ? "Habitación ya en el carrito"
                      : "Añadir al carrito"
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-xl border border-border">
          <h3 className="text-xl font-medium">
            No hay habitaciones que coincidan con tus criterios de búsqueda
          </h3>
          <p className="text-muted-foreground mt-2">
            Intenta ajustar tus filtros para encontrar habitaciones disponibles
          </p>
        </div>
      )}
    </div>
  );
}
