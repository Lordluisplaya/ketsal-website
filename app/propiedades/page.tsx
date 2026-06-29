'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'

function PropiedadesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'todos')
  const [kind, setKind] = useState(searchParams.get('kind') || 'todos')
  const [bedMin, setBedMin] = useState('0')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const tipos = [
    { key: 'todos', label: 'Todos' },
    { key: 'venta', label: 'Venta' },
    { key: 'renta', label: 'Renta' },
    { key: 'vacacional', label: 'Vacacional' },
  ]

  const kinds = [
    { key: 'todos', label: 'Todo tipo' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'casa', label: 'Casa' },
    { key: 'villa', label: 'Villa' },
    { key: 'penthouse', label: 'Penthouse' },
    { key: 'studio', label: 'Studio' },
    { key: 'terreno', label: 'Terreno' },
  ]

  const filtered = properties
    .filter(p => {
      const matchTipo = tipo === 'todos' || p.type === tipo
      const matchKind = kind === 'todos' || p.property_kind === kind
      const matchBed = bedMin === '0' || (p.bedrooms || 0) >= parseInt(bedMin)
      const q = search.toLowerCase()
      const matchSearch = !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.neighborhood || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      return matchTipo && matchKind && matchBed && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
      return 0 // newest = API order
    })

  return (
    <div className="page-propiedades">
      {/* Hero */}
      <div className="prop-hero">
        <p className="section-eyebrow" style={{ justifyContent: 'center' }}>Portafolio completo</p>
        <h1>Todas las propiedades</h1>
        <p>Encuentra la propiedad perfecta en la Riviera Maya</p>
      </div>

      {/* Sticky filters */}
      <div className="prop-filters-bar">
        <div className="prop-filters-bar__inner">
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--cream)', border: '1.5px solid var(--border)',
            borderRadius: '100px', padding: '8px 16px', flex: '1', minWidth: '200px', maxWidth: '300px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: '14px', width: '100%' }}
            />
          </div>

          {/* Tipo */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {tipos.map(t => (
              <button
                key={t.key}
                className={`filter-chip ${tipo === t.key ? 'active' : ''}`}
                onClick={() => setTipo(t.key)}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Kind */}
          <select
            value={kind}
            onChange={e => setKind(e.target.value)}
            style={{
              border: '1.5px solid var(--border)', borderRadius: '100px',
              padding: '8px 32px 8px 16px', fontSize: '13px',
              background: 'white', cursor: 'pointer', outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' strokeWidth='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            {kinds.map(k => <option key={k.key} value={k.key}>{k.label}</option>)}
          </select>

          {/* Beds */}
          <select
            value={bedMin}
            onChange={e => setBedMin(e.target.value)}
            style={{
              border: '1.5px solid var(--border)', borderRadius: '100px',
              padding: '8px 32px 8px 16px', fontSize: '13px',
              background: 'white', cursor: 'pointer', outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' strokeWidth='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            <option value="0">Cualquier cuarto</option>
            <option value="1">1+ recámara</option>
            <option value="2">2+ recámaras</option>
            <option value="3">3+ recámaras</option>
            <option value="4">4+ recámaras</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              border: '1.5px solid var(--border)', borderRadius: '100px',
              padding: '8px 32px 8px 16px', fontSize: '13px',
              background: 'white', cursor: 'pointer', outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' strokeWidth='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>

          <span className="prop-filters-bar__count">
            {loading ? '...' : `${filtered.length} propiedad${filtered.length !== 1 ? 'es' : ''}`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="prop-main">
        {loading ? (
          <div className="property-grid">
            {[1,2,3,4,5,6].map(i => (
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
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>Sin resultados</h3>
            <p>Intenta con otros filtros o términos de búsqueda</p>
          </div>
        ) : (
          <div className="property-grid">
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Propiedades() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ height: '100vh' }} />}>
        <PropiedadesContent />
      </Suspense>
      <Footer />
    </>
  )
}
