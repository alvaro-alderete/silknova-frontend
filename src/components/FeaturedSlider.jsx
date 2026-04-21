import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { Container, Badge } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../config/axios.js";
import "./FeaturedSlider.css";

function FeaturedSlider() {
  const [listaProductosDestacados, setListaProductosDestacados] = useState([]);
  const [numeroSlideActual, setNumeroSlideActual] = useState(0);
  const [estaCargando, setEstaCargando] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setNumeroSlideActual(slider.track.details.rel);
    },
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products", { params: { destacado: true, limit: 6 } });
        setListaProductosDestacados(data.productos);
      } catch (error) {
        console.error(error);
      } finally {
        setEstaCargando(false);
      }
    };
    fetchFeatured();
  }, []);

  if (estaCargando) return (
    <section className="featured-slider">
      <Container>
        <Skeleton height={20} width={140} className="d-block mx-auto mb-2" baseColor="#2d2d44" highlightColor="#3d3d54" />
        <Skeleton height={36} width={220} className="d-block mx-auto mb-5" baseColor="#2d2d44" highlightColor="#3d3d54" />
        <div className="d-md-flex justify-content-md-center gap-4">
          <Skeleton height={400} width={280} baseColor="#2d2d44" highlightColor="#3d3d54" />
          <div style={{ maxWidth: 400, width: "100%" }}>
            <Skeleton height={12} width={100} className="mb-3" baseColor="#2d2d44" highlightColor="#3d3d54" />
            <Skeleton height={28} width={220} className="mb-2" baseColor="#2d2d44" highlightColor="#3d3d54" />
            <Skeleton count={3} className="mb-1" baseColor="#2d2d44" highlightColor="#3d3d54" />
            <Skeleton height={44} width={160} className="mt-4" baseColor="#2d2d44" highlightColor="#3d3d54" />
          </div>
        </div>
      </Container>
    </section>
  );

  if (!listaProductosDestacados.length) return null;

  return (
    <section className="featured-slider">
      <Container>
        <p className="featured-slider__tag">Selección exclusiva</p>
        <h2 className="featured-slider__title">Destacados</h2>

        <div className="featured-slider__wrapper">
          <div ref={sliderRef} className="keen-slider">
            {listaProductosDestacados.map((producto) => (
              <div key={producto._id} className="keen-slider__slide">
                <div className="featured-slider__slide-inner d-md-flex flex-md-row justify-content-md-center">
                  <div className="featured-slider__img-wrap">
                    <img src={producto.imagenes?.[0]} alt={producto.nombre} className="featured-slider__img" />
                    {producto.precioAnterior && (
                      <Badge className="featured-slider__badge">
                        -{Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="featured-slider__info">
                    <p className="featured-slider__category">{producto.categoria?.nombre}</p>
                    <h3 className="featured-slider__name">{producto.nombre}</h3>
                    <p className="featured-slider__material">{producto.material}</p>
                    <p className="featured-slider__description">{producto.descripcion}</p>

                    <div className="featured-slider__prices">
                      {producto.precioAnterior && (
                        <span className="featured-slider__price-old">
                          ${producto.precioAnterior.toLocaleString()}
                        </span>
                      )}
                      <span className="featured-slider__price">${producto.precio.toLocaleString()}</span>
                    </div>

                    <div className="featured-slider__actions">
                      <button className="featured-slider__buy-btn">Comprar</button>
                      <button className="featured-slider__fav-btn">
                        <FaHeart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="featured-slider__arrow" onClick={() => instanceRef.current?.prev()}>
            <FaChevronLeft size={16} />
          </button>
          <button className="featured-slider__arrow featured-slider__arrow--right" onClick={() => instanceRef.current?.next()}>
            <FaChevronRight size={16} />
          </button>
        </div>

        <div className="featured-slider__dots">
          {listaProductosDestacados.map((_, indice) => (
            <button
              key={indice}
              onClick={() => instanceRef.current?.moveToIdx(indice)}
              className={`featured-slider__dot ${indice === numeroSlideActual ? "featured-slider__dot--active" : "featured-slider__dot--inactive"}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedSlider;
