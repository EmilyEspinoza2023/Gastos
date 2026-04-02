import { useAuth } from '../../context/AuthContext'
import { LogOut } from 'lucide-react'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl">💸</span>
        <span className="text-white font-bold text-sm">GastosbyEmile</span>
      </div>
      <div className="flex items-center gap-2">
        {user?.user_metadata?.avatar_url && (
          <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full" />
        )}
        <button onClick={signOut} className="text-slate-500 hover:text-red-400 p-1">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
