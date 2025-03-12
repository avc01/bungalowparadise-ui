import { Route, Routes } from "react-router-dom";
import LandingPage from "./modules/landing-page/LandingPage";
import MenuBar from "./modules/menu-bar/MenuBar";
import NotFoundPage from "./modules/not-found/NotFoundPage";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MenuBar />}>
          <Route index element={<LandingPage />} />

          {/* Protected route */}
          <Route
            path="/book-now"
            element={
              <PrivateRoute>
                <div>my secret page!!!</div>
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
