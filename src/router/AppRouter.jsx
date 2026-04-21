import { Routes, Route } from "react-router-dom";

const Home = () => <h1 data-aos="fade-up">Home SilkNova</h1>;
const Products = () => <h1>Productos</h1>;
const NotFound = () => <h1>404 Not Found</h1>;

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;