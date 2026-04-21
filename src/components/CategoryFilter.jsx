import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Collapse } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../config/axios.js";
import "./CategoryFilter.css";

function CategoryFilter() {
  const [listaCategorias, setListaCategorias] = useState([]);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setListaCategorias(data);
      } catch (error) {
        console.error(error);
      } finally {
        setEstaCargando(false);
      }
    };
    fetchCategories();
  }, []);

  const obtenerClaseBoton = (id) =>
    `category-filter__btn ${categoriaSeleccionada === id ? "category-filter__btn--active" : "category-filter__btn--inactive"}`;

  if (estaCargando) return (
    <section className="py-4 category-filter">
      <Container>
        <div className="d-flex gap-2">
          {Array.from({ length: 5 }).map((_, indice) => (
            <Skeleton key={indice} height={30} width={80} />
          ))}
        </div>
      </Container>
    </section>
  );

  return (
    <section className="py-4 category-filter">
      <Container>
        <Row>
          <Col xs={12} lg={8}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="category-filter__label">Categorías</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => setPanelAbierto(!panelAbierto)}
                className="category-filter__toggle"
              >
                {panelAbierto ? "Ocultar ▲" : "Ver todas ▼"}
              </Button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2">
              <Button size="sm" onClick={() => setCategoriaSeleccionada(null)} className={obtenerClaseBoton(null)}>
                Todos
              </Button>
              {listaCategorias.slice(0, 4).map((categoria) => (
                <Button key={categoria._id} size="sm" onClick={() => setCategoriaSeleccionada(categoria._id)} className={obtenerClaseBoton(categoria._id)}>
                  {categoria.nombre}
                </Button>
              ))}
            </div>

            <Collapse in={panelAbierto}>
              <div>
                <div className="d-flex flex-wrap gap-2 pt-2">
                  {listaCategorias.slice(4).map((categoria) => (
                    <Button key={categoria._id} size="sm" onClick={() => setCategoriaSeleccionada(categoria._id)} className={obtenerClaseBoton(categoria._id)}>
                      {categoria.nombre}
                    </Button>
                  ))}
                </div>
              </div>
            </Collapse>
          </Col>

          <Col lg={4} className="d-none d-lg-flex align-items-center">
            <div className="category-filter__ad">
              <div className="category-filter__ad-overlay" />
              <p className="category-filter__ad-tag">Envío gratis</p>
              <p className="category-filter__ad-title">En compras +$80.000</p>
              <p className="category-filter__ad-subtitle">Todo el país · Mercado Envíos</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default CategoryFilter;
