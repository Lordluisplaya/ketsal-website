export type PropertyType = 'venta' | 'renta' | 'vacacional'
export type PropertyKind = 'departamento' | 'casa' | 'villa' | 'terreno' | 'local' | 'oficina' | 'studio' | 'penthouse'

export interface Property {
  id: string
  title: string
  description?: string
  type: PropertyType
  property_kind?: PropertyKind
  status: string
  price: number
  currency: 'USD' | 'MXN'
  price_period?: string | null
  bedrooms?: number
  bathrooms?: number
  area_sqm?: number
  furnished?: boolean
  pool?: boolean
  parking?: boolean
  gym?: boolean
  security?: boolean
  rooftop?: boolean
  pet_friendly?: boolean
  ocean_view?: boolean
  beach_access?: boolean
  zone_id?: string
  zone_name?: string
  zone_slug?: string
  zone_city?: string
  contact_name?: string
  contact_phone?: string
  contact_whatsapp?: string
  source?: string
  featured?: boolean
  published_at?: string
  cover_photo?: string
  created_at?: string
}