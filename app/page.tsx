import Link from 'next/link'
import { Search, TrendingUp, Shield, MapPin, ArrowRight, Building2, Home, Waves } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PropertyCard from '@/components/PropertyCard'

async function getProperties() {
  const { data } = await supabase.from('v_properties_public').select('*').order('featured',{ascending:false}).limit(6)
  return data || []
}

const ZONES = [
  { name: 'Centro PDC', slug: 'centro-pdc', emoji: '🏙️', desc: '5ta Avenida' },
  { name: 'Playacar', slug: 'playacar', emoji: '🏌️', desc: 'Zona de lujo' },
  { name: 'Tulum', slug: 'tulum-centro', emoji: '🌿', desc: 'Selva & cenotes' },
  { name: 'Aldea Zamá', slug: 'aldea-zama', emoji: '✨', desc: 'Exclusivo Tulum' },
  { name: 'Puerto Morelos', slug: 'puerto-morelos', emoji: '⚓', desc: 'Pueblo mágico' },
  { name: 'Akumal', slug: 'akumal', emoji: '🐢', desc: 'Tortugas marinas' },
]

export default async function HomePage() {
  const properties = await getProperties()
  return (
    <div>
      {/* HERO */}
      <section className="gradient-hero text-white relative overflow-hidden" style={{minHeight:'92vh',display:'flex',alignItems:'center'}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 20% 80%, #1A1AE0 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6B6BFF 0%, transparent 50%)'}} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <p className="font-brand text-xs font-600 tracking-[0.3em] text-ketsal-cobalt-light uppercase mb-6">
              Playa del Carmen · Tulum · Riviera Maya
            </p>
            <h1 className="font-brand font-900 text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6 tracking-tight">
              Tu paraíso en<br />
              <span className="text-gradient-cobalt">la Riviera Maya</span>
            </h1>
            <p className="text-white/50 text-lg mb-12 max-w-lg leading-relaxed">
              Propiedades exclusivas en venta, renta y vacacional. Descubre el Caribe mexicano con los expertos locales.
            </p>

            {/* Search */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <select className="flex-1 bg-transparent text-white/70 px-4 py-3 focus:outline-none text-sm appearance-none cursor-pointer">
                <option className="text-gray-900" value="">¿Qué buscas?</option>
                <option className="text-gray-900" value="venta">Comprar</option>
                <option className="text-gray-900" value="renta">Rentar</option>
                <option className="text-gray-900" value="vacacional">Vacacional</option>
              </select>
              <div className="hidden sm:block w-px bg-white/10 my-2" />
              <select className="flex-1 bg-transparent text-white/70 px-4 py-3 focus:outline-none text-sm appearance-none cursor-pointer">
                <option className="text-gray-900" value="">Zona</option>
                <option className="text-gray-900" value="centro-pdc">Centro PDC</option>
                <option className="text-gray-900" value="playacar">Playacar</option>
                <option className="text-gray-900" value="tulum-centro">Tulum</option>
                <option className="text-gray-900" value="aldea-zama">Aldea Zamá</option>
              </select>
              <Link href="/propiedades" className="bg-ketsal-cobalt hover:bg-ketsal-cobalt-light text-white font-brand font-600 text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide transition-colors whitespace-nowrap">
                <Search className="w-4 h-4" /> Buscar
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/5">
              {[['500+','Propiedades'],['10','Zonas'],['5 años','Experiencia']].map(([n,l]) => (
                <div key={l}>
                  <p className="font-brand font-800 text-2xl text-white">{n}</p>
                  <p className="text-white/30 text-xs font-brand tracking-wide uppercase mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIPOS */}
      <section className="py-20 px-4 bg-ketsal-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <Building2 className="w-7 h-7" />, type: 'venta', label: 'Comprar', desc: 'Invierte en tu propiedad ideal en el Caribe', style: 'gradient-hero' },
              { icon: <Home className="w-7 h-7" />, type: 'renta', label: 'Rentar', desc: 'Tu hogar mensual en la Riviera Maya', style: '' },
              { icon: <Waves className="w-7 h-7" />, type: 'vacacional', label: 'Vacacional', desc: 'Escapes de lujo por noche o semana', style: '' },
            ].map((item, i) => (
              <Link key={item.type} href={`/propiedades?type=${item.type}`}>
                <div className={`rounded-2xl p-8 cursor-pointer hover:scale-[1.01] transition-transform ${i === 0 ? 'gradient-hero text-white' : i === 1 ? 'bg-ketsal-navy text-white' : 'bg-ketsal-gold text-ketsal-black'}`}>
                  <div className="mb-5 opacity-80">{item.icon}</div>
                  <h3 className="font-brand font-800 text-2xl mb-2 tracking-wide">{item.label}</h3>
                  <p className={`text-sm leading-relaxed mb-6 ${i < 2 ? 'text-white/50' : 'text-ketsal-black/50'}`}>{item.desc}</p>
                  <div className={`flex items-center gap-2 text-xs font-brand font-600 uppercase tracking-wide ${i < 2 ? 'text-ketsal-cobalt-light' : 'text-ketsal-black/60'}`}>
                    Ver propiedades <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROPIEDADES */}
      {properties.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-brand text-xs text-ketsal-cobalt tracking-[0.25em] uppercase mb-2">Selección curada</p>
                <h2 className="font-brand font-800 text-3xl text-ketsal-black tracking-wide2">Propiedades destacadas</h2>
              </div>
              <Link href="/propiedades" className="text-sm font-brand font-500 text-ketsal-cobalt hover:text-ketsal-navy flex items-center gap-1.5 uppercase tracking-wide transition-colors">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ZONAS */}
      <section className="py-20 px-4 bg-ketsal-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-brand text-xs text-ketsal-cobalt tracking-[0.25em] uppercase mb-2">Destinos</p>
            <h2 className="font-brand font-800 text-3xl text-ketsal-black tracking-wide2">Explora por zona</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ZONES.map(zone => (
              <Link key={zone.slug} href={`/propiedades?zone=${zone.slug}`}>
                <div className="bg-white rounded-xl p-4 text-center hover:shadow-lg hover:shadow-ketsal-cobalt/10 transition-all group border border-gray-100 hover:border-ketsal-cobalt/20">
                  <div className="text-2xl mb-2">{zone.emoji}</div>
                  <h3 className="font-brand font-600 text-xs text-ketsal-black group-hover:text-ketsal-cobalt transition-colors tracking-wide">{zone.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{zone.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-brand text-xs text-ketsal-cobalt tracking-[0.25em] uppercase mb-2">Nuestra diferencia</p>
            <h2 className="font-brand font-800 text-3xl text-ketsal-black tracking-wide2">¿Por qué Ketsal?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="w-7 h-7 text-ketsal-cobalt" />, title: 'Especialistas locales', desc: 'Conocemos cada calle, zona y proyecto de la Riviera Maya.' },
              { icon: <Shield className="w-7 h-7 text-ketsal-cobalt" />, title: 'Proceso transparente', desc: 'Acompañamiento completo con total claridad en cada paso.' },
              { icon: <TrendingUp className="w-7 h-7 text-ketsal-cobalt" />, title: 'Inversión inteligente', desc: 'La Riviera Maya es la zona de mayor crecimiento inmobiliario de México.' },
            ].map(item => (
              <div key={item.title} className="group p-8 rounded-2xl border border-gray-100 hover:border-ketsal-cobalt/20 hover:shadow-lg hover:shadow-ketsal-cobalt/5 transition-all">
                <div className="w-12 h-12 bg-ketsal-surface rounded-xl flex items-center justify-center mb-5 group-hover:bg-ketsal-cobalt/5 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-brand font-700 text-base text-ketsal-black mb-2 tracking-wide2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-brand text-xs text-ketsal-cobalt-light tracking-[0.3em] uppercase mb-4">¿Listo para empezar?</p>
          <h2 className="font-brand font-800 text-4xl text-white mb-4 tracking-wide2">Encuentra tu propiedad ideal</h2>
          <p className="text-white/40 mb-10">Habla con un asesor ahora mismo y descubre las mejores oportunidades en el Caribe mexicano.</p>
          <a href="https://wa.me/529841234567?text=Hola%2C%20me%20interesa%20una%20propiedad%20en%20la%20Riviera%20Maya" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5C] text-white font-brand font-700 px-8 py-4 rounded-xl transition-colors text-sm uppercase tracking-wide">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Contactar ahora
          </a>
        </div>
      </section>
    </div>
  )
}