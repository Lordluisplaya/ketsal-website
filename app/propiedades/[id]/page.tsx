import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize2, MessageSquare } from 'lucide-react'
import ChatWidget from '@/components/ChatWidget'

async function getProperty(id: string) {
  const { data } = await supabase.from('v_properties_public').select('*').eq('id', id).single()
  return data
}

const BADGE: Record<string, string> = {
  venta: 'bg-ketsal-cobalt text-white',
  renta: 'bg-ketsal-navy text-white',
  vacacional: 'bg-ketsal-gold text-ketsal-black',
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const p = await getProperty(params.id)
  if (!p) notFound()

  const tipo = p.type || 'venta'
  const priceLabel = p.price_period === 'noche' ? '/ noche' : p.price_period === 'mes' ? '/ mes' : ''
  const price = p.price ? `$${Number(p.price).toLocaleString()} ${p.currency || 'USD'} ${priceLabel}`.trim() : null

  return (
    <div className="min-h-screen bg-ketsal-surface">
      <div className="bg-ketsal-black py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/propiedades" className="inline-flex items-center gap-2 text-xs font-brand text-white/40 hover:text-ketsal-cobalt-light transition-colors uppercase tracking-wide">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
        </div>
      </div>

      <div className="gradient-hero h-[50vh] flex items-center justify-center relative overflow-hidden">
        {p.cover_photo ? (
          <img src={p.cover_photo} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        ) : (
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 50% 50%, #1A1AE0 0%, transparent 60%)'}} />
        )}
        <div className="relative z-10 text-center px-4">
          <span className={`inline-block text-[10px] font-brand font-700 uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 ${BADGE[tipo] || 'bg-white/20 text-white'}`}>
            {tipo}
          </span>
          <h1 className="font-brand font-800 text-3xl sm:text-4xl text-white mb-2 tracking-wide2">{p.title}</h1>
          {p.zone_name && (
            <p className="flex items-center justify-center gap-1.5 text-white/50 text-sm">
              <MapPin className="w-3.5 h-3.5" /> {p.zone_name}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="font-brand font-700 text-sm uppercase tracking-wide text-ketsal-black/40 mb-4">Detalles</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              {p.bedrooms > 0 && <div className="flex items-center gap-2 text-sm text-ketsal-black/60"><BedDouble className="w-4 h-4 text-ketsal-cobalt" />{p.bedrooms} recámaras</div>}
              {p.bathrooms > 0 && <div className="flex items-center gap-2 text-sm text-ketsal-black/60"><Bath className="w-4 h-4 text-ketsal-cobalt" />{p.bathrooms} baños</div>}
              {p.area_sqm > 0 && <div className="flex items-center gap-2 text-sm text-ketsal-black/60"><Maximize2 className="w-4 h-4 text-ketsal-cobalt" />{p.area_sqm} m²</div>}
            </div>
            {p.description && <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              {p.pool && <span className="text-[11px] bg-ketsal-surface text-ketsal-navy font-brand px-3 py-1 rounded-full">🏊 Alberca</span>}
              {p.parking && <span className="text-[11px] bg-ketsal-surface text-ketsal-navy font-brand px-3 py-1 rounded-full">🚗 Estacionamiento</span>}
              {p.ocean_view && <span className="text-[11px] bg-ketsal-surface text-ketsal-navy font-brand px-3 py-1 rounded-full">🌊 Vista al mar</span>}
              {p.pet_friendly && <span className="text-[11px] bg-ketsal-surface text-ketsal-navy font-brand px-3 py-1 rounded-full">🐾 Pet friendly</span>}
              {p.furnished && <span className="text-[11px] bg-ketsal-surface text-ketsal-navy font-brand px-3 py-1 rounded-full">🛋️ Amueblado</span>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
              <MessageSquare className="w-4 h-4 text-ketsal-cobalt" />
              <h2 className="font-brand font-700 text-sm uppercase tracking-wide text-ketsal-black/40">Preguntar sobre esta propiedad</h2>
            </div>
            <ChatWidget propertyId={p.id} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-ketsal-black rounded-2xl p-6 text-white">
            {price && (
              <div className="mb-4">
                <p className="text-xs font-brand text-white/30 uppercase tracking-wide mb-1">Precio</p>
                <p className={`font-brand font-800 text-2xl ${tipo === 'vacacional' ? 'text-ketsal-gold' : 'text-ketsal-cobalt-light'}`}>{price}</p>
              </div>
            )}
            <a href={`https://wa.me/529841234567?text=Hola%2C%20me%20interesa%3A%20${encodeURIComponent(p.title || '')}`}
              target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5C] text-white font-brand font-700 text-xs py-3 rounded-xl transition-colors uppercase tracking-wide mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="mailto:contacto@ketsal.mx"
              className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-ketsal-cobalt/50 text-white/60 hover:text-ketsal-cobalt-light font-brand font-600 text-xs py-3 rounded-xl transition-all uppercase tracking-wide">
              Enviar correo
            </a>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-xs font-brand uppercase tracking-wide text-gray-300 mb-2">Zona</p>
            <p className="font-brand font-700 text-sm text-ketsal-black">{p.zone_name || 'Riviera Maya'}</p>
            {p.zone_city && <p className="text-xs text-gray-400 mt-0.5">{p.zone_city}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}