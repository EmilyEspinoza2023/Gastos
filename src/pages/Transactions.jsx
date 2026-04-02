import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryIcon } from '../lib/iconMap'
import { useTransactions } from '../hooks/useTransactions'

function formatC(amount) {
  return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 0 }).format(amount)
}

export default function Transactions() {
  const now = new Date()
  const [month, setMonth] = useState(format(now, 'yyyy-MM'))
  const [filter, setFilter] = useState('all')
  const { transactions, loading, remove } = useTransactions({ month })

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)
  const monthLabel = format(new Date(month + '-15'), 'MMMM yyyy', { locale: es })
  const isCurrentMonth = format(now, 'yyyy-MM') === month

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

  // Group by date
  const grouped = filtered.reduce((acc, t) => {
    const key = t.date
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">

      {/* Month selector */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-90">
          <ChevronLeft size={18} />
        </button>
        <span className="text-white font-semibold capitalize text-sm">{monthLabel}</span>
        <button onClick={nextMonth} disabled={isCurrentMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-90 disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-900 rounded-xl p-1 mb-5 border border-slate-800">
        {[['all', 'Todos'], ['income', 'Ingresos'], ['expense', 'Gastos']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === val ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      <div className="space-y-5">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">Sin movimientos</p>
            <p className="text-slate-600 text-xs mt-1">Toca + para agregar uno</p>
          </div>
        )}
        {dates.map(date => (
          <div key={date}>
            <p className="text-slate-500 text-xs font-medium mb-2 capitalize">
              {format(new Date(date + 'T12:00:00'), "EEEE dd 'de' MMMM", { locale: es })}
            </p>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
              {grouped[date].map(t => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: (t.categories?.color ?? '#6b7280') + '20' }}>
                    <CategoryIcon name={t.categories?.icon} size={18}
                      style={{ color: t.categories?.color ?? '#6b7280' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium truncate">
                      {t.description || t.categories?.name || 'Sin categoría'}
                    </p>
                    {t.description && t.categories?.name && (
                      <p className="text-slate-500 text-xs">{t.categories.name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatC(t.amount)}
                    </span>
                    <button onClick={() => remove(t.id)} className="text-slate-700 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
