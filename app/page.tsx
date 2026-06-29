'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import PropertyCard from '@/app/components/PropertyCard'
import { Property } from '@/lib/types'

export default function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/properties?limit=6')
      .then(r => r.json())
      .then(data => setFeatured(Array.isArray(data) ? data : []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow">Riviera Maya, Mexico</p>
          <h1 className="hero-title">
            Encuentra tu<br />propiedad ideal
          </h1>
          <p className="hero-subtitle">
            Casas, departamentos y villas en Playa del Carmen, Tulum y la Riviera Maya.
            Tu paraiso mexicano te espera.
          </p>
          <div className="hero-actions">
            <Link href="/propiedades?type=venta" className="btn-primary">Ver en Venta</Link>
            <Link href="/propiedades?type=renta" className="btn-ghost">Ver en Renta</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Propiedades</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Anos de experiencia</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Clientes satisfechos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Destinos premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Seleccion exclusiva</p>
            <h2 className="section-title">Propiedades Destacadas</h2>
            <p className="section-subtitle">
              Descubre nuestra seleccion de propiedades de lujo en la Riviera Maya
            </p>
          </div>

          {loading ? (
            <div className="properties-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton" style={{ height: 220, borderRadius: '8px 8px 0 0' }} />
                  <div style={{ padding: 20 }}>
                    <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 12, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 8, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="properties-grid">
              {featured.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <p style={{ fontSize: 18 }}>Propiedades disponibles proximamente.</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/propiedades" className="btn-primary">
              Ver todas las propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Asesoria personalizada</h2>
            <p className="cta-subtitle">
              Nuestros expertos te ayudaran a encontrar la propiedad perfecta.<br />
              Contactanos y comienza tu busqueda hoy.
            </p>
            <a
              href="https://wa.me/529841234567?text=Hola!%20Me%20interesa%20recibir%20asesoria%20sobre%20propiedades%20en%20la%20Riviera%20Maya"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}