import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getFavoritosLS, cargarFavoritos, onFavoritosChange } from "../utils/favoritos";
import ProductCard from "../components/ProductCard";

const styles = {
  page: { minHeight: "calc(100vh - 160px)", background: "#fafafa", paddingTop: "2rem", paddingBottom: "3rem" },
  pageTitle: { fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "1.8rem", letterSpacing: "-0.5px", color: "#111" },
  subtitle: { fontSize: 14, color: "#888", marginTop: 4 },
  emptyBox: { background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", padding: "4rem 2rem", textAlign: "center", marginTop: "2rem" },
  emptyIcon: { width: 72, height: 72, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" },
  emptyTitle: { fontFamily: "'Georgia', serif", fontSize: "1.3rem", fontWeight: 700, color: "#111", marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: "#888", marginBottom: "1.5rem" },
  btnVolver: { background: "#111", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 14 },
  skeletonCard: { height: 300, borderRadius: 12, background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" },
};

function SkeletonGrid() {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <Row className="g-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Col key={i} xs={6} md={4} lg={3}><div style={styles.skeletonCard} /></Col>
        ))}
      </Row>
    </>
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
    <div style={styles.page}>
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <div style={styles.pageTitle}>
              <FaHeart size={20} color="#e53e3e" className="me-2" />
              Mis favoritos
            </div>
            {!cargando && (
              <div style={styles.subtitle}>
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
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}><FaHeart size={28} color="#e53e3e" /></div>
            <div style={styles.emptyTitle}>Todavía no guardaste nada</div>
            <p style={styles.emptyDesc}>Tocá el corazón en cualquier producto para guardarlo acá y encontrarlo fácilmente después.</p>
            <Link to="/"><Button style={styles.btnVolver}><FaArrowLeft size={12} className="me-2" />Explorar productos</Button></Link>
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
