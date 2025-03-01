"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bed, CalendarIcon, MapPin, Search, User } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HotelReservationLanding() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1)),
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full flex h-16 items-center">
            <div className="mr-4 flex items-center gap-2">
              <Bed className="h-6 w-6" />
              <span className="text-xl font-bold">Bungalow Paradise</span>
            </div>
            <Menubar className="ml-auto rounded-none border-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="font-medium">Página de Inicio</MenubarTrigger>
              </MenubarMenu>
              {/* <MenubarMenu>
                <MenubarTrigger className="font-medium">Destinations</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Beach Resorts</MenubarItem>
                  <MenubarItem>Mountain Retreats</MenubarItem>
                  <MenubarItem>City Hotels</MenubarItem>
                  <MenubarItem>Countryside Villas</MenubarItem>
                </MenubarContent>
              </MenubarMenu> */}
              {/* <MenubarMenu>
                <MenubarTrigger className="font-medium">About</MenubarTrigger>
              </MenubarMenu> */}
              {/* <MenubarMenu>
                <MenubarTrigger className="font-medium">Contact</MenubarTrigger>
              </MenubarMenu> */}
            </Menubar>
            <div className="ml-4 flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Iniciar Sesión</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Inicie sesión en su cuenta</DialogTitle>
                    <DialogDescription>Ingresa tus credenciales para acceder a tu cuenta</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Iniciar Sesión</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Crear Cuenta</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Crear Cuenta</DialogTitle>
                    <DialogDescription>Únete a Bungalow Paradise para reservar las vacaciones de tus sueños</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input id="signupEmail" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signupPassword">Contraseña</Label>
                      <Input id="signupPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Crear Cuenta</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="relative">
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" /> */}
            <div
              className="h-[500px] bg-cover bg-center"
              style={{ backgroundImage: "url('/hotel-landpage.jpg?height=500&width=1200')" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white text-center"
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>
                Encuentra Tu Escapada Perfecta
              </h1>
            </div>
          </section>

          <section className="py-8 -mt-16 relative z-30">
            <Card className="border shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="hotel" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="hotel">Hotel</TabsTrigger>
                    <TabsTrigger value="resort">Resort</TabsTrigger>
                  </TabsList>
                  <TabsContent value="hotel" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="location" placeholder="Where are you going?" className="pl-8" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkoutDate ? format(checkoutDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={checkoutDate} onSelect={setCheckoutDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Guests</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select defaultValue="2">
                            <SelectTrigger>
                              <SelectValue placeholder="Adults" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Adult</SelectItem>
                              <SelectItem value="2">2 Adults</SelectItem>
                              <SelectItem value="3">3 Adults</SelectItem>
                              <SelectItem value="4">4 Adults</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="0">
                            <SelectTrigger>
                              <SelectValue placeholder="Children" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0 Children</SelectItem>
                              <SelectItem value="1">1 Child</SelectItem>
                              <SelectItem value="2">2 Children</SelectItem>
                              <SelectItem value="3">3 Children</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      <Search className="mr-2 h-4 w-4" />
                      Search Hotels
                    </Button>
                  </TabsContent>
                  <TabsContent value="resort" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="resort-location">Resort Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="resort-location" placeholder="Find a resort" className="pl-8" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkoutDate ? format(checkoutDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={checkoutDate} onSelect={setCheckoutDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Resort Type</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="All Resorts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Resorts</SelectItem>
                            <SelectItem value="beach">Beach Resorts</SelectItem>
                            <SelectItem value="mountain">Mountain Resorts</SelectItem>
                            <SelectItem value="spa">Spa Resorts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      <Search className="mr-2 h-4 w-4" />
                      Search Resorts
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <section className="bg-muted py-12">
            <div className="">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="ml-5">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">¿Por qué elegir Bungalow Paradise?</h2>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Mejor Precio Garantizado</h3>
                        <p className="text-muted-foreground">
                        ¿Encontró un precio más bajo? Lo igualaremos y le daremos un 10 % de descuento adicional.
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Atención al cliente 24 horas al día, 7 días a la semana</h3>
                        <p className="text-muted-foreground">
                        Nuestro equipo de atención al cliente está disponible las 24 horas del día para ayudarle.
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
              <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Lo que dicen nuestros invitados</h2>
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
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-primary text-primary-foreground py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Book Your Dream Vacation?</h2>
              <p className="max-w-2xl mx-auto mb-6">
                Join thousands of satisfied travelers who have found their perfect getaway with Bungalow Paradise.
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
                      <DialogDescription>Join Bungalow Paradise to book your dream vacation</DialogDescription>
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
                        <Input id="emailCta" type="email" placeholder="your@email.com" />
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

        <footer className="w-full border-t py-8 bg-background">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bed className="h-6 w-6" />
                  <span className="text-xl font-bold">Bungalow Paradise</span>
                </div>
                <p className="text-muted-foreground">Find and book your perfect stay with ease.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Press
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Subscribe</h3>
                <p className="text-muted-foreground mb-4">Get exclusive deals and travel inspiration.</p>
                <div className="flex gap-2">
                  <Input placeholder="Your email" />
                  <Button variant="outline">Subscribe</Button>
                </div>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Bungalow Paradise. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

