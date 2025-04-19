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
import { Toaster } from "@/components/ui/sonner";
import PaymentMethodPage from "./modules/user-options/cards/PaymentMethodPage";
import UserReviewPage from "./modules/user-options/reviews/UserReviewPage";
import ReservationsPage from "./modules/user-options/reservations/ReservationPage";

function App() {
  return (
    <AuthProvider>
      <Toaster />
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

          {/* User managed options */}
          <Route
            path="/user/reservations"
            element={
              <PrivateRoute>
                <ReservationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/payment-methods"
            element={
              <PrivateRoute>
                <PaymentMethodPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/review"
            element={
              <PrivateRoute>
                <UserReviewPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute adminOnly>
                <div className="p-4">Bienvenido al Panel de Administración</div>
              </PrivateRoute>
            }
          />

          {/* Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
