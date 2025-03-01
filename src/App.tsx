import { Route, Routes } from "react-router-dom";
import LandingPage from "./modules/landing-page/LandingPage";
import MenuBar from "./modules/menu-bar/MenuBar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuBar />}>
        <Route index element={<LandingPage />} />
        {/* Catch all unmatched routes */}
        <Route path="*" element={<div>404</div>} />
      </Route>
    </Routes>
  );
}

export default App;
