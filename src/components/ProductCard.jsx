import { useState, useEffect } from "react";
import "./ProductCard.css";
import { Card, Button, Badge } from "react-bootstrap";
import { FaHeart, FaCheck } from "react-icons/fa";
import { esFavorito, toggleFavoritoAPI, onFavoritosChange } from "../utils/favoritos";
import { getUsuario, openLoginModal } from "../utils/auth";

function ProductCard({ producto }) {
  const [enFav, setEnFav] = useState(() => esFavorito(producto._id));
  const [fueAgregadoAlCarrito, setFueAgregadoAlCarrito] = useState(false);

  useEffect(() => {
    return onFavoritosChange(() => setEnFav(esFavorito(producto._id)));
  }, [producto._id]);

  const handleToggleFav = async () => {
    if (!getUsuario()) { openLoginModal(); return; }
    try { await toggleFavoritoAPI(producto); }
    catch (e) { console.error(e); }
  };

  const handleComprar = () => {
    if (!getUsuario()) { openLoginModal(); return; }
    setFueAgregadoAlCarrito(!fueAgregadoAlCarrito);
  };

  return (
    <Card className="h-100 border-0 shadow-sm">
      <div style={{ position: "relative" }}>
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
          onClick={handleToggleFav}
          className="product-card__wishlist-btn"
        >
          <FaHeart color={enFav ? "red" : "#ccc"} />
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
          onClick={handleComprar}
        >
          {fueAgregadoAlCarrito ? <><FaCheck className="me-1" /> Agregado</> : "Comprar"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;