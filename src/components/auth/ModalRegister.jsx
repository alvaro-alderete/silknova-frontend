import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import api from "../../config/axios";
import { saveSession } from "../../utils/auth";
import "./ModalRegister.css";

const fuerzaConfig = [
  { label: "Muy débil", color: "#e53e3e", width: "25%" },
  { label: "Débil",     color: "#ed8936", width: "50%" },
  { label: "Buena",     color: "#48bb78", width: "75%" },
  { label: "Fuerte",    color: "#38a169", width: "100%" },
];

const calcularFuerza = (pass = "") => {
  let puntos = 0;
  if (pass.length >= 6) puntos++;
  if (/[A-Z]/.test(pass)) puntos++;
  if (/[0-9]/.test(pass)) puntos++;
  return puntos;
};

function ModalRegister({ show, onHide, onSwitchToLogin }) {
  const [verPass, setVerPass]             = useState(false);
  const [verConfirmar, setVerConfirmar]   = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [exito, setExito]                 = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const passwordActual = watch("password", "");
  const fuerza = calcularFuerza(passwordActual);

  const onSubmit = async (data) => {
    setErrorServidor("");
    try {
      const { data: json } = await api.post("/auth/registro", {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      });
      saveSession(json.token, { nombre: json.nombre, email: json.email });
      setExito(true);
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      setErrorServidor(err.response?.data?.mensaje || err.response?.data?.message || err.message);
    }
  };

  const handleClose = () => {
    reset();
    setErrorServidor("");
    setExito(false);
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
              <div className="auth-modal-title">Crear cuenta</div>
              <div className="auth-modal-subtitle">Es rápido y gratuito</div>
            </div>
            <button className="auth-modal-close" onClick={handleClose}>×</button>
          </div>
        </div>

        <div className="auth-modal-body">
          {exito && (
            <Alert variant="success" className="py-2 px-3 mb-3" style={{ fontSize: 13, borderRadius: 8 }}>
              ✅ ¡Cuenta creada! Ingresando...
            </Alert>
          )}
          {errorServidor && (
            <Alert variant="danger" className="py-2 px-3 mb-3" style={{ fontSize: 13, borderRadius: 8 }}>
              {errorServidor}
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">
                <FaUser size={10} className="me-1" /> Nombre
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                className={`auth-input${errors.nombre ? " is-invalid" : ""}`}
                isInvalid={!!errors.nombre}
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: {
                    value: /^[a-zA-Zà-üÀ-Ü\s]+$/,
                    message: "Solo letras y espacios",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Form.Group>

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
                  maxLength: { value: 100, message: "El email es demasiado largo" },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresá un email válido (ej: nombre@dominio.com)",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label className="auth-label">
                <FaLock size={10} className="me-1" /> Contraseña
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={verPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`auth-input auth-input-password${errors.password ? " is-invalid" : ""}`}
                  isInvalid={!!errors.password}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                    maxLength: { value: 64, message: "Máximo 64 caracteres" },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Debe tener al menos una mayúscula y un número",
                    },
                  })}
                />
                <button
                  type="button"
                  className={`auth-eye-btn${errors.password ? " is-invalid" : ""}`}
                  onClick={() => setVerPass(!verPass)}
                >
                  {verPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
                <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                  {errors.password?.message}
                </Form.Control.Feedback>
              </InputGroup>

              {passwordActual && (
                <div className="mt-1">
                  <div className="strength-bar-track">
                    <div
                      className="strength-bar"
                      style={{ width: fuerzaConfig[fuerza].width, background: fuerzaConfig[fuerza].color }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: fuerzaConfig[fuerza].color }}>
                    {fuerzaConfig[fuerza].label}
                  </span>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4 mt-3">
              <Form.Label className="auth-label">
                <FaLock size={10} className="me-1" /> Confirmar contraseña
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={verConfirmar ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`auth-input auth-input-password${errors.confirmar ? " is-invalid" : ""}`}
                  isInvalid={!!errors.confirmar}
                  {...register("confirmar", {
                    required: "Confirmá tu contraseña",
                    validate: (val) =>
                      val === passwordActual || "Las contraseñas no coinciden",
                  })}
                />
                <button
                  type="button"
                  className={`auth-eye-btn${errors.confirmar ? " is-invalid" : ""}`}
                  onClick={() => setVerConfirmar(!verConfirmar)}
                >
                  {verConfirmar ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
                <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                  {errors.confirmar?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              disabled={isSubmitting || exito}
              className="auth-btn-primary"
            >
              {isSubmitting
                ? <><Spinner size="sm" className="me-2" />Creando cuenta...</>
                : "Registrarme"
              }
            </Button>
          </Form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span>¿Ya tenés cuenta?</span>
            <div className="auth-divider-line" />
          </div>
          <div className="text-center">
            <button
              className="auth-switch-btn"
              onClick={() => { handleClose(); onSwitchToLogin(); }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalRegister;
