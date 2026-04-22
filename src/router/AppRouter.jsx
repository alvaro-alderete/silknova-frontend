import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Favorites from "../pages/Favorites";
import Cart from "../pages/Cart";
import Products from "../pages/Products";
const NotFound = () => <h1>404 Not Found</h1>;

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/favoritos" element={<Favorites />} />
      <Route path="/carrito" element={<Cart />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;