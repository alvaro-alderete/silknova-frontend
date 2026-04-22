import { useState, useEffect } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { FaTruck, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { PRECIO_ENVIO_GBA, PRECIO_ENVIO_OTRO, ZONAS_GBA, CAMPOS_DIRECCION } from "../constants";
import "./ShippingCalculator.css";

function ShippingCalculator({ onEnvioCalculado, onDireccionCompleta }) {
  const [form, setForm] = useState({
    calle: "", numero: "", pisodepto: "", ciudad: "", provincia: "", cp: "",
  });
  const [cpCargando, setCpCargando]   = useState(false);
  const [cpResultado, setCpResultado] = useState(null);
  const [cpError, setCpError]         = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevo = { ...form, [name]: value };
    setForm(nuevo);

    if (name === "cp") {
      setCpResultado(null);
      setCpError("");
      onEnvioCalculado(0);
    }

    const completo = CAMPOS_DIRECCION.every((c) => (c === "cp" ? cpResultado !== null : nuevo[c].trim() !== ""));
    onDireccionCompleta(completo && cpResultado !== null);
  };

  useEffect(() => {
    const cp = form.cp.replace(/\D/g, "");
    if (cp.length < 4) return;

    const timer = setTimeout(async () => {
      setCpCargando(true);
      setCpError("");
      try {
        const res = await fetch(`https://api.zippopotam.us/ar/${cp}`);
        if (res.status === 404) {
          setCpError("Código postal no encontrado.");
          onEnvioCalculado(0);
          onDireccionCompleta(false);
          return;
        }
        const data      = await res.json();
        const lugar     = data.places?.[0];
        const provincia = lugar.state.toLowerCase();
        const costo     = ZONAS_GBA.some((z) => provincia.includes(z)) ? PRECIO_ENVIO_GBA : PRECIO_ENVIO_OTRO;
        const resultado = { localidad: lugar["place name"], provincia: lugar.state, costo };
        setCpResultado(resultado);
        onEnvioCalculado(costo);

        const completo = CAMPOS_DIRECCION.every((c) =>
          c === "cp" ? true : form[c].trim() !== ""
        );
        onDireccionCompleta(completo);
      } catch {
        setCpError("Error al consultar el código postal.");
        onEnvioCalculado(0);
        onDireccionCompleta(false);
      } finally {
        setCpCargando(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [form.cp]);

  return (
    <div className="shipping">
      <div className="shipping__header">
        <FaTruck size={14} className="shipping__icono" />
        <span className="shipping__titulo">Dirección de envío</span>
      </div>

      <Row className="g-2">
        <Col xs={8}>
          <Form.Control
            name="calle"
            placeholder="Calle *"
            value={form.calle}
            onChange={handleChange}
            className="shipping__input"
          />
        </Col>
        <Col xs={4}>
          <Form.Control
            name="numero"
            placeholder="Número *"
            value={form.numero}
            onChange={handleChange}
            className="shipping__input"
          />
        </Col>
        <Col xs={12}>
          <Form.Control
            name="pisodepto"
            placeholder="Piso / Depto (opcional)"
            value={form.pisodepto}
            onChange={handleChange}
            className="shipping__input"
          />
        </Col>
        <Col xs={12}>
          <Form.Control
            name="ciudad"
            placeholder="Ciudad *"
            value={form.ciudad}
            onChange={handleChange}
            className="shipping__input"
          />
        </Col>
        <Col xs={7}>
          <Form.Control
            name="provincia"
            placeholder="Provincia *"
            value={form.provincia}
            onChange={handleChange}
            className="shipping__input"
          />
        </Col>
        <Col xs={5}>
          <div className="shipping__cp-wrapper">
            <Form.Control
              name="cp"
              inputMode="numeric"
              placeholder="Cód. Postal *"
              maxLength={8}
              value={form.cp}
              onChange={(e) => handleChange({ target: { name: "cp", value: e.target.value.replace(/\D/g, "") } })}
              className={`shipping__input ${cpError ? "shipping__input--error" : ""} ${cpResultado ? "shipping__input--ok" : ""}`}
            />
            {cpCargando && <Spinner size="sm" className="shipping__cp-spinner" />}
            {!cpCargando && cpResultado && <FaCheckCircle size={13} className="shipping__cp-ok" />}
            {!cpCargando && cpError && <FaExclamationCircle size={13} className="shipping__cp-error-icon" />}
          </div>
        </Col>
      </Row>

      {cpError && (
        <div className="shipping__error">
          <FaExclamationCircle size={11} className="me-1" />{cpError}
        </div>
      )}

      {cpResultado && (
        <div className="shipping__resultado">
          <FaCheckCircle size={12} className="shipping__resultado-icono" />
          <div>
            <span className="shipping__localidad">{cpResultado.localidad}, {cpResultado.provincia}</span>
            <span className="shipping__costo">Envío: ${cpResultado.costo.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="shipping__ml-banner">
        <img
          src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.5/mercadolibre/logo__large_plus@2x.png"
          alt="Mercado Libre"
          className="shipping__ml-logo"
        />
        <span className="shipping__ml-texto">Envíos a todo el país · 3 a 7 días hábiles</span>
      </div>
    </div>
  );
}

export default ShippingCalculator;
