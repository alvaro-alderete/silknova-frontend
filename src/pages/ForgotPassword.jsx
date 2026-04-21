import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../config/axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [errorServidor, setErrorServidor] = useState("");
  const [emailEnviado, setEmailEnviado]   = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setErrorServidor("");
    try {
      await api.post("/auth/recuperar-contrasena", { email: data.email });
      setEmailEnviado(data.email);
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        {emailEnviado ? (
          <div className="text-center">
            <div className="fp-success-circle">
              <FaCheckCircle size={28} color="#38a169" />
            </div>
            <div className="fp-title">¡Revisá tu correo!</div>
            <p className="fp-description">
              Te enviamos un enlace a <strong>{emailEnviado}</strong> para
              restablecer tu contraseña. Si no lo ves, revisá tu carpeta de spam.
            </p>
            <Link to="/" className="fp-back-link" style={{ justifyContent: "center" }}>
              <FaArrowLeft size={12} />
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="fp-icon-circle">
              <FaEnvelope size={22} color="#555" />
            </div>

            <div className="fp-title">Recuperar contraseña</div>
            <p className="fp-description">
              Ingresá el email con el que te registraste y te enviaremos
              un enlace para crear una nueva contraseña.
            </p>

            {errorServidor && (
              <Alert variant="danger" className="py-2 px-3 mb-3" style={{ fontSize: 13, borderRadius: 8 }}>
                {errorServidor}
              </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-1">
                <Form.Label className="fp-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  autoFocus
                  className={`fp-input${errors.email ? " is-invalid" : ""}`}
                  isInvalid={!!errors.email}
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresá un email válido",
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="fp-btn-primary"
              >
                {isSubmitting
                  ? <><Spinner size="sm" className="me-2" />Enviando...</>
                  : "Enviar enlace"
                }
              </Button>
            </Form>

            <Link to="/" className="fp-back-link">
              <FaArrowLeft size={12} />
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
