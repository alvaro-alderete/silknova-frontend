import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import api from "../config/axios";
import "./Contact.css";

function Contact() {
  const [enviado, setEnviado] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setErrorServidor("");
    try {
      await api.post("/contact", data);
      setEnviado(true);
      reset();
    } catch (err) {
      setErrorServidor(
        err.response?.data?.mensaje || "Error al enviar el mensaje. Intentá de nuevo."
      );
    }
  };

  return (
    <div className="contact-page">
      <Container>
        <div className="contact-header">
          <p className="contact-subtitulo">¿Tenés alguna consulta?</p>
          <h1 className="contact-titulo">Contacto</h1>
        </div>

        <Row className="g-5">
          <Col xs={12} lg={5}>
            <div className="contact-info-card">
              <h5 className="contact-info-titulo">Información de contacto</h5>
              <p className="contact-info-desc">
                Estamos para ayudarte. Completá el formulario o contactanos directamente.
              </p>

              <div className="contact-info-item">
                <FaEnvelope size={16} className="contact-info-icono" />
                <span>info@silknova.com</span>
              </div>
              <div className="contact-info-item">
                <FaPhone size={16} className="contact-info-icono" />
                <span>+54 381 000-0000</span>
              </div>
              <div className="contact-info-item">
                <FaMapMarkerAlt size={16} className="contact-info-icono" />
                <span>Tucumán, Argentina</span>
              </div>

              <div className="contact-info-redes">
                <a href="#" className="contact-red-link"><FaInstagram size={18} /></a>
                <a href="#" className="contact-red-link"><FaFacebookF size={18} /></a>
                <a href="#" className="contact-red-link"><FaWhatsapp size={18} /></a>
              </div>
            </div>
          </Col>

          <Col xs={12} lg={7}>
            <div className="contact-form-card">
              {enviado ? (
                <div className="contact-success">
                  <div className="contact-success-circle">
                    <FaCheckCircle size={30} color="#38a169" />
                  </div>
                  <h5 className="contact-success-titulo">¡Mensaje enviado!</h5>
                  <p className="contact-success-desc">
                    Recibimos tu consulta y te responderemos a la brevedad.
                  </p>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="contact-btn-nuevo"
                    onClick={() => setEnviado(false)}
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <>
                  {errorServidor && (
                    <Alert variant="danger" className="contact-alert">
                      {errorServidor}
                    </Alert>
                  )}

                  <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="contact-label">Nombre</Form.Label>
                          <Form.Control
                            className={`contact-input${errors.nombre ? " is-invalid" : ""}`}
                            placeholder="Juan Pérez"
                            isInvalid={!!errors.nombre}
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                          />
                          <Form.Control.Feedback type="invalid" className="contact-feedback">
                            {errors.nombre?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="contact-label">Email</Form.Label>
                          <Form.Control
                            type="email"
                            className={`contact-input${errors.email ? " is-invalid" : ""}`}
                            placeholder="juan@email.com"
                            isInvalid={!!errors.email}
                            {...register("email", {
                              required: "El email es obligatorio",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Ingresá un email válido",
                              },
                            })}
                          />
                          <Form.Control.Feedback type="invalid" className="contact-feedback">
                            {errors.email?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="contact-label">Asunto</Form.Label>
                          <Form.Control
                            className={`contact-input${errors.asunto ? " is-invalid" : ""}`}
                            placeholder="Consulta sobre pedido"
                            isInvalid={!!errors.asunto}
                            {...register("asunto", { required: "El asunto es obligatorio" })}
                          />
                          <Form.Control.Feedback type="invalid" className="contact-feedback">
                            {errors.asunto?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="contact-label">Mensaje</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            className={`contact-input${errors.mensaje ? " is-invalid" : ""}`}
                            placeholder="Escribí tu consulta acá..."
                            isInvalid={!!errors.mensaje}
                            {...register("mensaje", {
                              required: "El mensaje es obligatorio",
                              minLength: { value: 10, message: "Mínimo 10 caracteres" },
                            })}
                          />
                          <Form.Control.Feedback type="invalid" className="contact-feedback">
                            {errors.mensaje?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="contact-btn-enviar"
                        >
                          {isSubmitting
                            ? <><Spinner size="sm" className="me-2" />Enviando...</>
                            : "Enviar mensaje"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;
