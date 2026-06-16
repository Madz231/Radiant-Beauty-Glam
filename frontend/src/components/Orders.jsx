import React, { useEffect, useState } from 'react';
import { getOrders } from '../lib/store';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <section className="mb-10 rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="badge-soft">Order history</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Your orders</h1>
            </div>
            <div className="text-sm text-slate-500">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</div>
          </div>
        </section>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-amber-50 px-6 py-8 text-center border border-amber-200">
            <p className="text-slate-600">No orders yet. Start shopping to see your order history here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <div className="badge-soft">Order</div>
                    <div className="mt-3 font-semibold text-slate-900">#{order._id.slice(0, 8)}</div>
                    <div className="text-sm text-slate-600 mt-1">Placed {new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-2">Payment status</div>
                    <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.paymentStatus === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.paymentStatus === 'paid' ? '✓ Paid' : order.paymentStatus || 'Pending'}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-4">Order status</div>
                    <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'paid'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-2">Total</div>
                    <div className="text-2xl font-bold text-slate-900">${order.totalPrice.toFixed(2)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-4">Items</div>
                  <div className="space-y-3">
                    {order.products.map(p => (
                      <div key={p.productId} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl">
                        <div>
                          <div className="font-medium text-slate-900">{p.name}</div>
                          <div className="text-sm text-slate-600">× {p.quantity} @ ${p.price.toFixed(2)}</div>
                        </div>
                        <div className="font-semibold text-slate-900">${(p.price * p.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
