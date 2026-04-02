import { NavLink } from 'react-router-dom'
import { LayoutDashboard, List, Tag, Download } from 'lucide-react'

const LINKS = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/transactions', icon: List, label: 'Movimientos' },
  { to: '/categories', icon: Tag, label: 'Categorías' },
  { to: '/export', icon: Download, label: 'Exportar' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 pb-safe">
      <div className="flex max-w-lg mx-auto">
        {LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
