// Simple localStorage-backed store for cart and orders (MVP)
const CART_KEY = 'rb_cart_v1';
const ORDERS_KEY = 'rb_orders_v1';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === product._id);
  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  setCart(cart);
  return cart;
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx >= 0) {
    if (quantity <= 0) cart.splice(idx, 1);
    else cart[idx].quantity = quantity;
    setCart(cart);
  }
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter(i => i.productId !== productId);
  setCart(cart);
  return cart;
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function checkout(userId) {
  const cart = getCart();
  if (!cart.length) return null;
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const orders = getOrders();
  const order = {
    _id: `order-${Date.now()}`,
    userId,
    totalPrice: total,
    createdAt: new Date().toISOString(),
    products: cart
  };
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  clearCart();
  return order;
}
