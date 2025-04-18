import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Trash2, ArrowLeft, CalendarIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice, clearCart, getCartDates } =
    useCart();

  const totalPrice = getTotalPrice();
  const taxesAndFees = totalPrice * 0.15; // 15% for taxes and fees
  const grandTotal = totalPrice + taxesAndFees;

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
    // toast({
    //   title: "Item removed",
    //   description: "The item has been removed from your cart",
    // });
    toast.warning("Artículo eliminado", {
      description: "El artículo ha sido eliminado de tu carrito",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      //   toast({
      //     title: "Cart is empty",
      //     description: "Please add rooms to your cart before checking out",
      //     variant: "destructive",
      //   });
      toast.error("El carrito está vacío", {
        description:
          "Por favor, agrega habitaciones a tu carrito antes de proceder al pago",
      });

      return;
    }

    // router.push("/bookings/payment");
    navigate("/bookings/payment");
  };

  const calculateNights = (checkIn: Date, checkOut: Date) => {
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // Get cart dates for display
  const { checkIn, checkOut } = getCartDates();
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-10">
      <Button
        variant="ghost"
        onClick={() => navigate("/bookings")}
        className="text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a las reservas
      </Button>

      <div className="flex items-center gap-3">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Tu Carrito</h1>
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12 bg-card border border-border rounded-xl shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Agrega habitaciones a tu carrito para continuar
            </p>
            <Button
              onClick={() => navigate("/bookings")}
              className="bg-primary text-primary-foreground"
            >
              Explorar habitaciones
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Artículos en el carrito ({cartItems.length})
                </CardTitle>
                {checkIn && checkOut && (
                  <Alert
                    variant="default"
                    className="mt-4 bg-muted border-border"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Todas las habitaciones están reservadas del{" "}
                      <strong>{format(checkIn, "MMM dd, yyyy")}</strong> al{" "}
                      <strong>{format(checkOut, "MMM dd, yyyy")}</strong> (
                      {nights} noche{nights !== 1 ? "s" : ""})
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {cartItems.map((item, index) => {
                  const nights = calculateNights(item.checkIn, item.checkOut);
                  const itemTotal = item.price * nights;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 pb-6 border-b border-border"
                    >
                      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-base">
                            {item.name}
                          </h3>
                          <p className="font-bold text-primary">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${item.price} por noche × {nights} noche
                          {nights !== 1 ? "s" : ""}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {format(item.checkIn, "MMM dd")} -{" "}
                            {format(item.checkOut, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive px-0 h-6 mt-2"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/bookings")}>
                  Continuar explorando
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => clearCart()}
                >
                  Vaciar carrito
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="border border-border rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Resumen del pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos y tarifas</span>
                  <span>${taxesAndFees.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCheckout}
                >
                  Proceder al pago
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
