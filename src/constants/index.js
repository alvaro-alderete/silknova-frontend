import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

export const GENEROS = ["Todos", "mujer", "hombre", "unisex"];

export const LINKS_NAVEGACION = [
  { label: "Home",       href: "/" },
  { label: "Destacado",  href: "/#destacado" },
  { label: "Contacto",   href: "/contacto" },
  { label: "Favoritos",  href: "/favoritos" },
];

export const LINKS_AYUDA = [
  { label: "Preguntas frecuentes",   href: "/faq" },
  { label: "Envíos",                 href: "/envios" },
  { label: "Devoluciones",           href: "/devoluciones" },
  { label: "Términos y condiciones", href: "/terminos" },
];

export const REDES_SOCIALES = [
  { Icono: FaInstagram, href: "#" },
  { Icono: FaFacebookF, href: "#" },
  { Icono: FaTwitter,   href: "#" },
  { Icono: FaWhatsapp,  href: "#" },
];

export const PRECIO_ENVIO_GBA  = 1500;
export const PRECIO_ENVIO_OTRO = 2500;
export const ZONAS_GBA = ["buenos aires", "ciudad autónoma de buenos aires", "caba"];

export const CAMPOS_DIRECCION  = ["calle", "numero", "ciudad", "provincia", "cp"];
export const CAMPOS_TARJETA    = ["nombre", "numero", "vencimiento", "cvv"];
