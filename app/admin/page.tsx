'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, RefreshCw, BarChart3 } from 'lucide-react'

type Prop = { id: string; title: string; type: string; price: number; zones: { name: string } | null; status: string; created_at: string }

const ESTADOS = ['todos','pendiente','publicada','rechazada','archivada']

export default function AdminPage() {
  const [props, setProps] = useState<Prop[]>([])
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const r = await fetch('/api/properties')
    const d = await r.json()
    // API returns array directly
    setProps(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function setEstado(id: string, status: string) {
    await fetch('/api/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  const shown = filter === 'todos' ? props : props.filter(p => p.status === filter)
  const counts = props.reduce((acc: Record<string,number>, p) => { acc[p.status] = (acc[p.status]||0)+1; return acc }, {})

  const TAB = 'px-4 py-2 rounded-lg font-brand font-600 text-xs uppercase tracking-wide transition-all border'
  const tabClass = (t: string) => t === filter
    ? `${TAB} bg-ketsal-cobalt text-white border-ketsal-cobalt`
    : `${TAB} bg-white text-ketsal-black/50 border-gray-200 hover:border-ketsal-cobalt/30`

  return (
    <div className="min-h-screen bg-ketsal-surface">
      <div className="gradient-hero text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-brand text-xs text-ketsal-cobalt-light tracking-[0.3em] uppercase mb-2">Panel</p>
            <h1 className="font-brand font-800 text-3xl tracking-wide2">Administración</h1>
          </div>
          <div className="flex gap-6">
            {[['pendiente','#D4AF6A'],['publicada','#6B6BFF'],['rechazada','#ef4444']].map(([k,c]) => (
              <div key={k} className="text-center">
                <p className="font-brand font-800 text-2xl" style={{color: c}}>{counts[k] || 0}</p>
                <p className="text-white/30 text-[10px] font-brand uppercase tracking-wide">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {ESTADOS.map(e => <button key={e} onClick={() => setFilter(e)} className={tabClass(e)}>{e}</button>)}
          </div>
          <button onClick={load} className="flex items-center gap-2 text-xs font-brand text-gray-400 hover:text-ketsal-cobalt transition-colors uppercase tracking-wide">
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-ketsal-cobalt/20 border-t-ketsal-cobalt rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Propiedad','Tipo','Precio','Zona','Estado','Acciones'].map(h => (
                    <th key={h} className="text-left text-[10px] font-brand font-700 uppercase tracking-wider text-gray-300 px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-ketsal-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-brand font-600 text-sm text-ketsal-black max-w-xs truncate">{p.title}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{new Date(p.created_at).toLocaleDateString('es-MX')}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-brand font-700 uppercase tracking-wide px-2 py-1 rounded-full ${
                        p.type === 'venta' ? 'bg-ketsal-cobalt/10 text-ketsal-cobalt' :
                        p.type === 'renta' ? 'bg-ketsal-navy/10 text-ketsal-navy' :
                        'bg-ketsal-gold/20 text-amber-700'
                      }`}>{p.type}</span>
                    </td>
                    <td className="px-5 py-4 font-brand font-600 text-sm text-ketsal-cobalt">
                      {p.price ? `$${Number(p.price).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{p.zones?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-brand font-600 ${
                        p.status==='publicada' ? 'text-emerald-500' :
                        p.status==='rechazada' ? 'text-red-400' : 'text-amber-500'
                      }`}>
                        {p.status==='publicada' ? <CheckCircle className="w-3.5 h-3.5" /> :
                         p.status==='rechazada' ? <XCircle className="w-3.5 h-3.5" /> :
                         <Clock className="w-3.5 h-3.5" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {p.status !== 'publicada' && (
                          <button onClick={() => setEstado(p.id,'publicada')}
                            className="text-[10px] font-brand font-600 uppercase tracking-wide bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg transition-colors">
                            Publicar
                          </button>
                        )}
                        {p.status !== 'rechazada' && (
                          <button onClick={() => setEstado(p.id,'rechazada')}
                            className="text-[10px] font-brand font-600 uppercase tracking-wide bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition-colors">
                            Rechazar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && (
              <div className="text-center py-12 text-gray-300">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="font-brand text-sm">Sin propiedades</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}