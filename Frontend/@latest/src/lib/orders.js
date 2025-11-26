const KEY = "orders:v1";

function loadOrders() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(orders) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function generateOrderId() {
  const base = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(-2);
  return `SB-${base}${rand}`;
}

export function saveOrder(order) {
  const orders = loadOrders();
  orders.unshift(order);
  persist(orders);
  return order;
}

export function findOrderById(id) {
  if (!id) return null;
  const orders = loadOrders();
  return orders.find((order) => order.id === id.trim().toUpperCase()) || null;
}

export function getAllOrders() {
  return loadOrders();
}