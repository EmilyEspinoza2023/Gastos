import {
  UtensilsCrossed, Car, HeartPulse, Gamepad2, Shirt, GraduationCap,
  Home, Package, Briefcase, Laptop, Store, Wallet, Plane, Music,
  Dumbbell, ShoppingCart, Coffee, Gift, Fuel, Tv, Baby, PawPrint,
  Wrench, Bus, Bike, Pizza, Apple, Zap, Sparkles, CreditCard,
  TrendingUp, TrendingDown, DollarSign, LayoutDashboard, List,
  Tag, Download, Plus, LogOut, Trash2, ChevronLeft, ChevronRight,
  FileSpreadsheet, FileText, X, Search, Bell, Settings, BarChart3
} from 'lucide-react'

export const CATEGORY_ICONS = {
  UtensilsCrossed, Car, HeartPulse, Gamepad2, Shirt, GraduationCap,
  Home, Package, Briefcase, Laptop, Store, Wallet, Plane, Music,
  Dumbbell, ShoppingCart, Coffee, Gift, Fuel, Tv, Baby, PawPrint,
  Wrench, Bus, Bike, Pizza, Apple, Zap, Sparkles, CreditCard,
}

export const ICON_NAMES = Object.keys(CATEGORY_ICONS)

export function CategoryIcon({ name, size = 18, className = '' }) {
  const Icon = CATEGORY_ICONS[name] || Package
  return <Icon size={size} className={className} strokeWidth={1.75} />
}

export {
  TrendingUp, TrendingDown, DollarSign, LayoutDashboard, List,
  Tag, Download, Plus, LogOut, Trash2, ChevronLeft, ChevronRight,
  FileSpreadsheet, FileText, X, Search, Bell, Settings, BarChart3,
  Wallet, Home, Package
}
