import ProductGrid from "../components/ProductGrid.jsx";
import PromoBanner from "../components/PromoBanner.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";

function Home() {
  return (
    <>
      <PromoBanner />
      <ProductGrid />
      <CategoryFilter />
    </>
  );
}

export default Home;