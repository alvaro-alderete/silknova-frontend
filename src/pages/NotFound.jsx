import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./NotFound.css";

export default function NotFound() {
  return (
    <Container className="notfound">
      <p className="notfound__codigo">404</p>
      <h1 className="notfound__titulo">Página no encontrada</h1>
      <p className="notfound__descripcion">
        La página que buscás no existe o fue movida.
      </p>
      <Link to="/" className="notfound__btn">Volver al inicio</Link>
    </Container>
  );
}
