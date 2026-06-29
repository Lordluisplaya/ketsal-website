'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')
  const heroBgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'venta', label: 'Venta' },
    { key: 'renta', label: 'Renta' },
    { key: 'vacacional', label: 'Vacacional' },
  ]

  const filtered = properties.filter(p => {
    const matchesFilter = activeFilter === 'todos' || p.type === activeFilter
    const q = searchTerm.toLowerCase()
    const matchesSearch = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.neighborhood || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.address || '').toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <section className="hero">
        <div ref={heroBgRef} className="hero__bg" />
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__eyebrow">Riviera Maya · México</p>
          <h1 className="hero__title">
            Encuentra tu<br />
            <em>paraíso perfecto</em>
          </h1>
          <p className="hero__subtitle">
            Propiedades exclusivas en Playa del Carmen, Tulum y la Riviera Maya
          </p>
          <div className="hero__search">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Zona, fraccionamiento o tipo de propiedad..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
              />
              <button
                className="search-btn"
                onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Buscar
              </button>
            </div>
            <div className="hero__pills">
              {filters.map(f => (
                <button
                  key={f.key}
                  className={`pill ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <p className="hero__scroll-text">Explorar</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stats__inner">
          <div className="stat">
            <span className="stat__num">{properties.length > 0 ? `${properties.length}+` : '—'}</span>
            <span className="stat__label">Propiedades</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__num">5</span>
            <span className="stat__label">Zonas exclusivas</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__num">10+</span>
            <span className="stat__label">Años de experiencia</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__num">100%</span>
            <span className="stat__label">Confianza garantizada</span>
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      <section className="listings" id="propiedades">
        <div className="container">
          <div className="listings__header">
            <div>
              <p className="section-eyebrow">Portafolio</p>
              <h2 className="section-title">Propiedades destacadas</h2>
            </div>
            <div className="listings__filters">
              {filters.map(f => (
                <button
                  key={f.key}
                  className={`filter-chip ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="property-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton-line skeleton-line--title" />
                    <div className="skeleton skeleton-line skeleton-line--subtitle" />
                    <div className="skeleton skeleton-line skeleton-line--short" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="prop-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <h3>Sin resultados</h3>
              <p>Prueba con otra búsqueda o filtro</p>
            </div>
          ) : (
            <div className="property-grid">
              {filtered.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}

          {filtered.length > 6 && (
            <div className="listings__cta">
              <Link href="/propiedades" className="btn btn--outline">
                Ver todas las propiedades
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY KETSAL ── */}
      <section className="why">
        <div className="container">
          <div className="why__grid">
            <div className="why__content">
              <p className="section-eyebrow">Por qué elegirnos</p>
              <h2 className="section-title">La experiencia<br /><em>Ketsal</em></h2>
              <p className="why__text">
                Somos especialistas en el mercado inmobiliario de la Riviera Maya.
                Conocemos cada rincón de este paraíso y conectamos compradores y
                vendedores con integridad, profesionalismo y pasión.
              </p>
              <div className="why__features">
                {[
                  {
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ),
                    title: 'Selección curada',
                    desc: 'Solo las mejores propiedades pasan nuestro riguroso proceso de selección',
                  },
                  {
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                    ),
                    title: 'Asesoría personalizada',
                    desc: 'Te acompañamos en cada paso del proceso de compra o renta',
                  },
                  {
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    ),
                    title: 'Red exclusiva',
                    desc: 'Acceso a propiedades únicas que no encontrarás en ningún otro lugar',
                  },
                ].map((f, i) => (
                  <div key={i} className="why__feature">
                    <div className="why__icon">{f.icon}</div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why__visual">
              <div className="why__img why__img--1" />
              <div className="why__img why__img--2" />
              <div className="why__badge">
                <span>Riviera Maya</span>
                <strong>Especialistas</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-section__bg" />
        <div className="cta-section__content">
          <h2>¿Listo para encontrar<br /><em>tu propiedad ideal?</em></h2>
          <p>Nuestro equipo está disponible para asesorarte personalmente</p>
          <div className="cta-section__actions">
            <a href="https://wa.me/529841234567" className="btn btn--gold" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contactar por WhatsApp
            </a>
            <Link href="/propiedades" className="btn btn--outline-white">
              Ver todas las propiedades
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
