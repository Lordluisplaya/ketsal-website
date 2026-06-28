import Link from 'next/link'
import { Bed, Bath, Maximize, MapPin, Star } from 'lucide-react'
import { Property } from '@/lib/types'

function formatPrice(price: number, currency: string, type: string, period?: string | null) {
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency === 'USD' ? 'USD' : 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price)
  if (type === 'vacacional') return `${fmt}/noche`
  if (type === 'renta') return `${fmt}/mes`
  return fmt
}

const TYPE_COLORS: Record<string, string> = { venta: 'bg-blue-100 text-blue-700', renta: 'bg-emerald-100 text-emerald-700', vacacional: 'bg-amber-100 text-amber-700' }
const TYPE_LABELS: Record<string, string> = { venta: 'Venta', renta: 'Renta', vacacional: 'Vacacional' }

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/propiedades/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {property.cover_photo ? (
            <img src={property.cover_photo} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ketsal-green/20 to-ketsal-gold/20 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-ketsal-green/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[property.type]}`}>{TYPE_LABELS[property.type]}</span>
            {property.featured && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ketsal-gold text-white flex items-center gap-1"><Star className="w-3 h-3" /> Destacada</span>}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{property.zone_name || 'Riviera Maya'}{property.zone_city ? `, ${property.zone_city}` : ''}</p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-ketsal-green transition-colors">{property.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {property.bedrooms != null && property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>}
            {property.bathrooms != null && property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>}
            {property.area_sqm && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{property.area_sqm}m²</span>}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-ketsal-green">{formatPrice(property.price, property.currency, property.type, property.price_period)}</p>
            <span className="text-xs text-gray-400 capitalize">{property.property_kind}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}