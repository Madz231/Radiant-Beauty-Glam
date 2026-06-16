const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

async function fetchJson(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export async function register(username, email, password) {
  return fetchJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
}

export async function login(email, password) {
  return fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function getProducts() {
  return fetchJson('/api/products');
}

export async function getProduct(id) {
  return fetchJson(`/api/products/${id}`);
}

export async function createProduct(product) {
  return fetchJson('/api/products', {
    method: 'POST',
    body: JSON.stringify(product)
  });
}

export async function updateProduct(id, product) {
  return fetchJson(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  });
}

export async function deleteProduct(id) {
  return fetchJson(`/api/products/${id}`, {
    method: 'DELETE'
  });
}

export async function getUserOrders(userId) {
  return fetchJson(`/api/orders/${userId}`);
}

export async function createOrder(userId, products, totalPrice) {
  return fetchJson(`/api/orders/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ products, totalPrice })
  });
}

export async function getAllOrders() {
  return fetchJson('/api/orders/admin/all');
}

export async function updateOrderStatus(orderId, status) {
  return fetchJson(`/api/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function getUsers() {
  return fetchJson('/api/users');
}

export async function registerAdmin(username, email, password) {
  return fetchJson('/api/auth/register-admin', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
}
