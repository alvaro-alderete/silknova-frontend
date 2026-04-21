import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRouter from "./router/AppRouter";

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <AppRouter />
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;