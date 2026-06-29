export interface Property {
  id: string
  title: string
  type: 'venta' | 'renta' | 'vacacional'
  property_kind: 'departamento' | 'casa' | 'villa' | 'terreno' | 'local' | 'oficina' | 'studio' | 'penthouse'
  bedrooms: number | null
  bathrooms: number | null
  area_sqm: number | null
  price: number | null
  price_period: string | null
  price_note: string | null
  description: string | null
  cover_photo: string | null
  neighborhood: string | null
  address: string | null
  pool: boolean
  parking: boolean
  ocean_view: boolean
  pet_friendly: boolean
  furnished: boolean
  gym: boolean
  beach_access: boolean
  rooftop: boolean
  security: boolean
  contact_whatsapp: string | null
  contact_name: string | null
  source_group: string | null
  status: 'pendiente' | 'publicada' | 'rechazada'
  created_at: string
  photos?: { id: string; url: string; is_cover: boolean; sort_order: number }[]
}
