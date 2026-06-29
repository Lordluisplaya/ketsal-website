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
    fetch('/api/properties')
      .then(r => r.json())
      .then(data => {
        setFeatured(Array.isArray(data) ? data.slice(0, 6) : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80"
            alt="Riviera Maya"
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__eyebrow">Riviera Maya</div>
          <h1 className="hero__title">
            Encuentra tu<br />
            <em>paraíso perfecto</em>
          </h1>
          <p className="hero__sub">
            Propiedades exclusivas en Playa del Carmen, Tulum y la Riviera Maya.
            Venta, renta y vacacional.
          </p>
          <div className="hero__actions">
            <Link href="/propiedades" className="btn btn--gold">
              Ver propiedades
            </Link>
            <a href="https://wa.me/529841234567" className="btn btn--outline" style={{color:'white', borderColor:'rgba(255,255,255,0.5)'}}>
              Contactar asesor
            </a>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <span>Explorar</span>
          <div className="hero__scroll-hint-line" />
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-bar__inner">
          <div className="stat">
            <div className="stat__val">200+</div>
            <div className="stat__label">Propiedades</div>
          </div>
          <div className="stat">
            <div className="stat__val">12</div>
            <div className="stat__label">Años de experiencia</div>
          </div>
          <div className="stat">
            <div className="stat__val">98%</div>
            <div className="stat__label">Clientes satisfechos</div>
          </div>
          <div className="stat">
            <div className="stat__val">3</div>
            <div className="stat__label">Destinos</div>
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <section className="featured-section">
        <div className="featured-section__head">
          <h2 className="featured-section__title">Propiedades destacadas</h2>
          <Link href="/propiedades" className="featured-section__see-all">
            Ver todas
          </Link>
        </div>
        <div className="featured-section__grid">
          {loading
            ? [1,2,3].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton-line skeleton-line--title" />
                    <div className="skeleton skeleton-line skeleton-line--subtitle" />
                    <div className="skeleton skeleton-line skeleton-line--short" />
                  </div>
                </div>
              ))
            : featured.length === 0
            ? (
                <div style={{gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'var(--text-muted)'}}>
                  <p>Cargando propiedades...</p>
                </div>
              )
            : featured.map(p => <PropertyCard key={p.id} property={p} />)
          }
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{background:'var(--navy)', padding:'80px 40px', textAlign:'center'}}>
        <div style={{maxWidth:'640px', margin:'0 auto'}}>
          <p style={{fontSize:'13px', fontWeight:600, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'24px'}}>
            Tu siguiente hogar te espera
          </p>
          <h2 style={{fontFamily:'var(--font-serif)', fontSize:'clamp(32px, 5vw, 52px)', color:'white', marginBottom:'20px', fontWeight:400}}>
            Agenda una consulta gratuita
          </h2>
          <p style={{fontSize:'17px', color:'rgba(255,255,255,0.65)', lineHeight:1.7, marginBottom:'36px'}}>
            Nuestros asesores te ayudan a encontrar la propiedad ideal segun tu presupuesto y estilo de vida.
          </p>
          <a href="https://wa.me/529841234567" className="btn btn--gold" style={{fontSize:'14px', padding:'15px 36px'}}>
            Hablar con un asesor
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
