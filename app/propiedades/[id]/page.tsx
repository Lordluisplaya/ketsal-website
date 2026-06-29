'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Property } from '@/lib/types'

function formatPrice(price: number, type: string, period?: string | null) {
  if (!price || price === 0) return 'Precio a consultar'
  const f = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  if (type === 'renta' || type === 'vacacional') return `${f} / ${period === 'noche' ? 'noche' : 'mes'}`
  return f
}

function typeLabel(type: string) {
  return { venta: 'Venta', renta: 'Renta', vacacional: 'Vacacional' }[type] || type
}
function kindLabel(kind: string) {
  return {
    departamento: 'Departamento', casa: 'Casa', villa: 'Villa',
    terreno: 'Terreno', local: 'Local', oficina: 'Oficina',
    studio: 'Studio', penthouse: 'Penthouse',
  }[kind] || kind
}

interface PropertyPhoto { id: string; url: string; is_cover: boolean; sort_order: number }
interface PropertyWithPhotos extends Property { photos?: PropertyPhoto[] }

export default function PropertyDetail() {
  const { id } = useParams() as { id: string }
  const [property, setProperty] = useState<PropertyWithPhotos | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(r => r.json())
      .then(data => { setProperty(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const photos: string[] = property?.photos
    ? property.photos.sort((a, b) => {
        if (a.is_cover) return -1
        if (b.is_cover) return 1
        return a.sort_order - b.sort_order
      }).map(p => p.url)
    : property?.cover_photo
    ? [property.cover_photo]
    : []

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true) }
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])
  const prevPhoto = useCallback(() => setLightboxIdx(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const nextPhoto = useCallback(() => setLightboxIdx(i => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, closeLightbox, prevPhoto, nextPhoto])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ paddingTop: '72px', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 40px 0' }}>
            <div className="gallery-grid">
              <div className="skeleton gallery-main" />
              <div className="skeleton gallery-thumb" />
              <div className="skeleton gallery-thumb" />
              <div className="skeleton gallery-thumb" />
              <div className="skeleton gallery-thumb" />
            </div>
          </div>
          <div style={{ maxWidth: '1320px', margin: '48px auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '64px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="skeleton skeleton-line" style={{ height: '48px', width: '60%' }} />
              <div className="skeleton skeleton-line" style={{ width: '40%' }} />
              <div className="skeleton skeleton-line" style={{ height: '120px', borderRadius: '12px' }} />
            </div>
            <div className="skeleton" style={{ height: '400px', borderRadius: '20px' }} />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Header />
        <div style={{ paddingTop: '72px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px' }}>Propiedad no encontrada</h2>
          <Link href="/propiedades" className="btn btn--dark">Ver todas las propiedades</Link>
        </div>
        <Footer />
      </>
    )
  }

  const p = property
  const amenitiesList = [
    { key: 'pool', label: 'Alberca', icon: '🏊' },
    { key: 'parking', label: 'Estacionamiento', icon: '🚗' },
    { key: 'ocean_view', label: 'Vista al mar', icon: '🌊' },
    { key: 'beach_access', label: 'Acceso a playa', icon: '🏖️' },
    { key: 'furnished', label: 'Amueblado', icon: '🛋️' },
    { key: 'gym', label: 'Gimnasio', icon: '💪' },
    { key: 'rooftop', label: 'Rooftop', icon: '🏙️' },
    { key: 'security', label: 'Seguridad 24h', icon: '🔐' },
    { key: 'pet_friendly', label: 'Pet friendly', icon: '🐾' },
  ] as const

  const activeAmenities = amenitiesList.filter(a => p[a.key as keyof Property])
  const inactiveAmenities = amenitiesList.filter(a => !p[a.key as keyof Property])

  const whatsappMsg = `Hola! Me interesa la propiedad: ${p.title || 'propiedad en Ketsal'}. ¿Podría obtener más información? ${typeof window !== 'undefined' ? window.location.href : ''}`
  const whatsappUrl = `https://wa.me/${p.contact_whatsapp?.replace(/\D/g, '') || '529841234567'}?text=${encodeURIComponent(whatsappMsg)}`

  return (
    <>
      <Header />
      <div className="detail-page">

        {/* ── GALLERY ── */}
        <div className="detail__gallery">
          {photos.length > 0 ? (
            <div className="gallery-grid">
              {/* Main photo */}
              <div className="gallery-main" onClick={() => openLightbox(0)}>
                <img src={photos[0]} alt={p.title || 'Propiedad'} />
              </div>
              {/* Thumbs */}
              {photos.slice(1, 5).map((url, i) => (
                <div key={i} className="gallery-thumb" onClick={() => openLightbox(i + 1)}>
                  <img src={url} alt={`Foto ${i + 2}`} />
                  {i === 3 && photos.length > 5 && (
                    <div className="gallery-more">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
                      </svg>
                      Ver {photos.length - 5} más
                    </div>
                  )}
                </div>
              ))}
              {/* Show all btn */}
              <div className="gallery-btn">
                <button onClick={() => openLightbox(0)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
                  </svg>
                  Ver {photos.length} fotos
                </button>
              </div>
            </div>
          ) : (
            <div style={{ height: '540px', background: 'var(--cream-2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="detail__body">
          {/* Main content */}
          <div className="detail__main">
            <div className="detail__breadcrumb">
              <Link href="/">Inicio</Link>
              <span>/</span>
              <Link href="/propiedades">Propiedades</Link>
              <span>/</span>
              <span style={{ color: 'var(--text)' }}>{p.title || 'Propiedad'}</span>
            </div>

            <div className="detail__type-badges">
              {p.type && (
                <span className={`badge badge--type badge--type-${p.type}`}>
                  {typeLabel(p.type)}
                </span>
              )}
              {p.property_kind && (
                <span className="badge badge--kind">{kindLabel(p.property_kind)}</span>
              )}
            </div>

            <h1 className="detail__title">{p.title || 'Propiedad en la Riviera Maya'}</h1>

            {(p.neighborhood || p.address) && (
              <div className="detail__location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {p.neighborhood && p.address ? `${p.neighborhood}, ${p.address}` : p.neighborhood || p.address}
              </div>
            )}

            {/* Specs */}
            <div className="detail__specs">
              {(p.bedrooms ?? 0) > 0 && (
                <div className="detail__spec">
                  <div className="detail__spec-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4v16M22 4v16M2 12h20M2 8h5a2 2 0 012 2v2H2V8zM15 8h5v4h-7v-2a2 2 0 012-2z"/>
                    </svg>
                  </div>
                  <div className="detail__spec-val">{p.bedrooms}</div>
                  <div className="detail__spec-key">Recámaras</div>
                </div>
              )}
              {(p.bathrooms ?? 0) > 0 && (
                <div className="detail__spec">
                  <div className="detail__spec-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1zM6 12V5a2 2 0 012-2h3v2.25"/>
                    </svg>
                  </div>
                  <div className="detail__spec-val">{p.bathrooms}</div>
                  <div className="detail__spec-key">Baños</div>
                </div>
              )}
              {p.area_sqm && (
                <div className="detail__spec">
                  <div className="detail__spec-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
                    </svg>
                  </div>
                  <div className="detail__spec-val">{p.area_sqm}</div>
                  <div className="detail__spec-key">m²</div>
                </div>
              )}
              {p.type === 'vacacional' && (
                <div className="detail__spec">
                  <div className="detail__spec-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className="detail__spec-val" style={{ fontSize: '18px' }}>Flex</div>
                  <div className="detail__spec-key">Disponibilidad</div>
                </div>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <div className="detail__section">
                <h3>Descripción</h3>
                <p className="detail__desc">{p.description}</p>
              </div>
            )}

            {/* Amenities */}
            {activeAmenities.length > 0 && (
              <div className="detail__section">
                <h3>Amenidades</h3>
                <div className="amenities-grid">
                  {activeAmenities.map(a => (
                    <div key={a.key} className="amenity-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {a.label}
                    </div>
                  ))}
                  {inactiveAmenities.slice(0, 3).map(a => (
                    <div key={a.key} className="amenity-item amenity-item--off">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      {a.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reference */}
            {p.source_group && (
              <div className="detail__ref">
                Referencia: <strong>{p.source_group}</strong>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="detail__sidebar">
            <div className="contact-card">
              <div className="contact-card__price">{formatPrice(p.price || 0, p.type || '', p.price_period)}</div>
              {(p.type === 'renta' || p.type === 'vacacional') && (
                <div className="contact-card__period">por {p.price_period === 'noche' ? 'noche' : 'mes'}</div>
              )}
              <div className="contact-card__divider" />
              <div className="contact-card__actions">
                <a href={whatsappUrl} className="btn btn--gold" target="_blank" rel="noopener">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <a href={`mailto:hola@ketsal.mx?subject=Interesado en ${encodeURIComponent(p.title || 'propiedad')}`} className="btn btn--outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Enviar correo
                </a>
              </div>
              <p className="contact-card__note">
                Sin costo de asesoría · Respuesta en menos de 24h
              </p>
              <div className="contact-card__agent">
                <div className="agent-avatar">K</div>
                <div className="agent-info">
                  <span>Tu agente</span>
                  <strong>{p.contact_name || 'Equipo Ketsal'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && photos.length > 0 && (
        <div className="lightbox open" onClick={e => { if (e.target === e.currentTarget) closeLightbox() }}>
          <button className="lightbox__close" onClick={closeLightbox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="lightbox__main">
            <img className="lightbox__img" src={photos[lightboxIdx]} alt={`Foto ${lightboxIdx + 1}`} />
            <div className="lightbox__counter">{lightboxIdx + 1} / {photos.length}</div>
          </div>

          {photos.length > 1 && (
            <>
              <button className="lightbox__nav lightbox__nav--prev" onClick={prevPhoto}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button className="lightbox__nav lightbox__nav--next" onClick={nextPhoto}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </>
          )}

          {photos.length > 1 && (
            <div className="lightbox__thumbs">
              {photos.map((url, i) => (
                <div
                  key={i}
                  className={`lightbox__thumb ${i === lightboxIdx ? 'active' : ''}`}
                  onClick={() => setLightboxIdx(i)}
                >
                  <img src={url} alt={`Miniatura ${i + 1}`} />
                </div>
                ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  )
}
