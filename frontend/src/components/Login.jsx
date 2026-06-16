import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      const data = await login(email.trim(), password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('username', data.user.username);
      const destination = data.user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(destination);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 px-4 py-10">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/80 p-8 rounded-[2rem] shadow-2xl shadow-rose-200/30">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-500">Radiant Beauty Glam</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-3">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to access your beauty dashboard.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <label className="block mb-2 text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-3xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          placeholder="you@example.com"
        />

        <label className="block mb-2 text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-3xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          placeholder="••••••••"
        />

        <button className="w-full rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-pink-200/40 transition hover:from-pink-600 hover:to-rose-600">
          Sign in
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-pink-500 font-semibold hover:text-pink-700">Create one</Link>
        </p>
      </form>
    </div>
  );
}
