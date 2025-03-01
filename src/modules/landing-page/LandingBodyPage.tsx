import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Search, User } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider"
import RoomResults from "../room-result/RoomResults"

export default function LandingBodyPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [roomType, setRoomType] = useState("all");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  return (
    <main className="flex-1">
      <section className="relative">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" /> */}
        <div
          className="h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: "url('/hotel-landpage.jpg?height=500&width=1200')",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white text-center"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            Encuentra Tu Escapada Perfecta
          </h1>
        </div>
      </section>

      <section className="py-8 -mt-16 relative z-30">
        <Card className="border shadow-lg">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Check-in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date ?? "", "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Check-out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(checkoutDate ?? "", "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkoutDate}
                      onSelect={setCheckoutDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full md:w-auto mt-4" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search Rooms
            </Button>
          </CardContent>
        </Card>
        {showResults && <RoomResults />}
      </section>

      <section className="bg-muted py-12">
        <div className="">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="ml-5">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                ¿Por qué elegir Bungalow Paradise?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary p-1 mt-1">
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Mejor Precio Garantizado</h3>
                    <p className="text-muted-foreground">
                      ¿Encontró un precio más bajo? Lo igualaremos y le daremos
                      un 10 % de descuento adicional.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary p-1 mt-1">
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Cancelación Gratuita</h3>
                    <p className="text-muted-foreground">
                      Solo aplica con 24 horas de anterioridad.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary p-1 mt-1">
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Atención al cliente 24 horas al día, 7 días a la semana
                    </h3>
                    <p className="text-muted-foreground">
                      Nuestro equipo de atención al cliente está disponible las
                      24 horas del día para ayudarle.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative mr-10">
              <img
                src="/why-us.jpg?height=400&width=600"
                alt="Luxury hotel room"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
            Lo que dicen nuestros invitados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                location: "New York",
                quote:
                  "The best hotel booking experience I've ever had. The staff was incredibly helpful and the room exceeded my expectations.",
              },
              {
                name: "Michael Chen",
                location: "San Francisco",
                quote:
                  "Bungalow Paradise made our honeymoon perfect. The resort they recommended was absolutely stunning and exactly what we wanted.",
              },
              {
                name: "Emma Williams",
                location: "London",
                quote:
                  "I've used many hotel booking sites, but none compare to the personalized service and attention to detail that Bungalow Paradise provides.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="text-center p-6">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-muted p-2">
                    <User className="h-8 w-8" />
                  </div>
                </div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Book Your Dream Vacation?
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Join thousands of satisfied travelers who have found their perfect
            getaway with Bungalow Paradise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Browse Destinations
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Sign Up Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an account</DialogTitle>
                  <DialogDescription>
                    Join Bungalow Paradise to book your dream vacation
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstNameCta">First name</Label>
                      <Input id="firstNameCta" />
                    </div>
                    <div>
                      <Label htmlFor="lastNameCta">Last name</Label>
                      <Input id="lastNameCta" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emailCta">Email</Label>
                    <Input
                      id="emailCta"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="passwordCta">Password</Label>
                    <Input id="passwordCta" type="password" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create account</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </main>
  );
}
