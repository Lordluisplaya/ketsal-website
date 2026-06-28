import Link from 'next/link'
import { Home, Instagram, Facebook, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ketsal-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-ketsal-gold rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-ketsal-green" />
              </div>
              <span className="text-xl font-bold">Ketsal Real Estate</span>
            </div>
            <p className="text-green-200 text-sm leading-relaxed max-w-sm">Tu aliado en bienes raíces en Playa del Carmen y la Riviera Maya. Venta, renta y renta vacacional.</p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-green-200 hover:text-ketsal-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-green-200 hover:text-ketsal-gold transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="tel:+529841234567" className="text-green-200 hover:text-ketsal-gold transition-colors"><Phone className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-ketsal-gold mb-4">Propiedades</h3>
            <ul className="space-y-2 text-sm text-green-200">
              <li><Link href="/propiedades?type=venta" className="hover:text-white transition-colors">Venta</Link></li>
              <li><Link href="/propiedades?type=renta" className="hover:text-white transition-colors">Renta mensual</Link></li>
              <li><Link href="/propiedades?type=vacacional" className="hover:text-white transition-colors">Vacacional</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-ketsal-gold mb-4">Zonas</h3>
            <ul className="space-y-2 text-sm text-green-200">
              <li><Link href="/propiedades?zone=centro-pdc" className="hover:text-white transition-colors">Centro PDC</Link></li>
              <li><Link href="/propiedades?zone=playacar" className="hover:text-white transition-colors">Playacar</Link></li>
              <li><Link href="/propiedades?zone=aldea-zama" className="hover:text-white transition-colors">Aldea Zamá</Link></li>
              <li><Link href="/propiedades?zone=tulum-centro" className="hover:text-white transition-colors">Tulum</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-green-300">
          <p>© 2025 Ketsal Real Estate · Playa del Carmen, Q.Roo, México</p>
        </div>
      </div>
    </footer>
  )
}