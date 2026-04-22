import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaShoppingCart, FaTrash, FaArrowLeft, FaCreditCard, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  cargarCarrito, onCarritoChange,
  actualizarCantidad, eliminarItem, vaciarCarrito,
} from "../utils/carrito";
import ShippingCalculator from "../components/ShippingCalculator";
import { CAMPOS_TARJETA } from "../constants";
import toast from "react-hot-toast";
import "./Cart.css";

function SkeletonCart() {
  return <>{[1, 2, 3].map((i) => <div key={i} className="cart-skeleton-row" />)}</>;
}

function ModalPago({ show, onHide, total, onConfirmar }) {
  const [form, setForm]             = useState({ nombre: "", numero: "", vencimiento: "", cvv: "" });
  const [procesando, setProcesando] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const formularioCompleto = CAMPOS_TARJETA.every((c) => form[c].trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcesando(false);
    onConfirmar();
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="border-0">
      <div className="modal-pago">
        <div className="modal-pago__titulo">
          <FaCreditCard className="me-2" />Datos de pago
        </div>
        <div className="modal-pago__subtitulo">
          <FaLock size={11} className="me-1" />Pago simulado — no se procesará ningún cobro
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="modal-pago__label">Nombre en la tarjeta</Form.Label>
            <Form.Control size="sm" name="nombre" placeholder="Juan García" value={form.nombre} onChange={handleChange} className="modal-pago__input" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="modal-pago__label">Número de tarjeta</Form.Label>
            <Form.Control size="sm" name="numero" placeholder="1234 5678 9012 3456" maxLength={19} value={form.numero} onChange={handleChange} className="modal-pago__input" />
          </Form.Group>
          <Row className="g-2 mb-4">
            <Col>
              <Form.Label className="modal-pago__label">Vencimiento</Form.Label>
              <Form.Control size="sm" name="vencimiento" placeholder="MM/AA" maxLength={5} value={form.vencimiento} onChange={handleChange} className="modal-pago__input" />
            </Col>
            <Col>
              <Form.Label className="modal-pago__label">CVV</Form.Label>
              <Form.Control size="sm" name="cvv" placeholder="123" maxLength={4} value={form.cvv} onChange={handleChange} className="modal-pago__input" />
            </Col>
          </Row>
          <Button type="submit" disabled={procesando || !formularioCompleto} className="cart-btn-pagar">
            {procesando
              ? <><Spinner size="sm" className="me-2" />Procesando...</>
              : `Pagar $${total?.toLocaleString()}`}
          </Button>
        </Form>
      </div>
    </Modal>
  );
}

