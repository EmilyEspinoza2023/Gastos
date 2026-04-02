import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Export from './pages/Export'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import TransactionForm from './components/TransactionForm'
import { useCategories } from './hooks/useCategories'

function ProtectedLayout() {
  const { user, loading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const { categories } = useCategories()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="pb-24">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions onAdd={() => setShowForm(true)} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/export" element={<Export />} />
      </Routes>
      <BottomNav onAdd={() => setShowForm(true)} />
      {showForm && (
        <TransactionForm
          categories={categories}
          onSubmit={() => setShowForm(false)}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function PublicRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
