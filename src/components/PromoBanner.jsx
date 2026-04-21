import { Container } from "react-bootstrap";
import "./PromoBanner.css";

function PromoBanner() {
  return (
    <section className="py-0 my-5">
      <Container fluid="lg">
        <div className="promo-banner">
          <div className="promo-banner__overlay" />
          <p className="promo-banner__subtitle">Nueva Colección</p>
          <h2 className="promo-banner__title">Primavera 2025</h2>
          <p className="promo-banner__description">Elegancia que trasciende cada estación</p>
          <button className="promo-banner__btn">Explorar</button>
        </div>
      </Container>
    </section>
  );
}

export default PromoBanner;
