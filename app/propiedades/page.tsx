'use client'
import { useState, useEffect } from 'react'
import PropertyCard from '@/components/PropertyCard'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function PropiedadesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('')
  const [zone, setZone] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (zone) params.set('zone', zone)
    fetch(`/api/properties?${params}`)
      .then(r => r.json())
      .then(d => { setProperties(d.properties || []); setLoading(false) })
  }, [type, zone])

  const filtered = properties.filter(p =>
    !search || p.titulo?.toLowerCase().includes(search.toLowerCase()) || p.zona?.toLowerCase().includes(search.toLowerCase())
  )

  const BTN = 'px-4 py-2 rounded-lg font-brand font-600 text-xs uppercase tracking-wide border transition-all'
  const active = (val, cur) => val === cur
    ? `${BTN} bg-ketsal-cobalt text-white border-ketsal-cobalt`
    : `${BTN} bg-white text-ketsal-black/60 border-gray-200 hover:border-ketsal-cobalt/40 hover:text-ketsal-cobalt`

  return (
    <div className="min-h-screen bg-ketsal-surface">
      {/* Header */}
      <div className="gradient-hero text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-brand text-xs text-ketsal-cobalt-light tracking-[0.3em] uppercase mb-3">Catálogo completo</p>
          <h1 className="font-brand font-800 text-4xl tracking-wide2 mb-6">Propiedades</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o zona..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-ketsal-cobalt/50"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          <SlidersHorizontal className="w-4 h-4 text-gray-300" />
          <button onClick={() => setType('')} className={active('', type)}>Todos</button>
          <button onClick={() => setType('venta')} className={active('venta', type)}>Venta</button>
          <button onClick={() => setType('renta')} className={active('renta', type)}>Renta</button>
          <button onClick={() => setType('vacacional')} className={active('vacacional', type)}>Vacacional</button>
          <div className="ml-auto">
            <select value={zone} onChange={e => setZone(e.target.value)}
              className="text-xs font-brand border border-gray-200 rounded-lg px-3 py-2 text-ketsal-black/60 focus:outline-none focus:border-ketsal-cobalt/40 bg-white">
              <option value="">Todas las zonas</option>
              <option value="centro-pdc">Centro PDC</option>
              <option value="playacar">Playacar</option>
              <option value="tulum-centro">Tulum</option>
              <option value="aldea-zama">Aldea Zamá</option>
              <option value="puerto-morelos">Puerto Morelos</option>
              <option value="akumal">Akumal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-ketsal-cobalt/20 border-t-ketsal-cobalt rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-brand text-sm">No hay propiedades con estos filtros.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-brand mb-6 uppercase tracking-wide">{filtered.length} propiedades</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}