import { useState } from "react";
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

// Mock room data
const roomsData = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    description: "Spacious room with stunning ocean views and private balcony",
    price: 299,
    image: "/placeholder.svg?height=300&width=500",
    type: "deluxe",
    capacity: 2,
    bathrooms: 1,
  },
  {
    id: 2,
    name: "Premium Garden Suite",
    description: "Elegant suite overlooking our tropical gardens",
    price: 399,
    image: "/placeholder.svg?height=300&width=500",
    type: "suite",
    capacity: 3,
    bathrooms: 1,
  },
  {
    id: 3,
    name: "Family Bungalow",
    description: "Perfect for families with separate living area",
    price: 499,
    image: "/placeholder.svg?height=300&width=500",
    type: "bungalow",
    capacity: 4,
    bathrooms: 2,
  },
  {
    id: 4,
    name: "Honeymoon Villa",
    description: "Romantic villa with private plunge pool",
    price: 599,
    image: "/placeholder.svg?height=300&width=500",
    type: "villa",
    capacity: 2,
    bathrooms: 1,
  },
  {
    id: 5,
    name: "Standard Garden View",
    description: "Comfortable room with garden views",
    price: 199,
    image: "/placeholder.svg?height=300&width=500",
    type: "standard",
    capacity: 2,
    bathrooms: 1,
  },
  {
    id: 6,
    name: "Beachfront Bungalow",
    description: "Steps away from the beach with panoramic ocean views",
    price: 699,
    image: "/placeholder.svg?height=300&width=500",
    type: "bungalow",
    capacity: 3,
    bathrooms: 2,
  },
  {
    id: 7,
    name: "Executive Suite",
    description: "Luxurious suite with separate living area and workspace",
    price: 449,
    image: "/placeholder.svg?height=300&width=500",
    type: "suite",
    capacity: 2,
    bathrooms: 1,
  },
  {
    id: 8,
    name: "Two-Bedroom Villa",
    description: "Spacious villa with two bedrooms and private garden",
    price: 799,
    image: "/placeholder.svg?height=300&width=500",
    type: "villa",
    capacity: 5,
    bathrooms: 2,
  },
];

export default function BookingsPage() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState<string>("");

  // Filter rooms based on search criteria
  const filteredRooms = roomsData.filter((room) => {
    const matchesPrice =
      room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesType =
      roomType === "all" || roomType === "" || room.type === roomType;
    return matchesPrice && matchesType;
  });

  const goToCart = () => {
    navigate("/bookings/cart");
  };

  const handleAddToCart = (room: any) => {
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
                <SelectValue placeholder="All room types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All room types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Room listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="relative h-48">
              {/* <Image
                src={room.image || "/placeholder.svg"}
                alt={room.name}
                fill
                className="object-cover"
              /> */}
              <img
                src={room.image || "/placeholder.svg"}
                alt={room.name}
                className="w-full object-cover"
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
                  <span>{room.capacity} guests</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Bed size={16} />
                  <span>{room.capacity <= 2 ? 1 : 2} beds</span>
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
