import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'

const COLORS = ['#ef4444','#f97316','#f59e0b','#84cc16','#10b981','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#6b7280']
const ICONS = ['🍔','🚌','💊','🎮','👗','📚','🏠','📦','💼','💻','🏪','💰','✈️','🎵','🏋️','🐕','🧴','💡']

export default function Categories() {
  const { categories, add, remove, seedDefaults } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '📦', color: '#6366f1', type: 'expense' })

  const handleAdd = async () => {
    if (!form.name.trim()) return
    await add(form)
    setForm({ name: '', icon: '📦', color: '#6366f1', type: 'expense' })
    setShowForm(false)
  }

  const expenses = categories.filter(c => c.type === 'expense')
  const income = categories.filter(c => c.type === 'income')

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-white font-bold text-lg">Categorías</h1>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <button onClick={seedDefaults} className="text-xs text-indigo-400 px-3 py-2 rounded-xl bg-slate-800">
              Cargar predeterminadas
            </button>
          )}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-medium">
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {[['Gastos', expenses], ['Ingresos', income]].map(([label, list]) => (
        <div key={label} className="mb-5">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
          <div className="space-y-2">
            {list.map(c => (
              <div key={c.id} className="flex items-center gap-3 bg-slate-900 rounded-xl p-3 border border-slate-800">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: c.color + '33' }}>
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                </div>
                <div className="w-3 h-3 rounded-full mr-2" style={{ background: c.color }} />
                <button onClick={() => remove(c.id)} className="text-slate-600 hover:text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {list.length === 0 && <p className="text-slate-600 text-sm py-2">Sin categorías</p>}
          </div>
        </div>
      ))}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-end z-50" onClick={() => setShowForm(false)}>
          <div className="bg-slate-900 w-full rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-bold">Nueva categoría</h2>

            <div className="flex gap-2">
              {['expense', 'income'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium ${form.type === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {t === 'expense' ? 'Gasto' : 'Ingreso'}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-sm outline-none border border-slate-700 focus:border-indigo-500"
            />

            <div>
              <p className="text-slate-400 text-xs mb-2">Icono</p>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(icon => (
                  <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))}
                    className={`w-9 h-9 rounded-xl text-lg ${form.icon === icon ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button key={color} onClick={() => setForm(f => ({ ...f, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${form.color === color ? 'border-white' : 'border-transparent'}`}
                    style={{ background: color }} />
                ))}
              </div>
            </div>

            <button onClick={handleAdd}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold active:scale-95">
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
