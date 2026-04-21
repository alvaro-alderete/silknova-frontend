import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Collapse } from "react-bootstrap";
import api from "../config/axios.js";
import "./CategoryFilter.css";

function CategoryFilter() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const btnClass = (id) =>
    `category-filter__btn ${selected === id ? "category-filter__btn--active" : "category-filter__btn--inactive"}`;

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
                onClick={() => setOpen(!open)}
                className="category-filter__toggle"
              >
                {open ? "Ocultar ▲" : "Ver todas ▼"}
              </Button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2">
              <Button size="sm" onClick={() => setSelected(null)} className={btnClass(null)}>
                Todos
              </Button>
              {categories.slice(0, 4).map((cat) => (
                <Button key={cat._id} size="sm" onClick={() => setSelected(cat._id)} className={btnClass(cat._id)}>
                  {cat.nombre}
                </Button>
              ))}
            </div>

            <Collapse in={open}>
              <div>
                <div className="d-flex flex-wrap gap-2 pt-2">
                  {categories.slice(4).map((cat) => (
                    <Button key={cat._id} size="sm" onClick={() => setSelected(cat._id)} className={btnClass(cat._id)}>
                      {cat.nombre}
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
