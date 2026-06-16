import React, { useEffect, useMemo, useState } from 'react';
import { createProduct, deleteProduct, getAllOrders, getProducts, updateOrderStatus, updateProduct, getUsers, registerAdmin } from '../lib/api';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  stock: ''
};

const statuses = ['pending', 'paid', 'shipped', 'delivered'];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    return { totalProducts, totalOrders, pendingOrders, revenue };
  }, [products, orders]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productData, orderData] = await Promise.all([getProducts(), getAllOrders()]);
        setProducts(productData);
        setOrders(orderData);
      } catch (err) {
        console.error(err);
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingProductId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmitProduct(e) {
    e.preventDefault();
    setMessage('');

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      imageUrl: form.imageUrl,
      stock: Number(form.stock)
    };

    try {
      if (editingProductId) {
        const updated = await updateProduct(editingProductId, payload);
        setProducts(prev => prev.map(item => (item._id === updated._id ? updated : item)));
        setMessage('Product updated successfully.');
      } else {
        const created = await createProduct(payload);
        setProducts(prev => [created, ...prev]);
        setMessage('Product added successfully.');
      }
      resetForm();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function handleEdit(product) {
    setEditingProductId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(product => product._id !== productId));
      setMessage('Product deleted successfully.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => (order._id === updated._id ? updated : order)));
      setMessage('Order status updated.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 text-slate-900 py-10">
      <div className="container mx-auto px-4">
        <section className="glass-card p-8 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="badge-soft">Admin dashboard</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Manage products, orders, and activity</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Use this console to keep your storefront fresh and process customer orders quickly.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="soft-card p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-pink-500">Products</div>
                <div className="mt-4 text-3xl font-semibold">{summary.totalProducts}</div>
              </div>
              <div className="soft-card p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-pink-500">Orders</div>
                <div className="mt-4 text-3xl font-semibold">{summary.totalOrders}</div>
              </div>
              <div className="soft-card p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-pink-500">Pending</div>
                <div className="mt-4 text-3xl font-semibold">{summary.pendingOrders}</div>
              </div>
              <div className="soft-card p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-pink-500">Revenue</div>
                <div className="mt-4 text-3xl font-semibold">${summary.revenue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card p-8 mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Product management</h2>
              <p className="text-slate-600 mt-2">Add, edit, or remove inventory for the storefront.</p>
            </div>
            <div className="text-sm text-slate-500">{loading ? 'Loading products…' : `${products.length} products available`}</div>
          </div>

          <form onSubmit={handleSubmitProduct} className="mt-8 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="field-label">Product name</label>
              <input name="name" value={form.name} onChange={handleChange} className="field-input" placeholder="Lip Serum" required />
            </div>
            <div>
              <label className="field-label">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="field-input" placeholder="Skincare" required />
            </div>
            <div>
              <label className="field-label">Price</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" className="field-input" placeholder="24.99" required />
            </div>
            <div>
              <label className="field-label">Stock</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" className="field-input" placeholder="50" required />
            </div>
            <div className="lg:col-span-2">
              <label className="field-label">Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="field-input" placeholder="https://..." />
            </div>
            <div className="lg:col-span-2">
              <label className="field-label">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="field-input" placeholder="Describe the product." />
            </div>
            <div className="lg:col-span-2 flex flex-wrap gap-3">
              <button type="submit" className="primary-button">{editingProductId ? 'Save product' : 'Add product'}</button>
              <button type="button" onClick={resetForm} className="secondary-button">Clear form</button>
            </div>
          </form>

          {message && <div className="mt-6 rounded-3xl bg-pink-50 px-4 py-3 text-pink-700">{message}</div>}
        </section>

        <section className="glass-card p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Inventory</h2>
              <p className="text-slate-600 mt-1">Edit or delete products in the catalog.</p>
            </div>
            <div className="text-sm text-slate-500">{products.length} items</div>
          </div>

          <div className="grid gap-4">
            {products.map(product => (
              <div key={product._id} className="soft-card p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="badge-soft">{product.category || 'Uncategorized'}</div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-slate-600 mt-2">{product.description || 'No description yet.'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>${product.price.toFixed(2)}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => handleEdit(product)} className="secondary-button">Edit</button>
                  <button type="button" onClick={() => handleDelete(product._id)} className="rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Orders & activity</h2>
              <p className="text-slate-600 mt-1">Review recent customer orders and update delivery status.</p>
            </div>
            <div className="text-sm text-slate-500">{orders.length} total orders</div>
          </div>

          <div className="mt-8 space-y-4">
            {orders.map(order => (
              <div key={order._id} className="soft-card p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-pink-500">Order</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">#{order._id}</div>
                    <div className="text-slate-500">Customer: {order.userId?.username || order.userId?.email || 'Unknown'}</div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">${(order.totalPrice || 0).toFixed(2)}</div>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className="field-input max-w-xs"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {order.products.map(item => (
                    <div key={`${order._id}-${item.productId?._id || item.productId}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="font-semibold text-slate-900">{item.productId?.name || item.name || 'Product'}</div>
                      <div className="text-slate-600 text-sm">Quantity: {item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
