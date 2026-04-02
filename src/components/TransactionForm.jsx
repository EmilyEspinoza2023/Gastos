import { useState } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'

export default function TransactionForm({ categories, onSubmit, onClose }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })
  const [saving, setSaving] = useState(false)

  const filtered = categories.filter(c => c.type === form.type)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.category_id) return
    setSaving(true)
    await onSubmit({ ...form, amount: parseFloat(form.amount) })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-50" onClick={onClose}>
      <div className="bg-slate-900 w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Nuevo movimiento</h2>
          <button onClick={onClose} className="text-slate-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button type="button" key={t}
                onClick={() => setForm(f => ({ ...f, type: t, category_id: '' }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  form.type === t
                    ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                {t === 'expense' ? '↓ Gasto' : '↑ Ingreso'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Monto (C$)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full bg-slate-800 text-white text-2xl font-bold rounded-xl px-4 py-3 outline-none border border-slate-700 focus:border-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map(c => (
                <button type="button" key={c.id}
                  onClick={() => setForm(f => ({ ...f, category_id: c.id }))}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs transition-colors ${
                    form.category_id === c.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800'
                  }`}>
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-slate-300 truncate w-full text-center px-1">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm outline-none border border-slate-700 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Descripción (opcional)</label>
            <input
              type="text"
              placeholder="Ej: Almuerzo con amigos"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm outline-none border border-slate-700 focus:border-indigo-500"
            />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm active:scale-95 disabled:opacity-60">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
