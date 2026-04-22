import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaCheckCircle, FaBoxOpen } from "react-icons/fa";
import "./OrderConfirmed.css";

function generarNumeroOrden() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

export default function OrderConfirmed() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    if (!state?.items) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state?.items) return null;

  const { items, subtotal, descuento, envio, total } = state;
  const numeroOrden = generarNumeroOrden();

  return (
    <div className="order-page">
      <Container>
        <div className="order-card">
          <div className="order-check">
            <FaCheckCircle size={36} color="#22c55e" />
          </div>
          <h1 className="order-titulo">¡Compra realizada!</h1>
          <p className="order-subtitulo">
            Tu pedido fue procesado correctamente.
          </p>
          <div className="order-numero">
            Número de orden: <strong>{numeroOrden}</strong>
          </div>

          <div className="order-section">
            <div className="order-section-titulo">
              <FaBoxOpen size={14} className="me-2" />
              Productos
            </div>
            {items.map((item) => (
              <Row
                key={`${item.producto._id}-${item.talle}-${item.color}`}
                className="order-item"
              >
                <Col xs={2} sm={1}>
                  <img
                    src={item.producto.imagenes?.[0]}
                    alt={item.producto.nombre}
                    className="order-item-img"
                  />
                </Col>
                <Col className="order-item-info">
                  <span className="order-item-nombre">{item.producto.nombre}</span>
                  <span className="order-item-meta">
                    {item.talle && `Talle: ${item.talle}`}
                    {item.talle && item.color && " · "}
                    {item.color && `Color: ${item.color}`}
                    {" · "}Cant: {item.cantidad}
                  </span>
                </Col>
                <Col xs="auto" className="order-item-precio">
                  ${(item.producto.precio * item.cantidad).toLocaleString()}
                </Col>
              </Row>
            ))}
          </div>

          <div className="order-resumen">
            <div className="order-resumen-fila">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            {descuento > 0 && (
              <div className="order-resumen-fila order-resumen-descuento">
                <span>Descuento</span>
                <span>-${descuento.toLocaleString()}</span>
              </div>
            )}
            <div className="order-resumen-fila">
              <span>Envío</span>
              <span>{envio > 0 ? `$${envio.toLocaleString()}` : "A coordinar"}</span>
            </div>
            <div className="order-resumen-fila order-resumen-total">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <p className="order-info">
            Te enviaremos un email con los detalles del pedido a la brevedad.
          </p>

          <Link to="/">
            <Button className="order-btn">Volver al inicio</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
