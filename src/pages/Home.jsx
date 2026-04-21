import ProductGrid from "../components/ProductGrid.jsx";
import PromoBanner from "../components/PromoBanner.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import FeaturedSlider from "../components/FeaturedSlider.jsx";

function Home() {
  return (
    <>
      <PromoBanner />
      <FeaturedSlider />
      <CategoryFilter />
      <ProductGrid />
    </>
  );
}

export default Home;