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

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useCart();

  const totalPrice = getTotalPrice();
  const taxesAndFees = totalPrice * 0.15; // 15% for taxes and fees
  const grandTotal = totalPrice + taxesAndFees;

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
    // toast({
    //   title: "Item removed",
    //   description: "The item has been removed from your cart",
    // });
    toast.warning("Item removed", {
      description: "The item has been removed from your cart",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      //   toast({
      //     title: "Cart is empty",
      //     description: "Please add rooms to your cart before checking out",
      //     variant: "destructive",
      //   });
      toast.error("Cart is empty", {
        description: "Please add rooms to your cart before checking out",
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

  return (
    <div className="py-8">
      <Button
        variant="ghost"
        // onClick={() => router.push("/bookings")}
        onClick={() => navigate("/bookings")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add rooms to your cart to continue
            </p>
            <Button
              // onClick={() => router.push("/bookings")}
              onClick={() => navigate("/bookings")}
            >
              Browse Rooms
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => {
                  const nights = calculateNights(item.checkIn, item.checkOut);
                  const itemTotal = item.price * nights;

                  return (
                    <div key={index} className="flex gap-4 pb-4 border-b">
                      <div className="relative h-24 w-32 flex-shrink-0">
                        {/* <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        /> */}
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-semibold">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${item.price} per night × {nights} night
                          {nights !== 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {format(item.checkIn, "MMM dd, yyyy")} -{" "}
                            {format(item.checkOut, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  //   onClick={() => router.push("/bookings")}
                  onClick={() => navigate("/bookings")}
                >
                  Continue Shopping
                </Button>
                <Button variant="ghost" onClick={() => clearCart()}>
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
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
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
