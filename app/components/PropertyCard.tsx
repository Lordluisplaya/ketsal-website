'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Property } from '@/lib/types'

function formatPrice(price: number, type: string, period?: string | null) {
  if (!price || price === 0) return 'Precio a consultar'
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(price)
  if (type === 'renta' || type === 'vacacional') {
    return `${formatted}<span class="prop-card__price-note">/${period === 'noche' ? 'noche' : 'mes'}</span>`
  }
  return formatted
}

function typeLabel(type: string) {
  return { venta: 'Venta', renta: 'Renta', vacacional: 'Vacacional' }[type] || type
}

function typeClass(type: string) {
  return `badge badge--type badge--type-${type}`
}

function kindLabel(kind: string) {
  return {
    departamento: 'Departamento', casa: 'Casa', villa: 'Villa',
    terreno: 'Terreno', local: 'Local', oficina: 'Oficina',
    studio: 'Studio', penthouse: 'Penthouse',
  }[kind] || kind
}

export default function PropertyCard({ property: p }: { property: Property }) {
  const [imgError, setImgError] = useState(false)
  const [faved, setFaved] = useState(false)

  const coverImg = p.cover_photo || null
  const amenities = []
  if (p.pool) amenities.push('Alberca')
  if (p.ocean_view) amenities.push('Vista al mar')
  if (p.furnished) amenities.push('Amueblado')
  if (p.beach_access) amenities.push('Acceso playa')
  if (p.parking) amenities.push('Estacionamiento')

  return (
    <Link href={`/propiedades/${p.id}`} className="prop-card" style={{ display: 'block' }}>
      <div className="prop-card__image">
        {coverImg && !imgError ? (
          <img
            src={coverImg}
            alt={p.title || 'Propiedad'}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="prop-card__placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        )}

        <div className="prop-card__badges">
          {p.type && <span className={typeClass(p.type)}>{typeLabel(p.type)}</span>}
          {p.property_kind && <span className="badge badge--kind">{kindLabel(p.property_kind)}</span>}
        </div>

        <button
          className="prop-card__fav"
          onClick={e => { e.preventDefault(); e.stopPropagation(); setFaved(v => !v) }}
          aria-label="Guardar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={faved ? '#E53E3E' : 'none'} stroke={faved ? '#E53E3E' : 'currentColor'} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="prop-card__body">
        <div
          className="prop-card__price"
          dangerouslySetInnerHTML={{ __html: formatPrice(p.price || 0, p.type || '', p.price_period) }}
        />

        <div className="prop-card__title">{p.title || 'Propiedad en la Riviera Maya'}</div>

        {(p.neighborhood || p.address) && (
          <div className="prop-card__location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {p.neighborhood || p.address}
          </div>
        )}

        {amenities.length > 0 && (
          <div className="prop-card__amenities">
            {amenities.slice(0, 3).map(a => (
              <span key={a} className="amenity-tag">{a}</span>
            ))}
          </div>
        )}

        <div className="prop-card__meta">
          {(p.bedrooms ?? 0) > 0 && (
            <div className="prop-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 4v16M22 4v16M2 12h20M2 8h5a2 2 0 012 2v2H2V8zM15 8h5v4h-7v-2a2 2 0 012-2z"/>
              </svg>
              {p.bedrooms} {p.bedrooms === 1 ? 'Rec.' : 'Recs.'}
            </div>
          )}
          {(p.bathrooms ?? 0) > 0 && (
            <div className="prop-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1zM6 12V5a2 2 0 012-2h3v2.25"/>
                <line x1="4" y1="16" x2="4" y2="19"/>
                <line x1="20" y1="16" x2="20" y2="19"/>
              </svg>
              {p.bathrooms} {p.bathrooms === 1 ? 'Baño' : 'Baños'}
            </div>
          )}
          {p.area_sqm && (
            <div className="prop-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 3v18"/>
              </svg>
              {p.area_sqm} m²
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
