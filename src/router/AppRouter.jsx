import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ForgotPassword from "../pages/ForgotPassword";

const Products = () => <h1>Productos</h1>;
const NotFound = () => <h1>404 Not Found</h1>;

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;