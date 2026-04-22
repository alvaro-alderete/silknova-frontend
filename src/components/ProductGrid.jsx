import { useState, useEffect } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../config/axios.js";
import ProductCard from "./ProductCard.jsx";
import "./ProductGrid.css";

function ProductGrid() {
  const [listaProductos, setListaProductos] = useState([]);
  const [totalDePaginas, setTotalDePaginas] = useState(1);
  const [numeroPaginaActual, setNumeroPaginaActual] = useState(1);
  const [estaCargando, setEstaCargando] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setEstaCargando(true);
      try {
        const { data } = await api.get("/products", { params: { page: numeroPaginaActual, limit: 15 } });
        setListaProductos(data.productos);
        setTotalDePaginas(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setEstaCargando(false);
      }
    };
    fetchProducts();
  }, [numeroPaginaActual]);

  if (estaCargando) return (
    <section className="py-5 product-grid">
      <Container>
        <Row xs={2} md={3} lg={5} className="g-3">
          {Array.from({ length: 15 }).map((_, indice) => (
            <Col key={indice}>
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
          {listaProductos.map((producto) => (
            <Col key={producto._id}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>

        {totalDePaginas > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Prev
                disabled={numeroPaginaActual === 1}
                onClick={() => setNumeroPaginaActual(numeroPaginaActual - 1)}
              />
              {Array.from({ length: totalDePaginas }, (_, i) => i + 1).map((numeroPagina) => (
                <Pagination.Item
                  key={numeroPagina}
                  active={numeroPagina === numeroPaginaActual}
                  onClick={() => setNumeroPaginaActual(numeroPagina)}
                >
                  {numeroPagina}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={numeroPaginaActual === totalDePaginas}
                onClick={() => setNumeroPaginaActual(numeroPaginaActual + 1)}
              />
            </Pagination>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ProductGrid;
