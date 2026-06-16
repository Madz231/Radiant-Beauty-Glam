import React, { useEffect, useState } from 'react';
import { getCart, updateQuantity, removeFromCart } from '../lib/store';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  function handleChangeQty(productId, qty) {
    const updated = updateQuantity(productId, qty);
    setItems(updated);
  }

  function handleRemove(productId) {
    const updated = removeFromCart(productId);
    setItems(updated);
  }

  function handleCheckout() {
    if (items.length === 0) {
      const el = document.createElement('div');
      el.textContent = 'Your cart is empty';
      el.className = 'fixed bottom-6 right-6 bg-rose-500 text-white px-4 py-3 rounded-3xl shadow-lg';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    } else {
      navigate('/checkout');
    }
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <section className="mb-10 rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="badge-soft">Shopping cart</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Review your items</h1>
            </div>
            <div className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'item' : 'items'}</div>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-amber-50 px-6 py-8 text-center border border-amber-200">
            <p className="text-slate-600">Your cart is empty. Add some beauty products to get started!</p>
          </div>
        ) : (
          <>
            <div className="mb-8 space-y-4">
              {items.map(item => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onChangeQty={handleChangeQty}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <section className="rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-2">Order summary</div>
                  <div className="text-4xl font-bold text-slate-900">${total.toFixed(2)}</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setItems([]); localStorage.removeItem('rb_cart_v1'); }}
                    className="rounded-full bg-slate-100 px-6 py-3 text-slate-900 font-semibold hover:bg-slate-200 transition"
                  >
                    Clear cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-white font-semibold shadow-lg shadow-pink-200/40 transition hover:from-pink-600 hover:to-rose-600"
                  >
                    Proceed to checkout
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
