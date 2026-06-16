import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  }

  return (
    <header className="bg-white/85 backdrop-blur-xl border-b border-white/80 shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <div className="text-2xl font-semibold text-slate-900">Radiant Beauty Glam</div>
          <nav className="flex flex-wrap gap-3">
            <Link to="/dashboard" className="px-4 py-2 rounded-full text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition">Products</Link>
            {userRole !== 'admin' && (
              <Link to="/cart" className="px-4 py-2 rounded-full text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition">Cart</Link>
            )}
            <Link to="/orders" className="px-4 py-2 rounded-full text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition">Orders</Link>
            {userRole === 'admin' && (
              <Link to="/admin" className="px-4 py-2 rounded-full text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition">Admin</Link>
            )}
          </nav>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          {userRole !== 'admin' && (
            <button
              onClick={() => navigate('/cart')}
              className="rounded-full bg-pink-100 px-4 py-2 text-pink-700 hover:bg-pink-200 transition"
            >
              View Cart
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