function PaginaCarrito() {
  const [items, setItems]       = useState([]);
  const [summary, setSummary]   = useState({ subtotal: 0, descuento: 0, total: 0 });
  const [envio, setEnvio]             = useState(0);
  const [direccionCompleta, setDireccionCompleta] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [showPago, setShowPago] = useState(false);
  const navigate = useNavigate();

  const recargar = async () => {
    try {
      const data = await cargarCarrito();
      setItems(data?.items || []);
      setSummary({
        subtotal:  data?.subtotal  || 0,
        descuento: data?.descuento || 0,
        total:     data?.total     || 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    recargar();
    return onCarritoChange(recargar);
  }, []);

  const handleCantidad = async (item, delta) => {
    const nueva = item.cantidad + delta;
    if (nueva < 1) return;
    try { await actualizarCantidad(item.producto._id, nueva, item.talle, item.color); }
    catch (e) { toast.error(e?.response?.data?.mensaje || "No se pudo actualizar la cantidad"); }
  };

  const handleEliminar = async (item) => {
    try { await eliminarItem(item.producto._id, item.talle, item.color); }
    catch { toast.error("No se pudo eliminar"); }
  };

  const handleConfirmarPago = async () => {
    setShowPago(false);
    const resumen = { items, ...summary, envio, total: summary.total + envio };
    await vaciarCarrito();
    navigate("/orden-confirmada", { state: resumen });
  };

  const { subtotal, descuento, total } = summary;
  const totalConEnvio = total + envio;

  return (
    <div className="cart-page">
      <Container>
        <div className="cart-page__header">
          <div className="cart-title"><FaShoppingCart size={20} className="me-2" />Mi carrito</div>
          {!cargando && items.length > 0 && (
            <span className="cart-page__contador">{items.length} producto{items.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {cargando && <SkeletonCart />}

        {!cargando && items.length === 0 && (
          <div className="cart-card cart-empty-box">
            <FaShoppingCart size={40} color="#ddd" />
            <div className="cart-empty-title">Tu carrito está vacío</div>
            <p className="cart-empty-desc">Agregá productos desde la tienda para verlos acá.</p>
            <Link to="/"><Button className="cart-btn-explorar">
              <FaArrowLeft size={12} className="me-2" />Explorar productos
            </Button></Link>
          </div>
        )}

        {!cargando && items.length > 0 && (
          <Row className="g-4">
            <Col xs={12} lg={8}>
              <div className="cart-card">
                {items.map((item, i) => (
                  <div key={`${item.producto._id}-${item.talle}-${item.color}`}>
                    <div className="d-flex gap-3 align-items-start">
                      <img src={item.producto.imagenes?.[0]} alt={item.producto.nombre} className="cart-item-img" />
                      <div className="flex-grow-1">
                        <div className="cart-item-name">{item.producto.nombre}</div>
                        <div className="cart-item-meta">
                          {item.talle && <span className="me-2">Talle: {item.talle}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <div className="cart-item-precios">
                          {item.producto.precioAnterior && (
                            <span className="cart-old-price">${item.producto.precioAnterior.toLocaleString()}</span>
                          )}
                          <span className="cart-price">${item.producto.precio.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="cart-item-acciones">
                        <button onClick={() => handleEliminar(item)} className="cart-delete-btn">
                          <FaTrash size={13} />
                        </button>
                        <div className="d-flex align-items-center gap-2 cart-qty-box">
                          <button onClick={() => handleCantidad(item, -1)} className="cart-qty-btn">−</button>
                          <span className="cart-qty-valor">{item.cantidad}</span>
                          <button onClick={() => handleCantidad(item, +1)} className="cart-qty-btn">+</button>
                        </div>
                        <span className="cart-item-subtotal">${(item.producto.precio * item.cantidad).toLocaleString()}</span>
                      </div>
                    </div>
                    {i < items.length - 1 && <hr className="cart-divider" />}
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={12} lg={4}>
              <div className="cart-card">
                <div className="cart-summary-title">Resumen del pedido</div>

                <div className="cart-summary-fila">
                  <span className="cart-summary-label">Subtotal</span>
                  <span className="cart-summary-value">${subtotal.toLocaleString()}</span>
                </div>
                {descuento > 0 && (
                  <div className="cart-summary-fila">
                    <span className="cart-discount-label">Descuento</span>
                    <span className="cart-discount-value">-${descuento.toLocaleString()}</span>
                  </div>
                )}
                <div className="cart-summary-fila">
                  <span className="cart-summary-label">Envío</span>
                  <span className="cart-summary-value">
                    {envio > 0 ? `$${envio.toLocaleString()}` : "—"}
                  </span>
                </div>

                <ShippingCalculator
                  onEnvioCalculado={setEnvio}
                  onDireccionCompleta={setDireccionCompleta}
                />

                <hr className="cart-hr" />

                <div className="cart-summary-fila cart-total-fila">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-value">${totalConEnvio.toLocaleString()}</span>
                </div>

                <Button
                  className="cart-btn-pagar mt-3"
                  onClick={() => setShowPago(true)}
                  disabled={!direccionCompleta}
                >
                  <FaCreditCard className="me-2" />Continuar al pago
                </Button>
                <Link to="/">
                  <Button variant="link" className="cart-btn-seguir">
                    <FaArrowLeft size={11} className="me-1" />Seguir comprando
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      <ModalPago
        show={showPago}
        onHide={() => setShowPago(false)}
        total={totalConEnvio}
        onConfirmar={handleConfirmarPago}
      />
    </div>
  );
}

export default PaginaCarrito;
