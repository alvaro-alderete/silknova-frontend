import { useState } from "react";
import "./ProductCard.css";
import { Card, Button, Badge } from "react-bootstrap";
import { FaHeart, FaCheck } from "react-icons/fa";

function ProductCard({ producto }) {
  const [estaEnFavoritos, setEstaEnFavoritos] = useState(false);
  const [fueAgregadoAlCarrito, setFueAgregadoAlCarrito] = useState(false);

  return (
    <Card className="h-100 border-0 shadow-sm">
      <div style={{ position: "relative" }}> {/* relative needed for absolute children */}
        <Card.Img
          variant="top"
          src={producto.imagenes?.[0]}
          className="product-card__img"
        />
        {producto.precioAnterior && (
          <Badge bg="dark" className="product-card__badge">
            -{Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100)}%
          </Badge>
        )}
        <Button
          variant="light"
          size="sm"
          onClick={() => setEstaEnFavoritos(!estaEnFavoritos)}
          className="product-card__wishlist-btn"
        >
          <FaHeart color={estaEnFavoritos ? "red" : "#ccc"} />
        </Button>
      </div>

      <Card.Body className="d-flex flex-column">
        <small className="text-muted text-uppercase product-card__category">
          {producto.categoria?.nombre}
        </small>
        <Card.Title className="product-card__name">
          {producto.nombre}
        </Card.Title>
        <div className="d-flex align-items-center gap-2 mb-3">
          {producto.precioAnterior && (
            <small className="text-muted text-decoration-line-through">
              ${producto.precioAnterior.toLocaleString()}
            </small>
          )}
          <span className="fw-bold">${producto.precio.toLocaleString()}</span>
        </div>

        <Button
          variant={fueAgregadoAlCarrito ? "dark" : "outline-dark"}
          size="sm"
          className="mt-auto"
          onClick={() => setFueAgregadoAlCarrito(!fueAgregadoAlCarrito)}
        >
          {fueAgregadoAlCarrito ? <><FaCheck className="me-1" /> Agregado</> : "Comprar"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;