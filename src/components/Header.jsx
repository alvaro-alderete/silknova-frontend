import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaBars, FaSearch, FaQuestionCircle, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalLogin from "./auth/ModalLogin";
import ModalRegister from "./auth/ModalRegister";
import { getUsuario, clearSession, onAuthChange, onOpenLoginModal } from "../utils/auth";
import { getTotalFavoritos, onFavoritosChange } from "../utils/favoritos";

function Header() {
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState(getUsuario);
  const [cantidadFavoritos, setCantidadFavoritos] = useState(getTotalFavoritos);

  useEffect(() => {
    const unsubAuth = onAuthChange(() => setUsuario(getUsuario()));
    const unsubFav = onFavoritosChange(() => setCantidadFavoritos(getTotalFavoritos()));
    const unsubLogin = onOpenLoginModal(() => setShowLogin(true));
    return () => { unsubAuth(); unsubFav(); unsubLogin(); };
  }, []);

  const handleLogout = () => clearSession();

  const cantidadCarrito = 2;

  const sugerencias = ["Vestido rojo", "Camisa blanca", "Pantalón negro"];
  const filtradas = sugerencias.filter((s) =>
    s.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1050 }}>
      <div className="bg-white border-bottom py-2">
        <Container className="d-flex justify-content-between align-items-center">
          <img src="/logo.png" alt="SilkNova" style={{ height: 60, objectFit: "contain", filter: "brightness(0)" }} />

          <div className="d-none d-lg-flex align-items-center gap-2 position-relative">
            {mostrarBusqueda ? (
              <>
                <InputGroup size="sm" style={{ width: 260 }}>
                  <Form.Control
                    autoFocus
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => { setMostrarBusqueda(false); setBusqueda(""); }}
                  >
                    <FaTimes />
                  </InputGroup.Text>
                </InputGroup>

                {busqueda && filtradas.length > 0 && (
                  <div
                    className="position-absolute bg-white border rounded shadow-sm"
                    style={{ top: "110%", left: 0, width: 260, zIndex: 200 }}
                  >
                    {filtradas.map((s) => (
                      <div
                        key={s}
                        className="px-3 py-2"
                        style={{ cursor: "pointer", fontSize: 14 }}
                        onClick={() => setBusqueda(s)}
                      >
                        <FaSearch size={11} className="me-2 text-muted" />
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <FaSearch
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setMostrarBusqueda(true)}
              />
            )}
          </div>
        </Container>
      </div>

      <Navbar bg="white" expand="lg" className="shadow-sm py-0">
        <Container>
          <div className="d-flex d-lg-none align-items-center gap-3 w-100 py-2">
            <Navbar.Toggle aria-controls="nav-mobile" className="border-0 p-0">
              <FaBars size={20} />
            </Navbar.Toggle>

            <InputGroup size="sm" className="flex-grow-1">
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </InputGroup>

            <div className="d-flex gap-3 align-items-center">
              <Link to="/favoritos" style={{ color: "inherit" }}>
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <FaHeart size={20} />
                  {cantidadFavoritos > 0 && (
                    <Badge bg="danger" pill style={{ position: "absolute", top: -6, right: -8, fontSize: 9 }}>
                      {cantidadFavoritos}
                    </Badge>
                  )}
                </div>
              </Link>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <FaShoppingCart size={20} />
                {cantidadCarrito > 0 && (
                  <Badge bg="dark" pill style={{ position: "absolute", top: -6, right: -8, fontSize: 9 }}>
                    {cantidadCarrito}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Navbar.Collapse id="nav-mobile">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/destacado">Destacado</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            </Nav>

            <Nav className="d-none d-lg-flex align-items-center gap-3">
              <Link to="/favoritos" style={{ color: "inherit" }}>
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <FaHeart size={20} />
                  {cantidadFavoritos > 0 && (
                    <Badge bg="danger" pill style={{ position: "absolute", top: -6, right: -10, fontSize: 10 }}>
                      {cantidadFavoritos}
                    </Badge>
                  )}
                </div>
              </Link>

              <div style={{ position: "relative", cursor: "pointer" }}>
                <FaShoppingCart size={20} />
                {cantidadCarrito > 0 && (
                  <Badge bg="dark" pill style={{ position: "absolute", top: -6, right: -10, fontSize: 10 }}>
                    {cantidadCarrito}
                  </Badge>
                )}
              </div>

              <FaQuestionCircle size={22} style={{ cursor: "pointer" }} title="Ayuda" />

              {usuario ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="p-0 border-0 text-dark d-flex align-items-center gap-2"
                    style={{ textDecoration: "none", fontSize: 14, fontWeight: 600 }}
                  >
                    <FaUserCircle size={22} />
                    {usuario.nombre}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ minWidth: 160, borderRadius: 10, fontSize: 14 }}>
                    <Dropdown.Item disabled style={{ color: "#888", fontSize: 12 }}>
                      {usuario.email}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 text-danger">
                      <FaSignOutAlt size={13} /> Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline-dark"
                    style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                    onClick={() => setShowLogin(true)}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    style={{ borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#111", border: "none" }}
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </Button>
                </>
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