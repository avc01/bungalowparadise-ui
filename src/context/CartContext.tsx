import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  image: string
  checkIn: Date
  checkOut: Date
  type?: string
  capacity?: number
  bathrooms?: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("bungalow-cart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        // Convert ISO date strings back to Date objects
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          checkIn: new Date(item.checkIn),
          checkOut: new Date(item.checkOut),
        }))
        setCartItems(cartWithDates)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setCartItems([])
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      // Convert Date objects to ISO strings for storage
      const cartForStorage = cartItems.map((item) => ({
        ...item,
        checkIn: item.checkIn instanceof Date ? item.checkIn.toISOString() : item.checkIn,
        checkOut: item.checkOut instanceof Date ? item.checkOut.toISOString() : item.checkOut,
      }))
      localStorage.setItem("bungalow-cart", JSON.stringify(cartForStorage))
    }
  }, [cartItems, isInitialized])

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Check if item already exists with same dates
      const existingItemIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          new Date(cartItem.checkIn).toDateString() === new Date(item.checkIn).toDateString() &&
          new Date(cartItem.checkOut).toDateString() === new Date(item.checkOut).toDateString(),
      )

      if (existingItemIndex !== -1) {
        // Item already exists, don't add it again
        return prevItems
      }

      // Add new item
      return [
        ...prevItems,
        {
          ...item,
          checkIn: new Date(item.checkIn),
          checkOut: new Date(item.checkOut),
        },
      ]
    })
  }

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((_, index) => index !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const checkIn = new Date(item.checkIn)
      const checkOut = new Date(item.checkOut)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      return total + item.price * nights
    }, 0)
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
