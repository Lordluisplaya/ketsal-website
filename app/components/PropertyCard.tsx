import Link from 'next/link'
import { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (p: Property): string => {
    if (!p.price) return 'Consultar precio'
    const formatted = p.price.toLocaleString('es-MX')
    if (p.type === 'renta' || p.type === 'vacacional') {
      return 'USD $' + formatted + '/' + (p.price_period || 'mes')
    }
    return 'USD $' + formatted
  }

  const typeLabel: Record<string, string> = { venta: 'Venta', renta: 'Renta', vacacional: 'Vacacional' }

  return (
    <Link href={'/propiedades/' + property.id} className="property-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="property-card__image-wrap">
        {property.cover_photo ? (
          <img
            src={property.cover_photo}
            alt={property.title}
            className="property-card__image"
          />
        ) : (
          <div className="property-card__placeholder">
            <span>Sin foto</span>
          </div>
        )}
        <span className={'property-card__badge badge-' + property.type}>
          {typeLabel[property.type] || property.type}
        </span>
      </div>

      <div className="property-card__body">
        <p className="property-card__price">{formatPrice(property)}</p>
        <h3 className="property-card__title">{property.title}</h3>
        {property.neighborhood && (
          <p className="property-card__location">{property.neighborhood}</p>
        )}
        <div className="property-card__specs">
          {property.bedrooms != null && (
            <span>{property.bedrooms} rec</span>
          )}
          {property.bathrooms != null && (
            <span>{property.bathrooms} ban</span>
          )}
          {property.area_sqm != null && (
            <span>{property.area_sqm} m2</span>
          )}
        </div>
        <div className="property-card__kind">
          {property.property_kind}
        </div>
      </div>
    </Link>
  )
}