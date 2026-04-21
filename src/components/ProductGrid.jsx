import { useState, useEffect } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../config/axios.js";
import ProductCard from "./ProductCard.jsx";
import "./ProductGrid.css";

function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", { params: { page: paginaActual, limit: 15 } });
        setProductos(data.productos);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [paginaActual]);

  if (loading) return (
    <section className="py-5 product-grid">
      <Container>
        <Row xs={2} md={3} lg={5} className="g-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <Col key={i}>
              <Skeleton height={280} style={{ aspectRatio: "3/4" }} />
              <Skeleton width="60%" className="mt-2" />
              <Skeleton width="40%" />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  return (
    <section className="py-5 product-grid">
      <Container>
        <h2 className="text-center mb-1 product-grid__title">
          Colección
        </h2>
        <p className="text-center text-muted mb-5 product-grid__subtitle">
          Piezas seleccionadas para cada ocasión
        </p>

        <Row xs={2} md={3} lg={5} className="g-3">
          {productos.map((p) => (
            <Col key={p._id}>
              <ProductCard producto={p} />
            </Col>
          ))}
        </Row>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Prev
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Pagination.Item
                  key={n}
                  active={n === paginaActual}
                  onClick={() => setPaginaActual(n)}
                >
                  {n}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={paginaActual === totalPages}
                onClick={() => setPaginaActual(paginaActual + 1)}
              />
            </Pagination>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ProductGrid;