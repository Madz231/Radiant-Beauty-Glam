import React from 'react';

export default function CartItem({ item, onChangeQty, onRemove }) {
  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-xl shadow-rose-100/30 backdrop-blur-xl border border-white/80 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="font-semibold text-slate-900">{item.name}</div>
        <div className="text-sm text-slate-600 mt-1">${item.price.toFixed(2)} each</div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Qty:</label>
          <div className="flex items-center gap-1 bg-slate-100 rounded-full px-2">
            <button
              onClick={() => onChangeQty(item.productId, item.quantity - 1)}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              −
            </button>
            <div className="w-6 text-center text-slate-900 font-medium">{item.quantity}</div>
            <button
              onClick={() => onChangeQty(item.productId, item.quantity + 1)}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              +
            </button>
          </div>
        </div>
        <div className="min-w-24 text-right font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
        <button
          onClick={() => onRemove(item.productId)}
          className="rounded-full bg-rose-100 px-4 py-2 text-rose-700 hover:bg-rose-200 transition font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
