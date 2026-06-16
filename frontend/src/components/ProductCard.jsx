import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white/95 p-6 rounded-[2rem] shadow-2xl shadow-rose-100/40 flex flex-col justify-between border border-white/80">
      <Link to={`/product/${product._id}`} className="block">
        <div className="w-full h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
          {!imageError && product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-slate-400 text-center">
              <div className="text-3xl mb-2">🛍️</div>
              <div className="text-sm">Product image</div>
            </div>
          )}
        </div>
      </Link>
      <div>
        <div className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-pink-600 mb-4">
          {product.category || 'Beauty'}</div>
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-2xl font-semibold mb-3 text-slate-900 hover:text-pink-600 transition">{product.name}</h3>
        </Link>
        <p className="text-slate-500 mb-5 line-clamp-2">{product.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-2xl font-bold text-slate-900">${product.price}</div>
        <button
          onClick={() => onAdd(product)}
          className="rounded-full bg-pink-500 px-4 py-2 text-white font-semibold shadow-lg shadow-pink-200/40 hover:bg-pink-600 transition"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
