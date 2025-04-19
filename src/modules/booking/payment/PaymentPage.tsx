import type React from "react";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const taxesAndFees = subtotal * 0.15; // 15% for taxes and fees
  const grandTotal = subtotal + taxesAndFees;

  const [disableCardForm, setDisableCardForm] = useState(false);

  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: user?.name ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    numberOfGuests: 1,
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

  // Nuevos estados para personas y política
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicy) {
      setReservationError(
        "Debes aceptar la política de reservación para continuar."
      );
      return;
    }
    setIsSubmitting(true);
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
        numberOfGuests: formData.numberOfGuests,
        totalAmount: grandTotal,
      })
      .then((res) => {
        setReservationRes({
          reservationId: res.data.reservationId,
          amount: res.data.amount,
          rooms: res.data.rooms,
        });
        setIsSubmitting(false);
        setIsComplete(true);
        clearCart();
      })
      .catch((ex) => {
        const exception = ex as AxiosError;

        setIsSubmitting(false);
        setReservationError(exception.response?.data as string);
      });
  };

  const goBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    } else {
      navigate("/bookings/cart");
    }
  };

  useEffect(() => {
    api
      .get(`api/CardDetail/user-card?userId=${user?.id}&masked=${false}`)
      .then((res) => {
        setFormData((prevData) => ({
          ...prevData, // Retain all existing properties
          cardNumber: res.data.cardNumber.replace(/(\d{4})(?=\d)/g, "$1-"),
          cardName: res.data.cardHolder,
          expiryMonth: res.data.expiryMonth,
          expiryYear: res.data.expiryYear,
          cvv: res.data.cvv,
        }));

        setDisableCardForm(true);
      })
      .catch();
  }, []);

  if (cartItems.length === 0 && !isComplete) {
    return (
      <div className="max-w-xl mx-auto bg-muted/30 border border-border rounded-xl shadow-md text-center py-12 px-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          No hay artículos para pagar
        </h1>
        <p className="text-muted-foreground text-sm">
          Tu carrito está vacío. Por favor, agrega habitaciones antes de
          continuar con el pago.
        </p>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate("/bookings")}
        >
          Volver a las reservas
        </Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Card className="border border-green-300 shadow-md rounded-xl">
          <CardHeader className="text-center space-y-2">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-2" />
            <CardTitle className="text-2xl font-bold tracking-tight">
              ¡Reserva Confirmada!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tu reserva ha sido procesada exitosamente.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-xl bg-muted border border-border p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Referencia de Reserva</p>
                  <p className="font-semibold text-foreground">
                    {reservationRes.reservationId}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Huésped</p>
                  <p className="font-semibold text-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monto Total</p>
                  <p className="font-semibold text-foreground">
                    ${reservationRes.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Habitaciones</p>
                  <p className="font-semibold text-foreground">
                    {reservationRes.rooms} habitación
                    {reservationRes.rooms !== 1 ? "es" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Se ha enviado un correo de confirmación a{" "}
                <strong>{formData.email}</strong>.
              </p>
              <p>
                ¡Esperamos darte la bienvenida en{" "}
                <span className="text-primary font-medium">
                  Bungalow Paradise
                </span>
                !
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/bookings")}
            >
              Volver a Reservas
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-8">
      <Button
        variant="ghost"
        onClick={goBack}
        className="text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold tracking-tight">
                Completa tu reserva
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Por favor, proporciona tus datos para confirmar tu reserva
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs
                value={formStep === 0 ? "guest" : "payment"}
                onValueChange={(value) =>
                  setFormStep(value === "guest" ? 0 : 1)
                }
              >
                <TabsList className="grid grid-cols-2 mb-6 bg-muted rounded-lg border border-border">
                  <TabsTrigger value="guest">
                    Información del huésped
                  </TabsTrigger>
                  <TabsTrigger value="payment">Detalles de pago</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <TabsContent value="guest" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
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
                        <Label htmlFor="lastName">Apellido</Label>
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
                      <Label htmlFor="email">Correo electrónico</Label>
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
                      <Label htmlFor="phone">Número de teléfono</Label>
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

                    {/* Número de personas */}
                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">
                        ¿Cuántas personas asistirán?
                      </Label>
                      <Input
                        id="numberOfGuests"
                        name="numberOfGuests"
                        type="number"
                        min={1}
                        max={cartItems.reduce(
                          (acc, cartItem) =>
                            cartItem.guestsPerRoom
                              ? (acc += cartItem.guestsPerRoom)
                              : acc,
                          0
                        )}
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setFormStep(1)}
                    >
                      Continuar al pago
                    </Button>
                  </TabsContent>

                  <TabsContent value="payment" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        disabled={disableCardForm}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        disabled={disableCardForm}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Mes de expiración</Label>
                        <Select
                          value={formData.expiryMonth}
                          onValueChange={(value) =>
                            handleSelectChange("expiryMonth", value)
                          }
                          disabled={disableCardForm}
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
                        <Label>Año de expiración</Label>
                        <Select
                          value={formData.expiryYear}
                          onValueChange={(value) =>
                            handleSelectChange("expiryYear", value)
                          }
                          disabled={disableCardForm}
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
                          disabled={disableCardForm}
                        />
                      </div>
                    </div>

                    {/* Aceptación de política */}
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={agreedToPolicy}
                          onChange={(e) => setAgreedToPolicy(e.target.checked)}
                          className="mt-1"
                        />
                        <span>
                          He leído y acepto la{" "}
                          <button
                            type="button"
                            onClick={() => setShowPolicyDialog(true)}
                            className="underline text-primary"
                          >
                            política de reservación del hotel
                          </button>
                          .
                        </span>
                      </label>
                    </div>

                    {reservationError && (
                      <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/30">
                        {reservationError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Confirmar reserva"}
                    </Button>
                  </TabsContent>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de la reserva */}
        <div>
          <Card className="rounded-xl border border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Resumen de la reserva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {cartItems.length > 0 && (
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const nights = calculateNights(item.checkIn, item.checkOut);
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="rounded-md bg-muted h-12 w-12 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="text-muted-foreground text-xs">
                            ${item.price} × {nights} noche
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
                  <span>Impuestos y tarifas</span>
                  <span>${taxesAndFees.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diálogo de política */}
        <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Política de Reservación</DialogTitle>
              <DialogDescription>
                El usuario se compromete a respetar la capacidad máxima
                permitida en cada habitación y a proporcionar información veraz
                durante el proceso de reserva. El incumplimiento puede resultar
                en cargos adicionales o en la cancelación de la estadía.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowPolicyDialog(false)}>
                Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
