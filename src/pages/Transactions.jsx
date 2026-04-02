import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Plus } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import TransactionForm from '../components/TransactionForm'

function formatC(amount) {
  return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 0 }).format(amount)
}

export default function Transactions() {
  const now = new Date()
  const [month, setMonth] = useState(format(now, 'yyyy-MM'))
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const { transactions, loading, add, remove } = useTransactions({ month })
  const { categories } = useCategories()

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)

  const monthLabel = format(new Date(month + '-15'), 'MMMM yyyy', { locale: es })

  const prevMonth = () => {
    const d = new Date(month + '-15')
    d.setMonth(d.getMonth() - 1)
    setMonth(format(d, 'yyyy-MM'))
  }
  const nextMonth = () => {
    const d = new Date(month + '-15')
    d.setMonth(d.getMonth() + 1)
    if (d <= now) setMonth(format(d, 'yyyy-MM'))
  }

  const handleAdd = async (data) => {
    const { error } = await add(data)
    if (!error) setShowForm(false)
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-slate-800 text-slate-300">‹</button>
          <span className="text-white font-semibold capitalize text-sm">{monthLabel}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-30"
            disabled={format(now, 'yyyy-MM') === month}>›</button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-medium active:scale-95"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-900 rounded-xl p-1 mb-4 border border-slate-800">
        {[['all', 'Todos'], ['income', 'Ingresos'], ['expense', 'Gastos']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === val ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading && <p className="text-slate-500 text-center py-8 text-sm">Cargando...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-slate-500 text-center py-8 text-sm">Sin movimientos</p>
        )}
        {filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 bg-slate-900 rounded-2xl p-3 border border-slate-800">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: (t.categories?.color ?? '#6b7280') + '22' }}>
              {t.categories?.icon ?? '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{t.description || t.categories?.name}</p>
              <p className="text-slate-500 text-xs">
                {format(new Date(t.date + 'T12:00:00'), 'dd MMM', { locale: es })}
                {t.categories?.name && ` · ${t.categories.name}`}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                {t.type === 'income' ? '+' : '-'}{formatC(t.amount)}
              </p>
              <button onClick={() => remove(t.id)} className="text-slate-600 hover:text-red-400 mt-0.5">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <TransactionForm
          categories={categories}
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
