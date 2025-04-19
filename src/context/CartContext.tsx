import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string[];
  checkIn: Date;
  checkOut: Date;
  type?: string;
  guestsPerRoom?: number;
  bathrooms?: number;
};

type AddToCartResponse = {
  success: boolean;
  message: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => AddToCartResponse;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartDates: () => { checkIn?: Date; checkOut?: Date };
  isRoomInCart: (roomId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("bungalow-cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Convert ISO date strings back to Date objects
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          checkIn: new Date(item.checkIn),
          checkOut: new Date(item.checkOut),
        }));
        setCartItems(cartWithDates);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCartItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      // Convert Date objects to ISO strings for storage
      const cartForStorage = cartItems.map((item) => ({
        ...item,
        checkIn:
          item.checkIn instanceof Date
            ? item.checkIn.toISOString()
            : item.checkIn,
        checkOut:
          item.checkOut instanceof Date
            ? item.checkOut.toISOString()
            : item.checkOut,
      }));
      localStorage.setItem("bungalow-cart", JSON.stringify(cartForStorage));
    }
  }, [cartItems, isInitialized]);

  // Get the current cart dates (if any items exist)
  const getCartDates = () => {
    if (cartItems.length === 0) {
      return { checkIn: undefined, checkOut: undefined };
    }
    return {
      checkIn: cartItems[0].checkIn,
      checkOut: cartItems[0].checkOut,
    };
  };

  // Check if a room is already in the cart
  const isRoomInCart = (roomId: number) => {
    return cartItems.some((item) => item.id === roomId);
  };

  const addToCart = (item: CartItem) => {
    // Check if the room is already in the cart
    if (isRoomInCart(item.id)) {
      return {
        success: false,
        message: "Esta habitación ya está en tu carrito.",
      };
    }

    // If cart is not empty, check if dates match
    if (cartItems.length > 0) {
      const { checkIn, checkOut } = getCartDates();

      if (checkIn && checkOut) {
        const sameCheckIn =
          checkIn.toDateString() === item.checkIn.toDateString();
        const sameCheckOut =
          checkOut.toDateString() === item.checkOut.toDateString();

        if (!sameCheckIn || !sameCheckOut) {
          return {
            success: false,
            message:
              "Todas las habitaciones deben tener las mismas fechas de check-in y check-out. Por favor, vacía tu carrito o selecciona las mismas fechas.",
          };
        }
      }
    }

    // Add the item to cart
    setCartItems((prevItems) => [
      ...prevItems,
      {
        ...item,
        checkIn: new Date(item.checkIn),
        checkOut: new Date(item.checkOut),
      },
    ]);

    return { success: true, message: "Habitación añadida al carrito exitosamente." };
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((_, index) => index !== itemId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const checkIn = new Date(item.checkIn);
      const checkOut = new Date(item.checkOut);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      return total + item.price * nights;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getCartDates,
        isRoomInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
