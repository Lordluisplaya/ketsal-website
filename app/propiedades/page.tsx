'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import PropertyCard from '@/app/components/PropertyCard'
import { Property } from '@/lib/types'

function PropiedadesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState(searchParams.get('tipo') || '')
  const [filterKind, setFilterKind] = useState('')

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = properties.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || (p.title || '').toLowerCase().includes(q)
      || (p.neighborhood || '').toLowerCase().includes(q)
      || (p.address || '').toLowerCase().includes(q)
    const matchType = !filterType || p.type === filterType
    const matchKind = !filterKind || p.property_kind === filterKind
    return matchSearch && matchType && matchKind
  })

  return (
    <div className="prop-page">
      <div className="prop-hero">
        <h1 className="prop-hero__title">Propiedades</h1>
        <p className="prop-hero__sub">Riviera Maya · Playa del Carmen · Tulum</p>
      </div>
      <div className="prop-filters-bar">
        <div className="prop-filters-bar__inner">
          <div className="prop-filters-bar__search-wrap">
            <svg className="prop-filters-bar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="prop-filters-bar__search" placeholder="Buscar por zona, titulo..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="prop-filters-bar__select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
            <option value="vacacional">Vacacional</option>
          </select>
          <select className="prop-filters-bar__select" value={filterKind} onChange={e => setFilterKind(e.target.value)}>
            <option value="">Todas las categorias</option>
            <option value="departamento">Departamento</option>
            <option value="casa">Casa</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="studio">Studio</option>
            <option value="terreno">Terreno</option>
          </select>
          <span className="prop-filters-bar__count">
            {loading ? '...' : filtered.length + ' propiedad' + (filtered.length !== 1 ? 'es' : '')}
          </span>
        </div>
      </div>
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
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <h3>Sin resultados</h3>
            <p>Intenta con otros filtros</p>
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
      <Suspense fallback={<div style={{height:'100vh'}} />}>
        <PropiedadesContent />
      </Suspense>
      <Footer />
    </>
  )
}
