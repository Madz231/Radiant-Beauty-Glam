import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../lib/api';
import { addToCart } from '../lib/store';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleAddToCart() {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      const el = document.createElement('div');
      el.textContent = `${quantity} × ${product.name} added to cart`;
      el.className = 'fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-3 rounded-3xl shadow-lg';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
      setQuantity(1);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-600">Loading product details…</div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-rose-100 px-6 py-4 text-rose-700 mb-6 text-center">
            {error || 'Product not found'}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 transition"
          >
            Back to products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 transition font-medium"
        >
          ← Back to products
        </button>

        <div className="rounded-[2rem] bg-white/90 p-8 shadow-2xl shadow-rose-100/50 backdrop-blur-xl border border-white/80 grid gap-10 md:grid-cols-2">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            {product.imageUrl ? (
              <div className="w-full aspect-square bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="badge-soft mb-4">{product.category || 'Beauty'}</div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-2">Price</div>
                <div className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</div>
              </div>

              <div className="mb-8">
                <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-3">Description</div>
                <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
              </div>

              {product.stock !== undefined && (
                <div className="mb-8">
                  <div className="text-sm uppercase tracking-[0.3em] text-pink-500 mb-2">Stock</div>
                  <div className="text-slate-900 font-semibold">
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Quantity:</label>
                <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    −
                  </button>
                  <div className="w-8 text-center text-slate-900 font-medium">{quantity}</div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 text-white text-lg font-semibold shadow-lg shadow-pink-200/40 transition hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
