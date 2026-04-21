import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaHeart, FaCheck } from "react-icons/fa";

function ProductCard({ producto }) {
  const [favorito, setFavorito] = useState(false);
  const [comprado, setComprado] = useState(false);

  return (
    <Card className="h-100 border-0 shadow-sm">
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={producto.imagenes?.[0]}
          style={{ aspectRatio: "3/4", objectFit: "cover" }}
        />
        {producto.precioAnterior && (
          <Badge bg="dark" style={{ position: "absolute", top: 10, left: 10 }}>
            -{Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100)}%
          </Badge>
        )}
        <Button
          variant="light"
          size="sm"
          onClick={() => setFavorito(!favorito)}
          style={{ position: "absolute", top: 10, right: 10, borderRadius: "50%", width: 34, height: 34, padding: 0 }}
        >
          <FaHeart color={favorito ? "red" : "#ccc"} />
        </Button>
      </div>

      <Card.Body className="d-flex flex-column">
        <small className="text-muted text-uppercase" style={{ letterSpacing: 1, fontSize: 10 }}>
          {producto.categoria?.nombre}
        </small>
        <Card.Title style={{ fontSize: 14, fontFamily: "Georgia, serif" }}>
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
          variant={comprado ? "dark" : "outline-dark"}
          size="sm"
          className="mt-auto"
          onClick={() => setComprado(!comprado)}
        >
          {comprado ? <><FaCheck className="me-1" /> Agregado</> : "Comprar"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;