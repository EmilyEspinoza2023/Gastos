import { useAuth } from '../../context/AuthContext'
import { LogOut, Wallet } from 'lucide-react'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Wallet size={16} strokeWidth={2} className="text-white" />
        </div>
        <span className="text-white font-bold tracking-tight">GastosbyEmile</span>
      </div>
      <div className="flex items-center gap-3">
        {user?.user_metadata?.avatar_url && (
          <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full ring-2 ring-slate-700" />
        )}
        <button onClick={signOut} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
          <LogOut size={17} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
