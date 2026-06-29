import Link from 'next/link'
import { MapPin, BedDouble, Bath, Maximize2 } from 'lucide-react'

const BADGE: Record<string, string> = {
  venta: 'bg-ketsal-cobalt text-white',
  renta: 'bg-ketsal-navy text-white',
  vacacional: 'bg-ketsal-gold text-ketsal-black',
}
const PRICE_LABEL: Record<string, string> = { mes: '/mes', noche: '/noche' }

export default function PropertyCard({ property: p }: { property: Record<string, any> }) {
  const price = p.price ? `$${Number(p.price).toLocaleString()} ${p.currency || 'USD'}${PRICE_LABEL[p.price_period] || ''}` : null
  const badgeClass = BADGE[p.type] || 'bg-white/20 text-white'
  const isGold = p.type === 'vacacional'

  return (
    <Link href={`/propiedades/${p.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-ketsal-cobalt/5 transition-all group cursor-pointer">
        {/* Image */}
        <div className={`relative h-52 ${!p.cover_photo ? (p.type === 'venta' ? 'gradient-hero' : p.type === 'renta' ? 'bg-ketsal-navy' : 'bg-ketsal-gold') : ''}`}>
          {p.cover_photo
            ? <img src={p.cover_photo} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="absolute inset-0 flex items-center justify-center opacity-20"><Maximize2 className="w-12 h-12 text-white" /></div>
          }
          <span className={`absolute top-3 left-3 text-[10px] font-brand font-700 uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${badgeClass}`}>
            {p.type}
          </span>
          {p.featured && (
            <span className="absolute top-3 right-3 text-[10px] font-brand font-600 uppercase tracking-wide bg-black/50 text-white px-2 py-0.5 rounded-full">
              Destacada
            </span>
          )}
        </div>
        {/* Content */}
        <div className="p-5">
          <h3 className="font-brand font-700 text-sm text-ketsal-black mb-1.5 leading-snug tracking-wide2 line-clamp-2">{p.title}</h3>
          {(p.zone_name || p.neighborhood) && (
            <p className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {p.zone_name || p.neighborhood}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-gray-300 mb-4">
            {p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>}
            {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>}
            {p.area_sqm > 0 && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{p.area_sqm} m²</span>}
          </div>
          {price && (
            <p className={`font-brand font-800 text-base ${isGold ? 'text-amber-600' : 'text-ketsal-cobalt'}`}>{price}</p>
          )}
        </div>
      </div>
    </Link>
  )
}