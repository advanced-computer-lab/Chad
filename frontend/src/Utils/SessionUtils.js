export function getSession() {
  return localStorage.getItem("token");
}

export function saveSession(token) {
  localStorage.setItem("token", token);
}

export function clearSession() {
  localStorage.clear();
}
