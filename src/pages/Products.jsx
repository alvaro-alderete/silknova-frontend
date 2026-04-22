import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Offcanvas, Stack, Pagination } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../config/axios";
import { GENEROS } from "../constants";
import "./Products.css";

export default function ProductsPage() {
  const [parametrosBusqueda] = useSearchParams();
  const navegar = useNavigate();

  const textoBuscado = parametrosBusqueda.get("busqueda") || "";
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(parametrosBusqueda.get("categoria") || "");
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("default");

  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [estaCargando, setEstaCargando] = useState(true);

  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setListaCategorias(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const cargarProductos = async () => {
      setEstaCargando(true);
      try {
        const filtros = { page: paginaActual, limit: 9 };
        if (textoBuscado)                   filtros.busqueda  = textoBuscado;
        if (categoriaSeleccionada)          filtros.categoria = categoriaSeleccionada;
        if (generoSeleccionado !== "Todos") filtros.genero    = generoSeleccionado;
        if (soloDestacados)                 filtros.destacado = "true";
        const { data } = await api.get("/products", { params: filtros });
        setListaProductos(data.productos);
        setTotalPaginas(data.totalPages ?? 1);
      } catch (error) {
        console.error(error);
      } finally {
        setEstaCargando(false);
      }
    };
    cargarProductos();
  }, [paginaActual, textoBuscado, categoriaSeleccionada, generoSeleccionado, soloDestacados]);

  const cambiarFiltro = (setter) => (nuevoValor) => {
    setter(nuevoValor);
    setPaginaActual(1);
  };

  const PanelFiltros = () => (
    <Stack gap={4}>
      <div>
        <p className="productos__filtro-titulo">Categoría</p>
        <div
          className={`productos__filtro-opcion ${categoriaSeleccionada === "" ? "productos__filtro-opcion--activa" : ""}`}
          onClick={() => cambiarFiltro(setCategoriaSeleccionada)("")}
        >
          Todas
        </div>
        {listaCategorias.map((categoria) => (
          <div
            key={categoria._id}
            className={`productos__filtro-opcion ${categoriaSeleccionada === categoria._id ? "productos__filtro-opcion--activa" : ""}`}
            onClick={() => cambiarFiltro(setCategoriaSeleccionada)(categoria._id)}
          >
            {categoria.nombre}
          </div>
        ))}
      </div>

      <div>
        <p className="productos__filtro-titulo">Género</p>
        {GENEROS.map((genero) => (
          <div
            key={genero}
            className={`productos__filtro-opcion productos__filtro-opcion--capitalizar ${generoSeleccionado === genero ? "productos__filtro-opcion--activa" : ""}`}
            onClick={() => cambiarFiltro(setGeneroSeleccionado)(genero)}
          >
            {genero}
          </div>
        ))}
      </div>

      <Form.Check
        type="switch"
        id="soloDestacados"
        label={<span className="productos__filtro-switch-label">Solo destacados</span>}
        checked={soloDestacados}
        onChange={(e) => cambiarFiltro(setSoloDestacados)(e.target.checked)}
      />
    </Stack>
  );

  return (
    <>
      <Container className="py-5">
        <Row className="mb-5 align-items-end">
          <Col>
            <p className="productos__subtitulo">Colección 2025</p>
            <h1 className="productos__titulo">Productos</h1>
          </Col>
          <Col xs="auto" className="d-md-none">
            <Button
              variant="outline-dark"
              size="sm"
              className="productos__btn-filtros-mobile"
              onClick={() => setMostrarFiltrosMobile(true)}
            >
              Filtros
            </Button>
          </Col>
        </Row>

        <Row className="mb-4 align-items-center">
          <Col className="d-flex align-items-center justify-content-end gap-3">
            {textoBuscado && (
              <span className="productos__busqueda-activa">
                Resultados para: <strong>{textoBuscado}</strong>
                <button
                  className="productos__busqueda-limpiar"
                  onClick={() => navegar("/productos")}
                  title="Limpiar búsqueda"
                >✕</button>
              </span>
            )}
            <select
              className="productos__select-orden"
              value={ordenSeleccionado}
              onChange={(e) => cambiarFiltro(setOrdenSeleccionado)(e.target.value)}
            >
              <option value="default">Ordenar por</option>
              <option value="asc">Menor precio</option>
              <option value="desc">Mayor precio</option>
              <option value="oferta">En oferta</option>
            </select>
          </Col>
        </Row>

        <Row>
          <Col md={3} className="d-none d-md-block">
            <div className="productos__filtros-sidebar">
              <PanelFiltros />
            </div>
          </Col>

          <Col md={9}>
            {estaCargando ? (
              <Row className="g-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Col key={i} xs={6} lg={4}>
                    <div className="productos__skeleton" />
                  </Col>
                ))}
              </Row>
            ) : listaProductos.length === 0 ? (
              <div className="productos__vacio">
                <svg width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <Row className="g-3">
                {listaProductos.map((producto) => (
                  <Col key={producto._id} xs={6} lg={4}>
                    <ProductCard producto={producto} />
                  </Col>
                ))}
              </Row>
            )}

            {totalPaginas > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.Prev
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual(p => p - 1)}
                  />
                  {[...Array(totalPaginas)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={paginaActual === i + 1}
                      onClick={() => setPaginaActual(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual(p => p + 1)}
                  />
                </Pagination>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Offcanvas
        show={mostrarFiltrosMobile}
        onHide={() => setMostrarFiltrosMobile(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="productos__offcanvas-titulo">Filtros</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <PanelFiltros />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
