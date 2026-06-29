import Link from 'next/link'
import { Instagram, Facebook, Phone } from 'lucide-react'

const QuetzalLogo = () => (
  <svg width="28" height="34" viewBox="0 0 200 240" fill="white" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="42" r="13"/>
    <path d="M87,58 L100,50 L113,58 L110,88 L100,94 L90,88 Z"/>
    <path d="M87,72 C72,63 48,48 22,30 C26,39 32,45 40,50 C55,58 73,66 87,78"/>
    <path d="M87,78 C69,71 44,58 20,42 C24,51 30,57 38,62 C54,69 72,75 87,83"/>
    <path d="M113,72 C128,63 152,48 178,30 C174,39 168,45 160,50 C145,58 127,66 113,78"/>
    <path d="M113,78 C131,71 156,58 180,42 C176,51 170,57 162,62 C146,69 128,75 113,83"/>
    <path d="M100,95 C99,116 98,140 97,165 C100,165 103,140 102,116 Z"/>
    <path d="M89,91 C80,115 68,140 55,165 C59,163 64,153 70,135 C76,116 83,98 91,91 Z"/>
    <path d="M111,91 C120,115 132,140 145,165 C141,163 136,153 130,135 C124,116 117,98 109,91 Z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer style={{background:'linear-gradient(135deg,#000000 0%,#03030F 30%,#0A0A3E 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-ketsal-cobalt/20 border border-white/10 flex items-center justify-center">
                <QuetzalLogo />
              </div>
              <div>
                <div className="font-brand font-bold text-white tracking-brand text-base">KETSAL</div>
                <div className="font-brand text-white/40 text-[9px] tracking-widest uppercase">Real Estate</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">Tu aliado en bienes raíces en Playa del Carmen y la Riviera Maya. Venta, renta y renta vacacional.</p>
            <div className="flex items-center gap-5 mt-6">
              <a href="#" className="text-white/30 hover:text-ketsal-cobalt-light transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white/30 hover:text-ketsal-cobalt-light transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="tel:+529841234567" className="text-white/30 hover:text-ketsal-cobalt-light transition-colors"><Phone className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-brand text-[10px] font-600 text-ketsal-cobalt-light tracking-widest uppercase mb-5">Propiedades</h3>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link href="/propiedades?type=venta" className="hover:text-white transition-colors">Venta</Link></li>
              <li><Link href="/propiedades?type=renta" className="hover:text-white transition-colors">Renta mensual</Link></li>
              <li><Link href="/propiedades?type=vacacional" className="hover:text-white transition-colors">Vacacional</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-brand text-[10px] font-600 text-ketsal-cobalt-light tracking-widest uppercase mb-5">Zonas</h3>
            <ul className="space-y-3 text-sm text-white/40">
              <li><Link href="/propiedades?zone=centro-pdc" className="hover:text-white transition-colors">Centro PDC</Link></li>
              <li><Link href="/propiedades?zone=playacar" className="hover:text-white transition-colors">Playacar</Link></li>
              <li><Link href="/propiedades?zone=aldea-zama" className="hover:text-white transition-colors">Aldea Zamá</Link></li>
              <li><Link href="/propiedades?zone=tulum-centro" className="hover:text-white transition-colors">Tulum</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20 font-brand tracking-wide">© 2025 KETSAL REAL ESTATE · PLAYA DEL CARMEN, Q.ROO</p>
          <Link href="/admin" className="text-xs text-white/10 hover:text-white/30 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}