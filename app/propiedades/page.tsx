import { supabase } from '@/lib/supabase'
import PropertyCard from '@/components/PropertyCard'
import { SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

async function getProperties(sp: Record<string, string>) {
  let q = supabase.from('v_properties_public').select('*').order('featured', { ascending: false }).order('published_at', { ascending: false })
  if (sp.type) q = q.eq('type', sp.type)
  if (sp.zone) q = q.eq('zone_slug', sp.zone)
  if (sp.bedrooms) q = q.gte('bedrooms', parseInt(sp.bedrooms))
  if (sp.min_price) q = q.gte('price', parseInt(sp.min_price))
  if (sp.max_price) q = q.lte('price', parseInt(sp.max_price))
  const { data } = await q.limit(50)
  return data || []
}

async function getZones() {
  const { data } = await supabase.from('zones').select('id,name,slug').eq('active', true)
  return data || []
}

const TYPE_LABELS: Record<string, string> = { venta: 'Venta', renta: 'Renta', vacacional: 'Vacacional' }

export default async function PropiedadesPage({ searchParams }: { searchParams: Record<string, string> }) {
  const [properties, zones] = await Promise.all([getProperties(searchParams), getZones()])
  const activeType = searchParams.type || ''
  const activeZone = searchParams.zone || ''
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{activeType ? `Propiedades en ${TYPE_LABELS[activeType]}` : 'Todas las propiedades'}</h1>
        <p className="text-gray-500 mt-1">{properties.length} propiedades encontradas</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-4"><SlidersHorizontal className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium text-gray-700">Filtros</span></div>
        <form className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select name="type" defaultValue={activeType} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ketsal-green">
            <option value="">Cualquier tipo</option>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
            <option value="vacacional">Vacacional</option>
          </select>
          <select name="zone" defaultValue={activeZone} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ketsal-green">
            <option value="">Cualquier zona</option>
            {zones.map(z => <option key={z.id} value={z.slug}>{z.name}</option>)}
          </select>
          <select name="bedrooms" defaultValue={searchParams.bedrooms || ''} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ketsal-green">
            <option value="">Recámaras</option>
            <option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
          </select>
          <button type="submit" className="bg-ketsal-green text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-ketsal-green-light transition-colors">Filtrar</button>
        </form>
      </div>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No se encontraron propiedades con esos filtros</p>
          <Link href="/propiedades" className="text-ketsal-green font-medium hover:underline">Ver todas</Link>
        </div>
      )}
    </div>
  )
}