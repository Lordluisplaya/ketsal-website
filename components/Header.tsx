'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ketsal-green rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-ketsal-green">Ketsal</span>
            <span className="text-xs text-ketsal-gold font-semibold tracking-widest uppercase hidden sm:block">Real Estate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/propiedades?type=venta" className="text-sm font-medium text-gray-600 hover:text-ketsal-green transition-colors">Venta</Link>
            <Link href="/propiedades?type=renta" className="text-sm font-medium text-gray-600 hover:text-ketsal-green transition-colors">Renta</Link>
            <Link href="/propiedades?type=vacacional" className="text-sm font-medium text-gray-600 hover:text-ketsal-green transition-colors">Vacacional</Link>
            <Link href="/propiedades" className="text-sm font-medium text-gray-600 hover:text-ketsal-green transition-colors">Todas</Link>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/529841234567?text=Hola,%20me%20interesa%20una%20propiedad" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 bg-ketsal-green text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-ketsal-green-light transition-colors">
              WhatsApp
            </a>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <Link href="/propiedades?type=venta" className="text-sm font-medium text-gray-600">Venta</Link>
              <Link href="/propiedades?type=renta" className="text-sm font-medium text-gray-600">Renta</Link>
              <Link href="/propiedades?type=vacacional" className="text-sm font-medium text-gray-600">Vacacional</Link>
              <Link href="/propiedades" className="text-sm font-medium text-gray-600">Todas</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}