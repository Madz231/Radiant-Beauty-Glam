import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || username.trim().length < 3) {
      return setError('Username must be at least 3 characters long.');
    }

    if (!email || !email.includes('@')) {
      return setError('Please enter a valid email address.');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      await register(username.trim(), email.trim(), password);
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 px-4 py-10">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/80 p-8 rounded-[2rem] shadow-2xl shadow-rose-200/30">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-500">Radiant Beauty Glam</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-3">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Register to start shopping and manage your beauty collection.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-3xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <label className="block mb-2 text-sm font-medium text-slate-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-3xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          placeholder="Your name"
        />

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
          className="w-full mb-4 px-4 py-3 rounded-3xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          placeholder="••••••••"
        />

        <label className="block mb-2 text-sm font-medium text-slate-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-3xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          placeholder="••••••••"
        />

        <button className="w-full rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-pink-200/40 transition hover:from-pink-600 hover:to-rose-600">
          Create account
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/" className="text-pink-500 hover:text-pink-700">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
