import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const DEFAULT_CATEGORIES = [
  { name: 'Alimentación', icon: 'UtensilsCrossed', color: '#f97316', type: 'expense' },
  { name: 'Transporte', icon: 'Car', color: '#3b82f6', type: 'expense' },
  { name: 'Salud', icon: 'HeartPulse', color: '#ef4444', type: 'expense' },
  { name: 'Entretenimiento', icon: 'Gamepad2', color: '#8b5cf6', type: 'expense' },
  { name: 'Ropa', icon: 'Shirt', color: '#ec4899', type: 'expense' },
  { name: 'Educación', icon: 'GraduationCap', color: '#06b6d4', type: 'expense' },
  { name: 'Hogar', icon: 'Home', color: '#84cc16', type: 'expense' },
  { name: 'Mercado', icon: 'ShoppingCart', color: '#f59e0b', type: 'expense' },
  { name: 'Otros gastos', icon: 'Package', color: '#6b7280', type: 'expense' },
  { name: 'Salario', icon: 'Briefcase', color: '#10b981', type: 'income' },
  { name: 'Freelance', icon: 'Laptop', color: '#6366f1', type: 'income' },
  { name: 'Negocio', icon: 'Store', color: '#f59e0b', type: 'income' },
  { name: 'Otros ingresos', icon: 'Wallet', color: '#14b8a6', type: 'income' },
]

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    if (!user) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [user])

  const seedDefaults = async () => {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    if (existing?.length === 0) {
      await supabase.from('categories').insert(
        DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: user.id }))
      )
      fetchCategories()
    }
  }

  const add = async (category) => {
    const { error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
    if (!error) fetchCategories()
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) fetchCategories()
    return { error }
  }

  return { categories, loading, add, remove, seedDefaults, refresh: fetchCategories }
}
