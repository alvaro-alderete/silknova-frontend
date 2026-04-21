import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer pt-5 pb-3 mt-5">
      <Container>
        <Row className="mb-4">
          <Col lg={3} className="d-none d-lg-block">
            <img
              src="/logo.png"
              alt="SilkNova"
              className="footer-logo"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="footer-brand">
              SilkNova
            </span>
            <p className="footer-tagline">
              Moda y estilo para cada ocasión.
            </p>
          </Col>

          <Col xs={6} lg={2}>
            <h6 className="footer-heading">Navegación</h6>
            <ul className="list-unstyled footer-links">
              {[["Home", "/"], ["Destacado", "/destacado"], ["Contacto", "/contacto"], ["Favoritos", "/favoritos"]].map(([label, href]) => (
                <li key={label} className="mb-2">
                  <a href={href} className="footer-link">{label}</a>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={6} lg={2}>
            <h6 className="footer-heading">Ayuda</h6>
            <ul className="list-unstyled footer-links">
              {[["Preguntas frecuentes", "/faq"], ["Envíos", "/envios"], ["Devoluciones", "/devoluciones"], ["Términos y condiciones", "/terminos"]].map(([label, href]) => (
                <li key={label} className="mb-2">
                  <a href={href} className="footer-link">{label}</a>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} lg={3} className="mt-4 mt-lg-0">
            <h6 className="footer-heading">Contacto</h6>
            <p className="footer-contact-text">info@silknova.com</p>
            <p className="footer-contact-text">+54 381 000-0000</p>

            <div className="footer-socials">
              {[[FaInstagram, "#"], [FaFacebookF, "#"], [FaTwitter, "#"], [FaWhatsapp, "#"]].map(([Icon, href], i) => (
                <a key={i} href={href} className="footer-social-link">
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <div className="footer-datafiscal">
              <p className="footer-datafiscal-label">Data Fiscal</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=DataFiscalSilkNova"
                alt="QR Data Fiscal"
                className="footer-datafiscal-qr"
              />
            </div>
          </Col>
        </Row>

        <Row className="d-flex d-lg-none text-center mb-4">
          <Col>
            <div className="footer-mobile-socials">
              {[[FaInstagram, "#"], [FaFacebookF, "#"], [FaTwitter, "#"], [FaWhatsapp, "#"]].map(([Icon, href], i) => (
                <a key={i} href={href} className="footer-social-link">
                  <Icon size={22} />
                </a>
              ))}
            </div>
            <span className="footer-mobile-brand">SilkNova</span>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row>
          <Col className="text-center footer-copy">
            © {new Date().getFullYear()} SilkNova. Todos los derechos reservados.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
