import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Bed, Bath, Maximize, MapPin, Phone, MessageCircle, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getProperty(id: string) {
  const { data } = await supabase.from('v_properties_public').select('*').eq('id', id).single()
  return data
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const p = await getProperty(params.id)
  if (!p) notFound()
  const msg = encodeURIComponent(`Hola, me interesa la propiedad: ${p.title} (${p.currency} ${p.price?.toLocaleString()}). ¿Pueden darme más info?`)
  const amenities = [p.pool&&'Alberca',p.gym&&'Gimnasio',p.parking&&'Estacionamiento',p.security&&'Seguridad 24h',p.rooftop&&'Rooftop',p.pet_friendly&&'Pet Friendly',p.ocean_view&&'Vista al mar',p.beach_access&&'Acceso a playa',p.furnished&&'Amueblado'].filter(Boolean)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/propiedades" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-ketsal-green mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Volver</Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-6">
            {p.cover_photo ? <img src={p.cover_photo} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-ketsal-green/20 to-ketsal-gold/20 flex items-center justify-center"><MapPin className="w-16 h-16 text-ketsal-green/30" /></div>}
          </div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ketsal-green/10 text-ketsal-green capitalize">{p.type}</span>
              {p.property_kind && <span className="text-xs text-gray-400 capitalize">{p.property_kind}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{p.title}</h1>
            <p className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-4 h-4" />{p.zone_name}{p.zone_city ? `, ${p.zone_city}` : ''}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
            {p.bedrooms != null && <div className="text-center"><Bed className="w-5 h-5 text-ketsal-green mx-auto mb-1" /><p className="text-lg font-bold text-gray-900">{p.bedrooms}</p><p className="text-xs text-gray-500">Recámaras</p></div>}
            {p.bathrooms != null && <div className="text-center"><Bath className="w-5 h-5 text-ketsal-green mx-auto mb-1" /><p className="text-lg font-bold text-gray-900">{p.bathrooms}</p><p className="text-xs text-gray-500">Baños</p></div>}
            {p.area_sqm && <div className="text-center"><Maximize className="w-5 h-5 text-ketsal-green mx-auto mb-1" /><p className="text-lg font-bold text-gray-900">{p.area_sqm}</p><p className="text-xs text-gray-500">m²</p></div>}
          </div>
          {p.description && <div className="mb-6"><h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2><p className="text-gray-600 leading-relaxed">{p.description}</p></div>}
          {amenities.length > 0 && <div><h2 className="text-lg font-semibold text-gray-900 mb-3">Amenidades</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{amenities.map(a => <div key={a as string} className="flex items-center gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-ketsal-green" />{a}</div>)}</div></div>}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
            <div className="mb-6">
              <p className="text-3xl font-bold text-ketsal-green">{p.currency} {p.price?.toLocaleString('en-US')}{p.price_period && <span className="text-base font-normal text-gray-400">/{p.price_period}</span>}</p>
            </div>
            <div className="space-y-3">
              <a href={`https://wa.me/${(p.contact_whatsapp||'529841234567').replace(/\D/g,'')}?text=${msg}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#20BD5C] transition-colors flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" />WhatsApp</a>
              {p.contact_phone && <a href={`tel:${p.contact_phone}`} className="w-full border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><Phone className="w-5 h-5" />Llamar</a>}
            </div>
            {p.contact_name && <p className="text-center text-sm text-gray-400 mt-4">Asesor: {p.contact_name}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}