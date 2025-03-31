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
import UserReservations from "./modules/user-options/UserReservations";
import UpdateUserInfo from "./modules/user-options/UpdateUserInfo";
import PaymentMethods from "./modules/user-options/PaymentMethods";
import UserReceipts from "./modules/user-options/UserReceipts";
import ReviewsPage from "./modules/user-options/reviews/ReviewsPage";

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
                <UserReservations />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/update-info"
            element={
              <PrivateRoute>
                <UpdateUserInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/payment-methods"
            element={
              <PrivateRoute>
                <PaymentMethods />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/receipts"
            element={
              <PrivateRoute>
                <UserReceipts />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/review"
            element={
              <PrivateRoute>
                <ReviewsPage />
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
