import Link from 'next/link'
import { Search, TrendingUp, Shield, MapPin, ArrowRight, Building2, Home, Waves } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PropertyCard from '@/components/PropertyCard'

async function getProperties() {
  const { data } = await supabase.from('v_properties_public').select('*').order('featured', { ascending: false }).limit(6)
  return data || []
}

const ZONES = [
  { name: 'Centro PDC', slug: 'centro-pdc', emoji: '🏙️' },
  { name: 'Playacar', slug: 'playacar', emoji: '🏌️' },
  { name: 'Tulum', slug: 'tulum-centro', emoji: '🌿' },
  { name: 'Aldea Zamá', slug: 'aldea-zama', emoji: '✨' },
  { name: 'Puerto Morelos', slug: 'puerto-morelos', emoji: '⚓' },
  { name: 'Akumal', slug: 'akumal', emoji: '🐢' },
]

export default async function HomePage() {
  const properties = await getProperties()
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ketsal-gold text-sm font-semibold tracking-widest uppercase mb-4">Riviera Maya · Playa del Carmen · Tulum</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Tu paraíso en la<br /><span className="text-ketsal-gold">Riviera Maya</span></h1>
          <p className="text-green-200 text-lg mb-10 max-w-xl mx-auto">Propiedades exclusivas en venta, renta y vacacional en las mejores zonas del Caribe mexicano.</p>
          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl">
            <select className="flex-1 px-4 py-3 text-gray-700 focus:outline-none rounded-xl">
              <option value="">¿Qué buscas?</option>
              <option value="venta">Comprar</option>
              <option value="renta">Rentar</option>
              <option value="vacacional">Vacacional</option>
            </select>
            <select className="flex-1 px-4 py-3 text-gray-700 focus:outline-none rounded-xl border-l border-gray-200">
              <option value="">Zona</option>
              <option value="centro-pdc">Centro PDC</option>
              <option value="playacar">Playacar</option>
              <option value="tulum-centro">Tulum</option>
            </select>
            <Link href="/propiedades" className="bg-ketsal-green text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-ketsal-green-light transition-colors whitespace-nowrap">
              <Search className="w-4 h-4" /> Buscar
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm">
            <div className="text-center"><p className="text-2xl font-bold text-ketsal-gold">500+</p><p className="text-green-300">Propiedades</p></div>
            <div className="w-px h-8 bg-green-700 hidden sm:block" />
            <div className="text-center"><p className="text-2xl font-bold text-ketsal-gold">10</p><p className="text-green-300">Zonas</p></div>
            <div className="w-px h-8 bg-green-700 hidden sm:block" />
            <div className="text-center"><p className="text-2xl font-bold text-ketsal-gold">98%</p><p className="text-green-300">Satisfacción</p></div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Building2 className="w-8 h-8" />, type: 'venta', label: 'Comprar', desc: 'Invierte en tu propiedad ideal', color: 'bg-blue-600' },
            { icon: <Home className="w-8 h-8" />, type: 'renta', label: 'Rentar', desc: 'Encuentra tu hogar mensual', color: 'bg-ketsal-green' },
            { icon: <Waves className="w-8 h-8" />, type: 'vacacional', label: 'Vacacional', desc: 'Tu escape al paraíso caribeño', color: 'bg-amber-600' },
          ].map(item => (
            <Link key={item.type} href={`/propiedades?type=${item.type}`}>
              <div className={`${item.color} text-white rounded-2xl p-8 hover:opacity-90 transition-opacity cursor-pointer`}>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{item.label}</h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium">Ver propiedades <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Properties */}
      {properties.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div><h2 className="text-3xl font-bold text-gray-900">Propiedades destacadas</h2><p className="text-gray-500 mt-1">Las mejores oportunidades en Riviera Maya</p></div>
              <Link href="/propiedades" className="text-sm font-medium text-ketsal-green hover:underline flex items-center gap-1">Ver todas <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Zones */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-900">Explora por zona</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ZONES.map(zone => (
              <Link key={zone.slug} href={`/propiedades?zone=${zone.slug}`}>
                <div className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-100 group cursor-pointer">
                  <div className="text-3xl mb-2">{zone.emoji}</div>
                  <h3 className="font-semibold text-sm text-gray-900 group-hover:text-ketsal-green transition-colors">{zone.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-900">¿Por qué Ketsal?</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="w-8 h-8 text-ketsal-green" />, title: 'Especialistas locales', desc: 'Conocemos cada rincón de la Riviera Maya.' },
              { icon: <Shield className="w-8 h-8 text-ketsal-green" />, title: 'Transacciones seguras', desc: 'Proceso transparente y verificado.' },
              { icon: <TrendingUp className="w-8 h-8 text-ketsal-green" />, title: 'Mejor inversión', desc: 'La Riviera Maya crece año con año.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-ketsal-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 gradient-hero text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para encontrar tu propiedad?</h2>
          <p className="text-green-200 mb-8">Habla con un asesor y encuentra la propiedad de tus sueños.</p>
          <a href="https://wa.me/529841234567?text=Hola%2C%20me%20interesa%20una%20propiedad" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-2xl hover:bg-[#20BD5C] transition-colors text-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contactar ahora
          </a>
        </div>
      </section>
    </div>
  )
}