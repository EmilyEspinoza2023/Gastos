import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Tag, Download, Plus } from 'lucide-react'

const LINKS = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Movimientos' },
  { to: '/categories', icon: Tag, label: 'Categorías' },
  { to: '/export', icon: Download, label: 'Exportar' },
]

export default function BottomNav({ onAdd }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-6 px-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl px-2 py-2 shadow-2xl shadow-black/40 gap-1">
        {LINKS.slice(0, 2).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[10px] font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* FAB central */}
        <button
          onClick={onAdd}
          className="mx-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 active:scale-90 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all"
        >
          <Plus size={22} strokeWidth={2.5} className="text-white" />
        </button>

        {LINKS.slice(2).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[10px] font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
