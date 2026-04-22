import api from "../config/axios";

const FAV_EVENT = "favoritos-change";
const LS_KEY = "favoritos";

export const getFavoritosLS = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
};

export const getTotalFavoritos = () => getFavoritosLS().length;

export const esFavorito = (productoId) =>
  getFavoritosLS().some((p) => p._id === productoId);

const guardarFavoritos = (lista) => {
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
  window.dispatchEvent(new Event(FAV_EVENT));
};

export const clearFavoritos = () => {
  localStorage.removeItem(LS_KEY);
  window.dispatchEvent(new Event(FAV_EVENT));
};

export const onFavoritosChange = (callback) => {
  window.addEventListener(FAV_EVENT, callback);
  return () => window.removeEventListener(FAV_EVENT, callback);
};

export const cargarFavoritos = async () => {
  if (!localStorage.getItem("token")) { clearFavoritos(); return []; }
  try {
    const { data } = await api.get("/favorites");
    const productos = data.map((f) => f.producto ?? f);
    guardarFavoritos(productos);
    return productos;
  } catch {
    return getFavoritosLS();
  }
};

export const toggleFavoritoAPI = async (producto) => {
  const { data } = await api.put(`/favorites/${producto._id}/toggle`);
  if (data.estaEnFavoritos) {
    guardarFavoritos([...getFavoritosLS(), producto]);
  } else {
    guardarFavoritos(getFavoritosLS().filter((p) => p._id !== producto._id));
  }
  return data;
};
