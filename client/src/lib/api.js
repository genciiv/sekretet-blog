const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const TOKEN_KEY = "admin_token";

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function hasAdminToken() {
  return !!getAdminToken();
}
export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
}
export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ---- Public JSON ----
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function apiSend(path, method, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ---- Admin JSON ----
export async function apiAuthGet(path) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function apiAuthSend(path, method, body) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ---- Admin Upload (FormData) ----
export async function apiAuthUpload(path, formData) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function absUrl(maybeRelative) {
  if (!maybeRelative) return "";
  if (maybeRelative.startsWith("http")) return maybeRelative;
  return `${API_BASE}${maybeRelative}`;
}
