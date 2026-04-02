import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
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
    doc.setFontSize(16)
    doc.text(`GastosbyEmile — ${monthLabel}`, 14, 18)

    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    doc.setFontSize(10)
    doc.text(`Ingresos: ${formatC(income)}   Gastos: ${formatC(expense)}   Balance: ${formatC(income - expense)}`, 14, 28)

    autoTable(doc, {
      startY: 34,
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
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-white font-bold text-lg mb-5">Exportar datos</h1>

      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2 rounded-xl bg-slate-800 text-slate-300">‹</button>
        <span className="text-white font-semibold capitalize">{monthLabel}</span>
        <button onClick={nextMonth} className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-30"
          disabled={format(now, 'yyyy-MM') === month}>›</button>
      </div>

      <p className="text-slate-400 text-sm mb-5">{transactions.length} movimientos en {monthLabel}</p>

      <div className="space-y-3">
        <button onClick={exportExcel}
          className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <FileSpreadsheet size={24} className="text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold">Exportar a Excel</p>
            <p className="text-slate-400 text-xs">Archivo .xlsx compatible con Excel y Sheets</p>
          </div>
          <Download size={18} className="text-slate-500 ml-auto" />
        </button>

        <button onClick={exportPDF}
          className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-red-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold">Exportar a PDF</p>
            <p className="text-slate-400 text-xs">Reporte mensual con resumen y tabla</p>
          </div>
          <Download size={18} className="text-slate-500 ml-auto" />
        </button>
      </div>
    </div>
  )
}
