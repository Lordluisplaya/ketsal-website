import Link from 'next/link'
import { Property } from '@/lib/types'

function formatPrice(price: number | null, type: string, period?: string | null) {
  if (!price || price === 0) return 'Precio a consultar'
  const f = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  if (type === 'renta' || type === 'vacacional') return f + ' / ' + (period === 'noche' ? 'noche' : 'mes')
  return f
}

function typeLabel(type: string) {
  return ({ venta: 'Venta', renta: 'Renta', vacacional: 'Vacacional' } as Record<string,string>)[type] || type
}
function kindLabel(kind: string) {
  return ({ departamento: 'Depto', casa: 'Casa', villa: 'Villa', terreno: 'Terreno', local: 'Local', oficina: 'Oficina', studio: 'Studio', penthouse: 'Penthouse' } as Record<string,string>)[kind] || kind
}

export default function PropertyCard({ property: p }: { property: Property }) {
  return (
    <Link href={`/propiedades/${p.id}`} className="property-card">
      <div className="property-card__image">
        {p.cover_photo
          ? <img src={p.cover_photo} alt={p.title || 'Propiedad'} loading="lazy" />
          : <div style={{width:'100%',height:'100%',background:'var(--cream-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
        }
        <div className="property-card__badges">
          {p.type && <span className={`badge badge--type-${p.type}`}>{typeLabel(p.type)}</span>}
          {p.property_kind && <span className="badge badge--kind">{kindLabel(p.property_kind)}</span>}
        </div>
      </div>
      <div className="property-card__body">
        <div className="property-card__price">{formatPrice(p.price, p.type, p.price_period)}</div>
        <div className="property-card__title">{p.title || 'Propiedad en Riviera Maya'}</div>
        {(p.neighborhood || p.address) && (
          <div className="property-card__location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {p.neighborhood || p.address}
          </div>
        )}
        <div className="property-card__specs">
          {(p.bedrooms ?? 0) > 0 && (
            <div className="property-card__spec">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M22 4v16M2 12h20M2 8h5a2 2 0 012 2v2H2V8zM15 8h5v4h-7v-2a2 2 0 012-2z"/></svg>
              {p.bedrooms} rec
            </div>
          )}
          {(p.bathrooms ?? 0) > 0 && (
            <div className="property-card__spec">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1zM6 12V5a2 2 0 012-2h3v2.25"/></svg>
              {p.bathrooms} ba
            </div>
          )}
          {p.area_sqm && (
            <div className="property-card__spec property-card__spec-area">
              {p.area_sqm} m²
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
