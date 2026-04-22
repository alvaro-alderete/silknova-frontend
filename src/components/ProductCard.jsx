import { useState, useEffect } from "react";
import "./ProductCard.css";
import { Card, Button, Badge } from "react-bootstrap";
import { FaHeart, FaCheck } from "react-icons/fa";
import { esFavorito, toggleFavoritoAPI, onFavoritosChange } from "../utils/favoritos";
import { getUsuario, openLoginModal } from "../utils/auth";
import { agregarAlCarrito } from "../utils/carrito";
import toast from "react-hot-toast";

function ProductCard({ producto }) {
  const [enFav, setEnFav] = useState(() => esFavorito(producto._id));
  const [agregando, setAgregando] = useState(false);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    return onFavoritosChange(() => setEnFav(esFavorito(producto._id)));
  }, [producto._id]);

  const handleToggleFav = async () => {
    if (!getUsuario()) { openLoginModal(); return; }
    try { await toggleFavoritoAPI(producto); }
    catch (e) { console.error(e); }
  };

  const handleComprar = async () => {
    if (!getUsuario()) { openLoginModal(); return; }
    setAgregando(true);
    try {
      await agregarAlCarrito(producto._id);
      setAgregado(true);
      toast.success("Agregado al carrito");
      setTimeout(() => setAgregado(false), 2000);
    } catch (e) {
      console.error("Error al agregar al carrito:", e?.response?.data || e.message);
      toast.error(e?.response?.data?.mensaje || "No se pudo agregar");
    } finally {
      setAgregando(false);
    }
  };

  const categoriaLabel = producto.categoria?.nombre ?? producto.categoria;
  const talles = producto.talle ?? producto.talles ?? [];
  const stock = producto.stock ?? null;

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
        {producto.destacado && (
          <span className="product-card__top-badge">★ TOP</span>
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
          {categoriaLabel}
        </small>
        <Card.Title className="product-card__name">
          {producto.nombre}
        </Card.Title>
        <div className="d-flex align-items-center gap-2 mb-2">
          {producto.precioAnterior && (
            <small className="text-muted text-decoration-line-through">
              ${producto.precioAnterior.toLocaleString()}
            </small>
          )}
          <span className="fw-bold">${producto.precio.toLocaleString()}</span>
        </div>

        {talles.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {talles.slice(0, 4).map((t) => (
              <span key={t} className="product-card__talle">{t}</span>
            ))}
          </div>
        )}

        {stock !== null && stock <= 5 && stock > 0 && (
          <small className="product-card__stock-low mb-2">¡Solo {stock} disponibles!</small>
        )}

        <Button
          variant={agregado ? "dark" : "outline-dark"}
          size="sm"
          className="mt-auto"
          onClick={handleComprar}
          disabled={agregando || stock === 0}
        >
          {stock === 0 ? "Sin stock" : agregado ? <><FaCheck className="me-1" />Agregado</> : agregando ? "..." : "Agregar"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;