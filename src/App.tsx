import { Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "./modules/landing-page/LandingPage";
import MenuBar from "./modules/menu-bar/MenuBar";
import NotFoundPage from "./modules/not-found/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";
import BookingsPage from "./modules/booking/BookingPage";
import CartPage from "./modules/booking/cart/CartPage";
import PaymentPage from "./modules/booking/payment/PaymentPage";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MenuBar />}>
          <Route index element={<LandingPage />} />

          {/* Grouped /bookings routes under CartProvider */}
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <CartProvider>
                  <Outlet />
                </CartProvider>
              </PrivateRoute>
            }
          >
            <Route index element={<BookingsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="payment" element={<PaymentPage />} />
          </Route>

          {/* Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
