'use client'
import { useEffect, useState } from 'react'
import { Check, X, Eye, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Prop { id: string; title: string; type: string; price: number; currency: string; status: string; source: string; created_at: string; zones?: { name: string } }

const STATUS_COLORS: Record<string, string> = { pendiente: 'bg-yellow-100 text-yellow-700', publicada: 'bg-green-100 text-green-700', rechazada: 'bg-red-100 text-red-700', archivada: 'bg-gray-100 text-gray-600' }

export default function AdminPage() {
  const [props, setProps] = useState<Prop[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pendiente')

  async function load() {
    setLoading(true)
    const res = await fetch(`/api/properties?status=${filter}`)
    const data = await res.json()
    setProps(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/properties', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    load()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/" className="text-gray-400 hover:text-ketsal-green"><Home className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <p className="text-gray-500 text-sm">Revisión y publicación de propiedades</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>
      <div className="flex gap-2 mb-6">
        {['pendiente','publicada','rechazada','archivada'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-ketsal-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>
      {loading ? <div className="text-center py-20 text-gray-400">Cargando...</div> :
       props.length === 0 ? <div className="text-center py-20 text-gray-400">No hay propiedades "{filter}"</div> : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Propiedad','Tipo','Precio','Zona','Fuente','Estado','Acciones'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {props.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><p className="font-medium text-gray-900 text-sm line-clamp-1">{p.title}</p><p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('es-MX')}</p></td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{p.type}</td>
                    <td className="px-4 py-3"><span className="text-sm font-semibold text-ketsal-green">{p.currency} {p.price?.toLocaleString('en-US')}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.zones?.name || '—'}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{p.source}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/propiedades/${p.id}`} target="_blank" className="p-1.5 text-gray-400 hover:text-ketsal-green hover:bg-green-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></a>
                        {p.status !== 'publicada' && <button onClick={() => updateStatus(p.id, 'publicada')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>}
                        {p.status !== 'rechazada' && <button onClick={() => updateStatus(p.id, 'rechazada')} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}