import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryIcon } from '../lib/iconMap'
import { useTransactions } from '../hooks/useTransactions'

function formatC(amount) {
  return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 0 }).format(amount)
}

export default function Dashboard() {
  const now = new Date()
  const [month, setMonth] = useState(format(now, 'yyyy-MM'))
  const { transactions, loading } = useTransactions({ month })

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

  const byCategory = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const name = t.categories?.name ?? 'Sin categoría'
      const color = t.categories?.color ?? '#6b7280'
      const icon = t.categories?.icon ?? 'Package'
      map[name] = { name, color, icon, value: (map[name]?.value ?? 0) + t.amount }
    })
    return Object.values(map).sort((a, b) => b.value - a.value)
  }, [transactions])

  const recent = transactions.slice(0, 5)
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

  const isCurrentMonth = format(now, 'yyyy-MM') === month

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">

      {/* Month selector */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={18} />
        </button>
        <span className="text-white font-semibold capitalize text-sm">{monthLabel}</span>
        <button onClick={nextMonth} disabled={isCurrentMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-90 transition-all disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 shadow-xl shadow-indigo-500/20">
        <p className="text-indigo-200 text-xs font-medium mb-1">Balance del mes</p>
        <p className={`text-3xl font-bold text-white mb-4`}>{formatC(stats.balance)}</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-indigo-200 text-[10px]">Ingresos</p>
              <p className="text-white font-semibold text-sm">{formatC(stats.income)}</p>
            </div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <TrendingDown size={14} className="text-red-300" />
            </div>
            <div>
              <p className="text-indigo-200 text-[10px]">Gastos</p>
              <p className="text-white font-semibold text-sm">{formatC(stats.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donut chart */}
      {byCategory.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <p className="text-white font-semibold text-sm mb-4">Gastos por categoría</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" innerRadius={36} outerRadius={52} dataKey="value" paddingAngle={3}>
                    {byCategory.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {byCategory.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-slate-300 text-xs truncate max-w-[90px]">{c.name}</span>
                  </div>
                  <span className="text-slate-400 text-xs">{formatC(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent transactions */}
      {recent.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-white font-semibold text-sm">Últimos movimientos</p>
          </div>
          <div className="divide-y divide-slate-800">
            {recent.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: (t.categories?.color ?? '#6b7280') + '20' }}>
                  <CategoryIcon name={t.categories?.icon} size={16}
                    className="opacity-90" style={{ color: t.categories?.color ?? '#6b7280' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm truncate">{t.description || t.categories?.name || 'Sin categoría'}</p>
                  <p className="text-slate-500 text-xs">{format(new Date(t.date + 'T12:00:00'), 'dd MMM', { locale: es })}</p>
                </div>
                <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatC(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!loading && transactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">Sin movimientos este mes</p>
          <p className="text-slate-600 text-xs mt-1">Toca + para agregar uno</p>
        </div>
      )}
    </div>
  )
}
