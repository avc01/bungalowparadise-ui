import { Route, Routes } from "react-router-dom";
import LandingPage from "./modules/landing-page/LandingPage";
import MenuBar from "./modules/menu-bar/MenuBar";
import NotFoundPage from "./modules/not-found/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuBar />}>
        <Route index element={<LandingPage />} />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage/>} />
      </Route>
    </Routes>
  );
}

export default App;
