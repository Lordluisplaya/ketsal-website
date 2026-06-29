import Link from 'next/link'
import { Bed, Bath, Maximize, MapPin, Star } from 'lucide-react'
import { Property } from '@/lib/types'

function formatPrice(price: number, currency: string, type: string, period?: string | null) {
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency === 'USD' ? 'USD' : 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price)
  if (type === 'vacacional') return `${fmt}/noche`
  if (type === 'renta') return `${fmt}/mes`
  return fmt
}

const BADGE: Record<string,{label:string,bg:string,text:string}> = {
  venta:      { label: 'VENTA',      bg: '#1A1AE0', text: 'white' },
  renta:      { label: 'RENTA',      bg: '#0A0A3E', text: 'white' },
  vacacional: { label: 'VACACIONAL', bg: '#D4AF6A', text: '#03030F' },
}

const PRICE_COLOR: Record<string,string> = {
  venta: '#1A1AE0',
  renta: '#1A1AE0',
  vacacional: '#A8843E',
}

const CARD_BG: Record<string,string> = {
  venta:      'linear-gradient(135deg,#1A1AE0 0%,#0A0A3E 100%)',
  renta:      'linear-gradient(135deg,#0A0A3E 0%,#03030F 100%)',
  vacacional: 'linear-gradient(135deg,#D4AF6A 0%,#A8843E 100%)',
}

export default function PropertyCard({ property }: { property: Property }) {
  const badge = BADGE[property.type]
  return (
    <Link href={`/propiedades/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-ketsal-cobalt/10 transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden" style={{background: property.cover_photo ? undefined : CARD_BG[property.type]}}>
          {property.cover_photo
            ? <img src={property.cover_photo} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full flex items-center justify-center opacity-30">
                <MapPin className="w-10 h-10 text-white" />
              </div>
          }
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="font-brand text-[10px] font-700 px-2.5 py-1 rounded tracking-wide" style={{background:badge.bg, color:badge.text}}>
              {badge.label}
            </span>
            {property.featured && (
              <span className="font-brand text-[10px] font-700 px-2.5 py-1 rounded tracking-wide flex items-center gap-1" style={{background:'#03030F',color:'#D4AF6A'}}>
                <Star className="w-2.5 h-2.5" /> TOP
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{property.zone_name || 'Riviera Maya'}{property.zone_city ? `, ${property.zone_city}` : ''}
          </p>
          <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-ketsal-cobalt transition-colors text-sm leading-snug">
            {property.title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            {!!property.bedrooms && property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bedrooms} rec</span>}
            {!!property.bathrooms && property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms} baños</span>}
            {!!property.area_sqm && <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.area_sqm}m²</span>}
          </div>
          <div className="flex items-end justify-between pt-3 border-t border-gray-50">
            <p className="text-lg font-bold" style={{color: PRICE_COLOR[property.type]}}>
              {formatPrice(property.price, property.currency, property.type, property.price_period)}
            </p>
            <span className="text-[10px] text-gray-300 capitalize font-brand tracking-wide">{property.property_kind}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}