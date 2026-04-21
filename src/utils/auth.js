const AUTH_EVENT = "auth-change";

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
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const onAuthChange = (callback) => {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
};
