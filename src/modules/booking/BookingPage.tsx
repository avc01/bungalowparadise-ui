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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";

interface IRoom {
  id: number,
  roomNumber: number,
  type: string,
  price: number,
  status: string,
  description: string,
  beds: number,
  guestsPerRoom: number,
  name: string,
  imageUrl: string,
  bathrooms: number,
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [rooms, setRooms] = useState<IRoom[]>([]);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState<string>("All");

  // Filter rooms based on search criteria
  const filteredRooms = rooms.filter((room) => {
    const matchesPrice =
      room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesType =
      roomType === "All" || room.type === roomType;
    return matchesPrice && matchesType;
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

      toast.error("Please select dates", {
        description: "You need to select both check-in and check-out dates",
      });
      return;
    }

    addToCart({
      ...room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });

    // toast({
    //   title: "Added to cart",
    //   description: `${room.name} has been added to your cart`,
    // })
    toast("Added to cart", {
      description: `${room.name} has been added to your cart`,
    });
  };

  useEffect(() => {

    const fetchRooms = async () => {
      try {
        const res = await api.get('/api/room');
        setRooms(res.data ?? []);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        setRooms([]);
      }
    };
  
    fetchRooms();
  }, [])

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find Your Perfect Bungalow</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={goToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
          {cartItems.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search filters */}
      <div className="bg-card rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="pt-6 px-2">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
          </div>

          {/* Check-In Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Check In Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate
                    ? format(checkInDate, "MMM dd, yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-Out Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Check Out Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate
                    ? format(checkOutDate, "MMM dd, yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => !checkInDate || date <= checkInDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Room Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Room Type</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="All Rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Rooms</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Double">Double</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Room listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden p-0">
            <div className="relative h-48">
              <img
                src={room.imageUrl || "/placeholder.svg"}
                alt={room.name}
                className="w-full h-full object-cover rounded-t-md"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="text-lg font-bold">
                  ${room.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /night
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground mt-2">{room.description}</p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1 text-sm">
                  <Users size={16} />
                  <span>{room.guestsPerRoom} guests</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Bed size={16} />
                  <span>{room.guestsPerRoom <= 2 ? 1 : 2} beds</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Bath size={16} />
                  <span>{room.bathrooms} bath</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button className="flex-1" onClick={goToCart} variant="outline">
                Go to Cart
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={() => handleAddToCart(room)}
                disabled={!checkInDate || !checkOutDate}
                title="Add to cart"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">
            No rooms match your search criteria
          </h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters to find available rooms
          </p>
        </div>
      )}
    </div>
  );
}
