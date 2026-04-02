import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
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
      map[name] = { name, color, value: (map[name]?.value ?? 0) + t.amount }
    })
    return Object.values(map).sort((a, b) => b.value - a.value)
  }, [transactions])

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

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
      {/* Month selector */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-xl bg-slate-800 text-slate-300 active:scale-95">‹</button>
        <span className="text-white font-semibold capitalize">{monthLabel}</span>
        <button onClick={nextMonth} className="p-2 rounded-xl bg-slate-800 text-slate-300 active:scale-95 disabled:opacity-30"
          disabled={format(now, 'yyyy-MM') === month}>›</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-slate-400 text-xs">Ingresos</span>
          </div>
          <p className="text-emerald-400 font-bold text-sm">{formatC(stats.income)}</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-1 mb-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-slate-400 text-xs">Gastos</span>
          </div>
          <p className="text-red-400 font-bold text-sm">{formatC(stats.expense)}</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-1 mb-2">
            <Wallet size={14} className="text-indigo-400" />
            <span className="text-slate-400 text-xs">Balance</span>
          </div>
          <p className={`font-bold text-sm ${stats.balance >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            {formatC(stats.balance)}
          </p>
        </div>
      </div>

      {/* Donut chart */}
      {byCategory.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <h2 className="text-white font-semibold mb-4 text-sm">Gastos por categoría</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={byCategory} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {byCategory.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {byCategory.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-slate-300 truncate max-w-[80px]">{c.name}</span>
                  </div>
                  <span className="text-slate-400">{formatC(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-slate-500 text-center text-sm py-8">Cargando...</p>}
      {!loading && transactions.length === 0 && (
        <p className="text-slate-500 text-center text-sm py-8">Sin movimientos este mes</p>
      )}
    </div>
  )
}
