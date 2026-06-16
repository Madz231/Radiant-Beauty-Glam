import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { addToCart } from '../lib/store';
import { getProducts } from '../lib/api';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleAdd(product) {
    addToCart(product);
    const el = document.createElement('div');
    el.textContent = `${product.name} added to cart`;
    el.className = 'fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-3 rounded-3xl shadow-lg';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
      <div className="container mx-auto px-4">
        <section className="mb-10 rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="uppercase text-sm tracking-[0.3em] text-pink-500">Welcome back</p>
              <h1 className="mt-3 text-4xl font-bold text-slate-900">Hello, {username}! 👋</h1>
              <p className="mt-2 text-slate-600">Ready to explore our beauty collection?</p>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="uppercase text-sm tracking-[0.3em] text-pink-500">Beauty collection</p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900">Featured products</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Explore curated makeup essentials built for a luminous look.</p>
            </div>
            <div className="rounded-full bg-pink-50 px-5 py-3 text-sm text-pink-700 shadow-sm">
              {loading ? 'Loading products…' : `${products.length} items available`}
            </div>
          </div>
        </section>

        {error && <div className="mb-6 rounded-3xl bg-rose-100 px-4 py-3 text-rose-700">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p._id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </main>
  );
}
