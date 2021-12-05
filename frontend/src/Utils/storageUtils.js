export function loadFromLS(name) {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : null;
}

export function saveToLS(name, object) {
  localStorage.setItem(name, JSON.stringify(object));
}

export function removeFromLS(name) {
  localStorage.removeItem(name);
}
