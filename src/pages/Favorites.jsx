import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getFavoritosLS, cargarFavoritos, onFavoritosChange } from "../utils/favoritos";
import ProductCard from "../components/ProductCard";
import "./Favorites.css";

function SkeletonGrid() {
  return (
    <Row className="g-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Col key={i} xs={6} md={4} lg={3}><div className="fav-skeleton-card" /></Col>
      ))}
    </Row>
  );
}

function PaginaFavoritos() {
  const [favoritos, setFavoritos] = useState(getFavoritosLS);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarFavoritos().finally(() => setCargando(false));
    return onFavoritosChange(() => setFavoritos(getFavoritosLS()));
  }, []);

  const total = favoritos.length;

  return (
    <div className="fav-page">
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <div className="fav-title">
              <FaHeart size={20} color="#e53e3e" className="me-2" />
              Mis favoritos
            </div>
            {!cargando && (
              <div className="fav-subtitle">
                {total === 0
                  ? "No tenés productos guardados"
                  : `${total} producto${total !== 1 ? "s" : ""} guardado${total !== 1 ? "s" : ""}`}
              </div>
            )}
          </div>
          {total > 0 && (
            <Link to="/">
              <Button variant="outline-dark" size="sm" style={{ borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
                Seguir comprando
              </Button>
            </Link>
          )}
        </div>

        {cargando && <SkeletonGrid />}

        {!cargando && total === 0 && (
          <div className="fav-empty-box">
            <div className="fav-empty-icon"><FaHeart size={28} color="#e53e3e" /></div>
            <div className="fav-empty-title">Todavía no guardaste nada</div>
            <p className="fav-empty-desc">Tocá el corazón en cualquier producto para guardarlo acá y encontrarlo fácilmente después.</p>
            <Link to="/"><Button className="fav-btn-volver"><FaArrowLeft size={12} className="me-2" />Explorar productos</Button></Link>
          </div>
        )}

        {!cargando && total > 0 && (
          <Row className="g-3">
            {favoritos.map((producto) => (
              <Col key={producto._id} xs={6} md={4} lg={3}>
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default PaginaFavoritos;
