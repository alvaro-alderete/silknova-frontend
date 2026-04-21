import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ModalLogin.css";

function ModalLogin({ show, onHide, onSwitchToRegistro }) {
  const [verPassword, setVerPassword] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setErrorServidor("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.mensaje || "Error al iniciar sesión");

      localStorage.setItem("token", json.token);
      localStorage.setItem("usuario", JSON.stringify({ nombre: json.nombre, email: json.email }));
      handleClose();
      window.location.reload();
    } catch (err) {
      setErrorServidor(err.message);
    }
  };

  const handleClose = () => {
    reset();
    setErrorServidor("");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0"
      dialogClassName="auth-modal-dialog"
      backdropClassName="modal-backdrop-blur"
    >
      <div className="auth-modal">
        <div className="auth-modal-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="auth-modal-title">Iniciar sesión</div>
              <div className="auth-modal-subtitle">Bienvenido de vuelta</div>
            </div>
            <button className="auth-modal-close" onClick={handleClose}>×</button>
          </div>
        </div>

        <div className="auth-modal-body">
          {errorServidor && (
            <Alert variant="danger" className="py-2 px-3 mb-3" style={{ fontSize: 13, borderRadius: 8 }}>
              {errorServidor}
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">
                <FaEnvelope size={10} className="me-1" /> Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                className={`auth-input${errors.email ? " is-invalid" : ""}`}
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

            <Form.Group className="mb-2">
              <Form.Label className="auth-label">
                <FaLock size={10} className="me-1" /> Contraseña
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={verPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`auth-input auth-input-password${errors.password ? " is-invalid" : ""}`}
                  isInvalid={!!errors.password}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  })}
                />
                <button
                  type="button"
                  className={`auth-eye-btn${errors.password ? " is-invalid" : ""}`}
                  onClick={() => setVerPassword(!verPassword)}
                >
                  {verPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
                <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                  {errors.password?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="text-end mb-4">
              <Link
                to="/forgot-password"
                style={{ fontSize: 12, color: "#888", textDecoration: "none" }}
                onClick={handleClose}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="auth-btn-primary"
            >
              {isSubmitting
                ? <><Spinner size="sm" className="me-2" />Ingresando...</>
                : "Ingresar"
              }
            </Button>
          </Form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span>¿No tenés cuenta?</span>
            <div className="auth-divider-line" />
          </div>
          <div className="text-center">
            <button
              className="auth-switch-btn"
              onClick={() => { handleClose(); onSwitchToRegistro(); }}
            >
              Crear cuenta nueva
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalLogin;
