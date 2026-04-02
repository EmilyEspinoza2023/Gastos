import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useTransactions(filters = {}) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('transactions')
      .select('*, categories(name, color, icon)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (filters.month) {
      const start = `${filters.month}-01`
      const end = new Date(filters.month + '-01')
      end.setMonth(end.getMonth() + 1)
      query = query.gte('date', start).lt('date', end.toISOString().slice(0, 10))
    }
    if (filters.type) query = query.eq('type', filters.type)
    if (filters.category_id) query = query.eq('category_id', filters.category_id)

    const { data } = await query
    setTransactions(data ?? [])
    setLoading(false)
  }, [user, filters.month, filters.type, filters.category_id])

  useEffect(() => { fetch() }, [fetch])

  const add = async (transaction) => {
    const { error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
    if (!error) fetch()
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) fetch()
    return { error }
  }

  const update = async (id, changes) => {
    const { error } = await supabase
      .from('transactions')
      .update(changes)
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) fetch()
    return { error }
  }

  return { transactions, loading, add, remove, update, refresh: fetch }
}
