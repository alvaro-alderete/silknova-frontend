import api from "../config/axios";

const CART_EVENT = "carrito-change";
const LS_KEY = "carrito";

export const getCarritoLS = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { items: [], subtotal: 0, descuento: 0, total: 0, totalItems: 0 }; }
  catch { return { items: [], subtotal: 0, descuento: 0, total: 0, totalItems: 0 }; }
};

export const getTotalCarrito = () => getCarritoLS().totalItems || 0;

const guardarCarrito = (data) => {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(CART_EVENT));
};

export const clearCarrito = () => {
  localStorage.removeItem(LS_KEY);
  window.dispatchEvent(new Event(CART_EVENT));
};

export const onCarritoChange = (callback) => {
  window.addEventListener(CART_EVENT, callback);
  return () => window.removeEventListener(CART_EVENT, callback);
};

export const cargarCarrito = async () => {
  if (!localStorage.getItem("token")) { clearCarrito(); return; }
  try {
    const { data } = await api.get("/cart/summary");
    const summary = data.summary ?? data;
    guardarCarrito(summary);
    return summary;
  } catch (e) {
    console.error("cargarCarrito error", e?.response?.data || e.message);
    return getCarritoLS();
  }
};

export const getCarritoCompleto = async () => {
  const { data } = await api.get("/cart");
  return data.carrito ?? data;
};

export const agregarAlCarrito = async (productoId, cantidad = 1, talle, color) => {
  const body = { productoId, cantidad };
  if (talle) body.talle = talle;
  if (color) body.color = color;
  const { data } = await api.post("/cart/items", body);
  await cargarCarrito();
  return data;
};

export const actualizarCantidad = async (productoId, cantidad, talle, color) => {
  const body = { productoId, cantidad };
  if (talle) body.talle = talle;
  if (color) body.color = color;
  await api.put("/cart/items", body);
  await cargarCarrito();
};

export const eliminarItem = async (productoId, talle, color) => {
  const body = { productoId };
  if (talle) body.talle = talle;
  if (color) body.color = color;
  await api.delete("/cart/items", { data: body });
  await cargarCarrito();
};

export const vaciarCarrito = async () => {
  await api.delete("/cart");
  clearCarrito();
};
