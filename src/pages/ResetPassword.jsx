import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaLock, FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import api from "../config/axios";
import "./ForgotPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [errorServidor, setErrorServidor] = useState("");
  const [exito, setExito] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setErrorServidor("");
    try {
      await api.post("/auth/resetear-contrasena", { token, password: data.password });
      setExito(true);
    } catch (err) {
      setErrorServidor(err.response?.data?.message || "El enlace es inválido o expiró.");
    }
  };

  if (!token) {
    return (
      <div className="fp-page">
        <div className="fp-card text-center">
          <p className="fp-description">Enlace inválido. Solicitá uno nuevo.</p>
          <Link to="/forgot-password" className="fp-back-link" style={{ justifyContent: "center" }}>
            <FaArrowLeft size={12} /> Recuperar contraseña
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <div className="fp-card">
        {exito ? (
          <div className="text-center">
            <div className="fp-success-circle">
              <FaCheckCircle size={28} color="#38a169" />
            </div>
            <div className="fp-title">¡Contraseña actualizada!</div>
            <p className="fp-description">Ya podés iniciar sesión con tu nueva contraseña.</p>
            <Link to="/" className="fp-back-link" style={{ justifyContent: "center" }}>
              <FaArrowLeft size={12} /> Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="fp-icon-circle">
              <FaLock size={20} color="#555" />
            </div>
            <div className="fp-title">Nueva contraseña</div>
            <p className="fp-description">Ingresá y confirmá tu nueva contraseña.</p>

            {errorServidor && (
              <Alert variant="danger" className="py-2 px-3 mb-3" style={{ fontSize: 13, borderRadius: 8 }}>
                {errorServidor}
              </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label className="fp-label">Nueva contraseña</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showPass ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    autoFocus
                    className={`fp-input${errors.password ? " is-invalid" : ""}`}
                    isInvalid={!!errors.password}
                    style={{ paddingRight: 40 }}
                  {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: { value: 8, message: "Mínimo 8 caracteres" },
                      maxLength: { value: 64, message: "Máximo 64 caracteres" },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d).+$/,
                        message: "Debe tener al menos una mayúscula y un número",
                      },
                    })}
                  />
                  <span
                    onClick={() => setShowPass((v) => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#888" }}
                  >
                    {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </span>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label className="fp-label">Confirmar contraseña</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repetí tu contraseña"
                    className={`fp-input${errors.confirm ? " is-invalid" : ""}`}
                    isInvalid={!!errors.confirm}
                    style={{ paddingRight: 40 }}
                    {...register("confirm", {
                      required: "Confirmá tu contraseña",
                      validate: (v) => v === watch("password") || "Las contraseñas no coinciden",
                    })}
                  />
                  <span
                    onClick={() => setShowConfirm((v) => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#888" }}
                  >
                    {showConfirm ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </span>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                    {errors.confirm?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="fp-btn-primary">
                {isSubmitting
                  ? <><Spinner size="sm" className="me-2" />Guardando...</>
                  : "Guardar contraseña"
                }
              </Button>
            </Form>

            <Link to="/" className="fp-back-link">
              <FaArrowLeft size={12} /> Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
