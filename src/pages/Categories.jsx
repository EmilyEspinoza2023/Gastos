import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { CategoryIcon, ICON_NAMES } from '../lib/iconMap'
import { useCategories } from '../hooks/useCategories'

const COLORS = [
  '#ef4444','#f97316','#f59e0b','#84cc16',
  '#10b981','#06b6d4','#3b82f6','#6366f1',
  '#8b5cf6','#ec4899','#14b8a6','#6b7280',
]

export default function Categories() {
  const { categories, add, remove, seedDefaults } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', icon: 'Package', color: '#6366f1', type: 'expense' })

  const handleAdd = async () => {
    if (!form.name.trim()) return
    await add(form)
    setForm({ name: '', icon: 'Package', color: '#6366f1', type: 'expense' })
    setShowForm(false)
  }

  const expenses = categories.filter(c => c.type === 'expense')
  const income = categories.filter(c => c.type === 'income')

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Categorías</h1>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <button onClick={seedDefaults}
              className="text-xs text-indigo-400 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 font-medium">
              Cargar predeterminadas
            </button>
          )}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-semibold active:scale-95">
            <Plus size={15} /> Nueva
          </button>
        </div>
      </div>

      {[['Gastos', expenses], ['Ingresos', income]].map(([label, list]) => (
        <div key={label} className="mb-6">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
          {list.length === 0 ? (
            <p className="text-slate-700 text-sm py-2">Sin categorías</p>
          ) : (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
              {list.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c.color + '20' }}>
                    <CategoryIcon name={c.icon} size={17} style={{ color: c.color }} />
                  </div>
                  <span className="text-slate-200 text-sm flex-1">{c.name}</span>
                  <div className="w-3 h-3 rounded-full mr-1" style={{ background: c.color }} />
                  <button onClick={() => remove(c.id)}
                    className="text-slate-700 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50" onClick={() => setShowForm(false)}>
          <div className="bg-slate-900 w-full rounded-t-3xl border-t border-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>
            <div className="px-5 pb-8 space-y-5">
              <h2 className="text-white font-bold text-lg">Nueva categoría</h2>

              <div className="flex gap-2">
                {['expense', 'income'].map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      form.type === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                    {t === 'expense' ? 'Gasto' : 'Ingreso'}
                  </button>
                ))}
              </div>

              <div className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition-colors">
                <label className="text-slate-500 text-xs mb-1 block">Nombre</label>
                <input type="text" placeholder="Ej: Gimnasio" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600" />
              </div>

              <div>
                <p className="text-slate-400 text-xs font-medium mb-2">Icono</p>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_NAMES.map(name => (
                    <button key={name} onClick={() => setForm(f => ({ ...f, icon: name }))}
                      className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                        form.icon === name ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'
                      }`}>
                      <CategoryIcon name={name} size={18}
                        className={form.icon === name ? 'text-white' : 'text-slate-400'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs font-medium mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button key={color} onClick={() => setForm(f => ({ ...f, color }))}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: color }}>
                      {form.color === color && <Check size={14} className="text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleAdd} disabled={!form.name.trim()}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-sm active:scale-95 disabled:opacity-40">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
