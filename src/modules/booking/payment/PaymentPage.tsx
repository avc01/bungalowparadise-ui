import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart, type CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { AxiosError } from "axios";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  // Calculate totals
  const calculateNights = (checkIn: Date, checkOut: Date) => {
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const calculateItemTotal = (item: CartItem) => {
    const nights = calculateNights(item.checkIn, item.checkOut);
    return item.price * nights;
  };

  const subtotal = getTotalPrice();
  const taxesAndFees = subtotal * 1.15; // 15% for taxes and fees
  const grandTotal = subtotal + taxesAndFees;

  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: user?.name ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [reservationError, setReservationError] = useState<string>();
  const [reservationRes, setReservationRes] = useState({
    reservationId: "",
    rooms: 0,
    amount: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    debugger;
    api
      .post("/api/Reservation/confirm-reservation", {
        userId: user?.id,
        userEmail: user?.email,

        checkIn: cartItems[0].checkIn.toISOString(),
        checkOut: cartItems[0].checkOut.toISOString(),
        roomIds: cartItems.map((x) => x.id),

        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cVV: formData.cvv,
        totalAmount: grandTotal,
      })
      .then((res) => {
        debugger;
        setReservationRes({
          reservationId: res.data.reservationId,
          amount: res.data.amount,
          rooms: res.data.rooms
        });
        setIsSubmitting(false);
        setIsComplete(true);
        clearCart();
      })
      .catch((ex) => {
        debugger;
        const exception = ex as AxiosError;

        setIsSubmitting(false);
        setReservationError(exception.response?.data as string);
      });

    // Simulate API call
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setIsComplete(true);
    //   clearCart();
    // }, 1500);
  };

  const goBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    } else {
      navigate("/bookings/cart");
    }
  };

  if (cartItems.length === 0 && !isComplete) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No items to checkout</h1>
        <p className="mb-6">
          Your cart is empty. Please add rooms to your cart before checkout.
        </p>
        <Button onClick={() => navigate("/bookings")}>
          Return to Bookings
        </Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">¡Reserva Confirmada!</CardTitle>
            <CardDescription>
              Tu reserva ha sido procesada exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Referencia de Reserva
                  </p>
                  <p className="font-medium">{reservationRes.reservationId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Huésped</p>
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monto Total</p>
                  <p className="font-medium">${reservationRes.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Habitaciones</p>
                  <p className="font-medium">
                    {reservationRes.rooms} habitación
                    {reservationRes.rooms !== 1 ? "es" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="space-y-4">
              <h3 className="font-medium">Detalles de la Reserva</h3>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="relative h-16 w-24 flex-shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {format(item.checkIn, "dd MMM yyyy")} -{" "}
                      {format(item.checkOut, "dd MMM yyyy")}
                    </div>
                    <div className="text-sm">
                      ${item.price}/noche ×{" "}
                      {calculateNights(item.checkIn, item.checkOut)} noche
                      {calculateNights(item.checkIn, item.checkOut) !== 1
                        ? "s"
                        : ""}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${calculateItemTotal(item).toFixed(2)}
                  </div>
                </div>
              ))}
            </div> */}

            <div className="text-center text-muted-foreground">
              <p>Se ha enviado un correo de confirmación a {formData.email}</p>
              <p>¡Esperamos darte la bienvenida en BungalowParadise!</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/bookings")}>
              Volver a Reservas
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
              <CardDescription>
                Please provide your details to confirm your reservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={formStep === 0 ? "guest" : "payment"}
                onValueChange={(value) => {
                  setFormStep(value === "guest" ? 0 : 1);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="guest">Guest Information</TabsTrigger>
                  <TabsTrigger value="payment">Payment Details</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  <TabsContent value="guest" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => setFormStep(1)}
                    >
                      Continue to Payment
                    </Button>
                  </TabsContent>

                  <TabsContent value="payment" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Month</Label>
                        <Select
                          value={formData.expiryMonth}
                          onValueChange={(value) =>
                            handleSelectChange("expiryMonth", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = i + 1;
                              return (
                                <SelectItem
                                  key={month}
                                  value={month.toString().padStart(2, "0")}
                                >
                                  {month.toString().padStart(2, "0")}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Expiry Year</Label>
                        <Select
                          value={formData.expiryYear}
                          onValueChange={(value) =>
                            handleSelectChange("expiryYear", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          maxLength={4}
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {reservationError && (
                      <div className="p-4 rounded-md bg-red-100 text-red-800 text-sm border border-red-300">
                        {reservationError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </TabsContent>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length > 0 && (
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const nights = calculateNights(item.checkIn, item.checkOut);
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="rounded-md bg-muted h-12 w-12 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${item.price} × {nights} night
                            {nights !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="font-medium">
                          ${calculateItemTotal(item).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & fees</span>
                  <span>${taxesAndFees.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
