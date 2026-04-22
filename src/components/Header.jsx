import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaBars, FaSearch, FaQuestionCircle, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { REDES_SOCIALES } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import ModalLogin from "./auth/ModalLogin";
import ModalRegister from "./auth/ModalRegister";
import { getUsuario, clearSession, onAuthChange, onOpenLoginModal, openLoginModal } from "../utils/auth";
import { getTotalFavoritos, onFavoritosChange } from "../utils/favoritos";
import { getTotalCarrito, onCarritoChange, cargarCarrito } from "../utils/carrito";
import "./Header.css";

function Header() {
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState(getUsuario);
  const [cantidadFavoritos, setCantidadFavoritos] = useState(getTotalFavoritos);
  const [cantidadCarrito, setCantidadCarrito] = useState(getTotalCarrito);

  useEffect(() => {
    if (getUsuario()) cargarCarrito();
    const unsubAuth  = onAuthChange(() => setUsuario(getUsuario()));
    const unsubFav   = onFavoritosChange(() => setCantidadFavoritos(getTotalFavoritos()));
    const unsubCart  = onCarritoChange(() => setCantidadCarrito(getTotalCarrito()));
    const unsubLogin = onOpenLoginModal(() => setShowLogin(true));
    return () => { unsubAuth(); unsubFav(); unsubCart(); unsubLogin(); };
  }, []);

  const navigate = useNavigate();

  const irA = (ruta) => (e) => {
    e.preventDefault();
    if (!getUsuario()) { openLoginModal(); return; }
    navigate(ruta);
  };

  const irADestacado = (e) => {
    e.preventDefault();
    navigate("/#destacado");
    setTimeout(() => {
      document.getElementById("destacado")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBuscar = (e) => {
    if (e.key === "Enter" && busqueda.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(busqueda.trim())}`);
      setMostrarBusqueda(false);
      setBusqueda("");
    }
  };

  const IconoConBadge = ({ href, onClick, icono: Icono, cantidad, badgeBg }) => (
    <a href={href} onClick={onClick} className="header__icono-link">
      <div className="header__icono-wrapper">
        <Icono size={20} />
        {cantidad > 0 && <Badge bg={badgeBg} pill className="header__badge">{cantidad}</Badge>}
      </div>
    </a>
  );

  return (
    <header className="header">
      <div className="header__top">
        <Container className="d-flex justify-content-between align-items-center">
          <img src="/logo.png" alt="SilkNova" className="header__logo" />

          <div className="d-none d-lg-flex align-items-center gap-3">
            <div className="d-flex gap-2 header__redes">
              {REDES_SOCIALES.map(({ Icono, href }, i) => (
                <a key={i} href={href} className="header__red-link"><Icono size={15} /></a>
              ))}
            </div>
            <div className="header__redes-divider" />
            <div className="position-relative">
              {mostrarBusqueda ? (
                <InputGroup size="sm" style={{ width: 260 }}>
                  <Form.Control
                    autoFocus
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={handleBuscar}
                  />
                  <InputGroup.Text
                    className="header__busqueda-cerrar"
                    onClick={() => { setMostrarBusqueda(false); setBusqueda(""); }}
                  >
                    <FaTimes />
                  </InputGroup.Text>
                </InputGroup>
              ) : (
                <FaSearch size={18} className="header__busqueda-icono" onClick={() => setMostrarBusqueda(true)} />
              )}
            </div>
          </div>
        </Container>
      </div>

      <Navbar bg="white" expand="lg" className="shadow-sm py-0">
        <Container>
          <div className="d-flex d-lg-none align-items-center gap-3 w-100 py-2">
            <Navbar.Toggle aria-controls="nav-collapse" className="border-0 p-0">
              <FaBars size={20} />
            </Navbar.Toggle>

            <InputGroup size="sm" className="flex-grow-1">
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={handleBuscar}
              />
            </InputGroup>

            <div className="d-flex gap-3 align-items-center">
              <IconoConBadge href="/favoritos" onClick={irA("/favoritos")} icono={FaHeart}       cantidad={cantidadFavoritos} badgeBg="danger" />
              <IconoConBadge href="/carrito"   onClick={irA("/carrito")}   icono={FaShoppingCart} cantidad={cantidadCarrito}   badgeBg="dark"   />
            </div>
          </div>

          <Navbar.Collapse id="nav-collapse">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link href="/#destacado" onClick={irADestacado}>Destacado</Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            </Nav>

            <Nav className="align-items-lg-center gap-3">
              <div className="d-none d-lg-flex align-items-center gap-3">
                <IconoConBadge href="/favoritos" onClick={irA("/favoritos")} icono={FaHeart}       cantidad={cantidadFavoritos} badgeBg="danger" />
                <IconoConBadge href="/carrito"   onClick={irA("/carrito")}   icono={FaShoppingCart} cantidad={cantidadCarrito}   badgeBg="dark"   />
                <FaQuestionCircle size={22} className="header__icono-ayuda" title="Ayuda" />
              </div>

              {usuario ? (
                <>
                  <div className="d-lg-none header__usuario-mobile">
                    <FaUserCircle size={18} className="me-2" />
                    <span className="header__usuario-nombre">{usuario.nombre}</span>
                    <small className="header__usuario-email">{usuario.email}</small>
                    <button className="header__btn-logout" onClick={clearSession}>
                      <FaSignOutAlt size={13} className="me-2" />Cerrar sesión
                    </button>
                  </div>

                  <Dropdown align="end" className="d-none d-lg-block">
                    <Dropdown.Toggle variant="link" className="header__dropdown-toggle">
                      <FaUserCircle size={22} />
                      {usuario.nombre}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="header__dropdown-menu">
                      <Dropdown.Item disabled className="header__dropdown-email">{usuario.email}</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={clearSession} className="d-flex align-items-center gap-2 text-danger">
                        <FaSignOutAlt size={13} /> Cerrar sesión
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <div className="d-flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline-dark" className="header__btn-login" onClick={() => setShowLogin(true)}>
                    Login
                  </Button>
                  <Button size="sm" className="header__btn-register" onClick={() => setShowRegister(true)}>
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ModalLogin
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onSwitchToRegistro={() => setShowRegister(true)}
      />
      <ModalRegister
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowLogin(true)}
      />
    </header>
  );
}

export default Header;
