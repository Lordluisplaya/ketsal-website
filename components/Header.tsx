'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const QuetzalLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240" fill="white" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="42" r="13"/>
    <path d="M87,58 L100,50 L113,58 L110,88 L100,94 L90,88 Z"/>
    <path d="M87,72 C72,63 48,48 22,30 C26,39 32,45 40,50 C55,58 73,66 87,78"/>
    <path d="M87,78 C69,71 44,58 20,42 C24,51 30,57 38,62 C54,69 72,75 87,83"/>
    <path d="M87,83 C72,78 50,68 28,55 C32,63 37,68 45,72 C59,78 74,82 87,88"/>
    <path d="M113,72 C128,63 152,48 178,30 C174,39 168,45 160,50 C145,58 127,66 113,78"/>
    <path d="M113,78 C131,71 156,58 180,42 C176,51 170,57 162,62 C146,69 128,75 113,83"/>
    <path d="M113,83 C128,78 150,68 172,55 C168,63 163,68 155,72 C141,78 126,82 113,88"/>
    <path d="M93,92 C87,112 80,135 72,160 C76,158 79,150 83,135 C87,118 91,100 95,92 Z"/>
    <path d="M100,95 C99,116 98,140 97,165 C100,165 103,140 102,116 C101,100 100,95 100,95 Z"/>
    <path d="M107,92 C113,112 120,135 128,160 C124,158 121,150 117,135 C113,118 109,100 105,92 Z"/>
    <path d="M89,91 C80,115 68,140 55,165 C59,163 64,153 70,135 C76,116 83,98 91,91 Z"/>
    <path d="M111,91 C120,115 132,140 145,165 C141,163 136,153 130,135 C124,116 117,98 109,91 Z"/>
  </svg>
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="bg-ketsal-black border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ketsal-cobalt to-ketsal-navy flex items-center justify-center">
              <QuetzalLogo size={22} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-brand font-bold text-white tracking-brand text-sm">KETSAL</span>
              <span className="font-brand text-ketsal-muted text-[9px] tracking-widest uppercase">Real Estate</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[['Venta','/propiedades?type=venta'],['Renta','/propiedades?type=renta'],['Vacacional','/propiedades?type=vacacional'],['Propiedades','/propiedades']].map(([label,href]) => (
              <Link key={href} href={href} className="font-brand text-xs font-500 text-white/50 hover:text-white tracking-wide2 uppercase transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="https://wa.me/529841234567?text=Hola,%20me%20interesa%20una%20propiedad" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-ketsal-cobalt hover:bg-ketsal-cobalt-light text-white font-brand text-xs font-600 px-4 py-2 rounded-lg tracking-wide transition-colors uppercase">
              Contactar
            </a>
            <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <nav className="flex flex-col gap-4">
              {[['Venta','/propiedades?type=venta'],['Renta','/propiedades?type=renta'],['Vacacional','/propiedades?type=vacacional'],['Todas','/propiedades']].map(([label,href]) => (
                <Link key={href} href={href} className="font-brand text-xs text-white/60 hover:text-white uppercase tracking-wide transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}