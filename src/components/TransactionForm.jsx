import { useState } from 'react'
import { format } from 'date-fns'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { CategoryIcon } from '../lib/iconMap'
import { useTransactions } from '../hooks/useTransactions'

export default function TransactionForm({ categories, onSubmit, onClose }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })
  const [saving, setSaving] = useState(false)
  const { add } = useTransactions()

  const filtered = categories.filter(c => c.type === form.type)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.category_id) return
    setSaving(true)
    await add({ ...form, amount: parseFloat(form.amount) })
    setSaving(false)
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50" onClick={onClose}>
      <div
        className="bg-slate-900 w-full rounded-t-3xl border-t border-slate-800 max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        <div className="px-5 pb-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Nuevo movimiento</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type toggle */}
            <div className="flex gap-2">
              <button type="button"
                onClick={() => setForm(f => ({ ...f, type: 'expense', category_id: '' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  form.type === 'expense' ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                <TrendingDown size={16} /> Gasto
              </button>
              <button type="button"
                onClick={() => setForm(f => ({ ...f, type: 'income', category_id: '' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  form.type === 'income' ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                <TrendingUp size={16} /> Ingreso
              </button>
            </div>

            {/* Amount */}
            <div className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition-colors">
              <label className="text-slate-500 text-xs mb-1 block">Monto (C$)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full bg-transparent text-white text-2xl font-bold outline-none placeholder:text-slate-700"
                required
              />
            </div>

            {/* Categories */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-2 block">Categoría</label>
              {filtered.length === 0 ? (
                <p className="text-slate-500 text-sm py-2">No hay categorías. Ve a Categorías y carga las predeterminadas.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {filtered.map(c => (
                    <button type="button" key={c.id}
                      onClick={() => setForm(f => ({ ...f, category_id: c.id }))}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                        form.category_id === c.id
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-slate-700 bg-slate-800/50'
                      }`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: c.color + '20' }}>
                        <CategoryIcon name={c.icon} size={16} style={{ color: c.color }} />
                      </div>
                      <span className="text-slate-300 text-[10px] truncate w-full text-center px-1 leading-tight">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition-colors">
              <label className="text-slate-500 text-xs mb-1 block">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-transparent text-white text-sm outline-none"
              />
            </div>

            {/* Description */}
            <div className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition-colors">
              <label className="text-slate-500 text-xs mb-1 block">Descripción (opcional)</label>
              <input
                type="text"
                placeholder="Ej: Almuerzo con amigos"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
              />
            </div>

            <button type="submit" disabled={saving || !form.amount || !form.category_id}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-semibold text-sm active:scale-95 disabled:opacity-40 transition-all">
              {saving ? 'Guardando...' : 'Guardar movimiento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
