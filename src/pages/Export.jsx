import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileSpreadsheet, FileText, ChevronLeft, ChevronRight, ArrowDownToLine } from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useTransactions } from '../hooks/useTransactions'

function formatC(amount) {
  return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 0 }).format(amount)
}

export default function Export() {
  const now = new Date()
  const [month, setMonth] = useState(format(now, 'yyyy-MM'))
  const { transactions } = useTransactions({ month })
  const monthLabel = format(new Date(month + '-15'), 'MMMM yyyy', { locale: es })
  const isCurrentMonth = format(now, 'yyyy-MM') === month

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const rows = transactions.map(t => ({
    Fecha: format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy'),
    Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
    Categoria: t.categories?.name ?? '-',
    Descripcion: t.description ?? '-',
    Monto: t.amount,
  }))

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, monthLabel)
    XLSX.writeFile(wb, `gastos_${month}.xlsx`)
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(99, 102, 241)
    doc.text('GastosbyEmile', 14, 18)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Reporte de ${monthLabel}`, 14, 26)

    doc.setFontSize(10)
    doc.setTextColor(60)
    doc.text(`Ingresos: ${formatC(income)}`, 14, 36)
    doc.text(`Gastos: ${formatC(expense)}`, 70, 36)
    doc.text(`Balance: ${formatC(income - expense)}`, 130, 36)

    autoTable(doc, {
      startY: 42,
      head: [['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto']],
      body: rows.map(r => [r.Fecha, r.Tipo, r.Categoria, r.Descripcion, formatC(r.Monto)]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 102, 241] },
    })

    doc.save(`gastos_${month}.pdf`)
  }

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
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-white font-bold text-lg mb-5">Exportar</h1>

      {/* Month selector */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-90">
          <ChevronLeft size={18} />
        </button>
        <span className="text-white font-semibold capitalize text-sm">{monthLabel}</span>
        <button onClick={nextMonth} disabled={isCurrentMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 active:scale-90 disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Summary */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 mb-5 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-slate-500 text-xs mb-1">Ingresos</p>
          <p className="text-emerald-400 font-semibold text-sm">{formatC(income)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Gastos</p>
          <p className="text-red-400 font-semibold text-sm">{formatC(expense)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Balance</p>
          <p className={`font-semibold text-sm ${income - expense >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            {formatC(income - expense)}
          </p>
        </div>
      </div>

      <p className="text-slate-500 text-xs mb-4">{transactions.length} movimientos en {monthLabel}</p>

      <div className="space-y-3">
        <button onClick={exportExcel}
          className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 active:scale-[0.98] transition-all hover:border-slate-700">
          <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
            <FileSpreadsheet size={22} className="text-emerald-400" strokeWidth={1.75} />
          </div>
          <div className="text-left flex-1">
            <p className="text-white font-semibold text-sm">Exportar a Excel</p>
            <p className="text-slate-500 text-xs mt-0.5">Archivo .xlsx para Excel o Google Sheets</p>
          </div>
          <ArrowDownToLine size={17} className="text-slate-600" />
        </button>

        <button onClick={exportPDF}
          className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 active:scale-[0.98] transition-all hover:border-slate-700">
          <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={22} className="text-red-400" strokeWidth={1.75} />
          </div>
          <div className="text-left flex-1">
            <p className="text-white font-semibold text-sm">Exportar a PDF</p>
            <p className="text-slate-500 text-xs mt-0.5">Reporte mensual con resumen</p>
          </div>
          <ArrowDownToLine size={17} className="text-slate-600" />
        </button>
      </div>
    </div>
  )
}
