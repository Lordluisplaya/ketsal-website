'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Property } from '@/lib/types'

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    fetch('/api/properties/' + id)
      .then(r => r.json())
      .then(data => {
        if (data.error) setFetchError(true)
        else setProperty(data)
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [id])

  const allPhotos = property?.photos && property.photos.length > 0
    ? [...property.photos].sort((a, b) => a.sort_order - b.sort_order)
    : property?.cover_photo
      ? [{ id: 'cover', url: property.cover_photo, is_cover: true, sort_order: 0 }]
      : []

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prevPhoto = useCallback(() => {
    setLightboxIndex(prev => {
      if (prev === null || allPhotos.length === 0) return prev
      return (prev - 1 + allPhotos.length) % allPhotos.length
    })
  }, [allPhotos.length])

  const nextPhoto = useCallback(() => {
    setLightboxIndex(prev => {
      if (prev === null || allPhotos.length === 0) return prev
      return (prev + 1) % allPhotos.length
    })
  }, [allPhotos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') prevPhoto()
      else if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, closeLightbox, prevPhoto, nextPhoto])

  const formatPrice = (p: Property): string => {
    if (!p.price) return 'Consultar precio'
    const formatted = p.price.toLocaleString('es-MX')
    if (p.type === 'renta' || p.type === 'vacacional') {
      return 'USD $' + formatted + '/' + (p.price_period || 'mes')
    }
    return 'USD $' + formatted
  }

  if (loading) return (
    <>
      <Header />
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: 240, height: 40, borderRadius: 4 }} />
      </main>
      <Footer />
    </>
  )

  if (fetchError || !property) return (
    <>
      <Header />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, textAlign: 'center' }}>Propiedad no encontrada</h1>
        <p style={{ color: '#666', textAlign: 'center' }}>La propiedad que buscas no existe o ya no esta disponible.</p>
        <Link href="/propiedades" className="btn-primary">Ver todas las propiedades</Link>
      </main>
      <Footer />
    </>
  )

  const typeLabel: Record<string, string> = { venta: 'En Venta', renta: 'En Renta', vacacional: 'Vacacional' }
  const kindLabel: Record<string, string> = {
    departamento: 'Departamento', casa: 'Casa', villa: 'Villa', terreno: 'Terreno',
    local: 'Local Comercial', oficina: 'Oficina', studio: 'Studio', penthouse: 'Penthouse'
  }

  const amenities = [
    { label: 'Alberca', active: property.pool },
    { label: 'Estacionamiento', active: property.parking },
    { label: 'Vista al Mar', active: property.ocean_view },
    { label: 'Pet Friendly', active: property.pet_friendly },
    { label: 'Amueblado', active: property.furnished },
    { label: 'Gimnasio', active: property.gym },
    { label: 'Acceso Playa', active: property.beach_access },
    { label: 'Rooftop', active: property.rooftop },
    { label: 'Seguridad 24h', active: property.security },
  ]
  const activeAmenities = amenities.filter(a => a.active)

  const whatsappNum = property.contact_whatsapp
    ? property.contact_whatsapp.replace(/D/g, '')
    : '529841234567'
  const waText = encodeURIComponent('Hola! Me interesa la propiedad: ' + property.title)
  const waUrl = 'https://wa.me/' + whatsappNum + '?text=' + waText

  return (
    <>
      <Header />

      {lightboxIndex !== null && allPhotos.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">x</button>
          {allPhotos.length > 1 && (
            <>
              <button className="lightbox-prev" onClick={e => { e.stopPropagation(); prevPhoto() }}>&#8249;</button>
              <button className="lightbox-next" onClick={e => { e.stopPropagation(); nextPhoto() }}>&#8250;</button>
            </>
          )}
          <img
            src={allPhotos[lightboxIndex].url}
            alt={'Foto ' + (lightboxIndex + 1)}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
          <div className="lightbox-counter">{lightboxIndex + 1} / {allPhotos.length}</div>
        </div>
      )}

      <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: 80 }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e0d0', padding: '12px 0' }}>
          <div className="container" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#888' }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Inicio</Link>
            <span>&#8250;</span>
            <Link href="/propiedades" style={{ color: '#888', textDecoration: 'none' }}>Propiedades</Link>
            <span>&#8250;</span>
            <span style={{ color: 'var(--black)' }}>{property.title}</span>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="detail-layout">
            <div className="detail-main">
              {allPhotos.length > 0 && (
                <div className="gallery-grid" style={{ marginBottom: 40 }}>
                  {allPhotos.slice(0, 5).map((photo, i) => (
                    <div
                      key={photo.id}
                      className={i === 0 ? 'gallery-main' : 'gallery-thumb'}
                      onClick={() => setLightboxIndex(i)}
                      style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    >
                      <img src={photo.url} alt={'Foto ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {i === 4 && allPhotos.length > 5 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>
                          +{allPhotos.length - 5}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className="badge-type">{typeLabel[property.type] || property.type}</span>
                  <span className="badge-kind">{kindLabel[property.property_kind] || property.property_kind}</span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 600, marginBottom: 8, lineHeight: 1.2 }}>
                  {property.title}
                </h1>
                {property.neighborhood && (
                  <p style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    {property.neighborhood}{property.address ? ', ' + property.address : ''}
                  </p>
                )}
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px,3vw,30px)', color: 'var(--gold)', fontWeight: 600, marginTop: 16 }}>
                  {formatPrice(property)}
                </p>
              </div>

              {(property.bedrooms != null || property.bathrooms != null || property.area_sqm != null) && (
                <div className="detail-specs" style={{ marginBottom: 32 }}>
                  {property.bedrooms != null && (
                    <div className="spec-item">
                      <span className="spec-value">{property.bedrooms}</span>
                      <span className="spec-label">Recamaras</span>
                    </div>
                  )}
                  {property.bathrooms != null && (
                    <div className="spec-item">
                      <span className="spec-value">{property.bathrooms}</span>
                      <span className="spec-label">Banos</span>
                    </div>
                  )}
                  {property.area_sqm != null && (
                    <div className="spec-item">
                      <span className="spec-value">{property.area_sqm}</span>
                      <span className="spec-label">m2</span>
                    </div>
                  )}
                </div>
              )}

              {property.description && (
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Descripcion</h2>
                  <p style={{ lineHeight: 1.8, color: '#444', fontSize: 16 }}>{property.description}</p>
                </div>
              )}

              {activeAmenities.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Amenidades</h2>
                  <div className="amenities-grid">
                    {activeAmenities.map(a => (
                      <div key={a.label} className="amenity-item">
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="detail-sidebar">
              <div className="contact-card">
                <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e8e0d0' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--gold)', fontWeight: 600 }}>
                    {formatPrice(property)}
                  </p>
                  {property.price_note && (
                    <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{property.price_note}</p>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 2 }}>
                  {property.contact_name || 'Ketsal Real Estate'}
                </p>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Agente especializado Riviera Maya</p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>
                  Contactar por WhatsApp
                </a>
                <a href="mailto:info@ketsal.mx" className="btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                  Enviar Email
                </a>
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e8e0d0' }}>
                  <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 1.6 }}>
                    Ketsal Real Estate - Riviera Maya, Mexico.
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href="/propiedades" style={{ color: '#666', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  &#8592; Volver a propiedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}