const AUTH_EVENT = "auth-change";
const LOGIN_MODAL_EVENT = "open-login-modal";

export const getUsuario = () => {
  const raw = localStorage.getItem("usuario");
  return raw ? JSON.parse(raw) : null;
};

export const saveSession = (token, userData) => {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(userData));
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("favoritos");
  window.dispatchEvent(new Event(AUTH_EVENT));
  window.dispatchEvent(new Event("favoritos-change"));
};

export const onAuthChange = (callback) => {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
};

export const openLoginModal = () => window.dispatchEvent(new Event(LOGIN_MODAL_EVENT));

export const onOpenLoginModal = (callback) => {
  window.addEventListener(LOGIN_MODAL_EVENT, callback);
  return () => window.removeEventListener(LOGIN_MODAL_EVENT, callback);
};
