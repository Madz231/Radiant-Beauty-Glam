import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../lib/store';
import { processPayment } from '../lib/payment';
import { createOrder } from '../lib/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('review'); // 'review' or 'payment'

  // Payment form state
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      navigate('/cart');
    } else {
      setItems(cart);
    }
  }, [navigate]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  }

  function formatExpiryDate(value) {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  }

  async function handlePayment(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Process payment with mock gateway
      const paymentResult = await processPayment({
        cardholderName,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvv
      });

      // Create order with payment info
      const userId = localStorage.getItem('userId');
      const orderData = {
        products: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        totalPrice: total,
        paymentStatus: 'paid',
        transactionId: paymentResult.transactionId,
        cardLast4: paymentResult.cardLast4
      };

      // For now, create order locally since backend integration may vary
      // In production, this would call the backend API
      const order = {
        _id: `order-${Date.now()}`,
        userId,
        totalPrice: total,
        createdAt: new Date().toISOString(),
        products: items,
        status: 'paid',
        paymentStatus: 'paid',
        transactionId: paymentResult.transactionId
      };

      // Save to localStorage (MVP approach)
      const orders = JSON.parse(localStorage.getItem('rb_orders_v1') || '[]');
      orders.unshift(order);
      localStorage.setItem('rb_orders_v1', JSON.stringify(orders));

      clearCart();

      const el = document.createElement('div');
      el.textContent = 'Payment successful! Order placed.';
      el.className = 'fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded-3xl shadow-lg';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);

      navigate('/orders');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/cart')}
          className="mb-6 rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 transition font-medium"
        >
          ← Back to cart
        </button>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <section className="rounded-[2rem] bg-white/90 p-6 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80 sticky top-10">
              <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-4">Order summary</div>
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-slate-600">× {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <section className="rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
              <div className="mb-8 flex gap-4">
                <button
                  onClick={() => setStep('review')}
                  className={`flex-1 rounded-full py-3 font-semibold transition ${
                    step === 'review'
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Review
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className={`flex-1 rounded-full py-3 font-semibold transition ${
                    step === 'payment'
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Payment
                </button>
              </div>

              {step === 'review' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Order Review</h2>
                  <div className="space-y-4 mb-8">
                    {items.map(item => (
                      <div key={item.productId} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl">
                        <div>
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <div className="text-sm text-slate-600">${item.price.toFixed(2)} × {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-white font-semibold shadow-lg shadow-pink-200/40 transition hover:from-pink-600 hover:to-rose-600"
                  >
                    Proceed to payment
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  {error && (
                    <div className="mb-6 rounded-3xl bg-rose-100 px-4 py-3 text-rose-700 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder name</label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={e => setCardholderName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Card number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 font-mono"
                        placeholder="4242 4242 4242 4242"
                        maxLength="19"
                      />
                      <p className="text-xs text-slate-500 mt-1">Test: 4242 4242 4242 4242</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expiry date</label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={e => setExpiryDate(formatExpiryDate(e.target.value))}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-white font-semibold shadow-lg shadow-pink-200/40 transition hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing payment...' : `Pay $${total.toFixed(2)}`}
                    </button>
                  </form>

                  <p className="text-xs text-slate-500 mt-6 text-center">
                    This is a demo payment processor. No real charges will be made.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
