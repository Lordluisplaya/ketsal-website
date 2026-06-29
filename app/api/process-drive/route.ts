import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

interface DriveFile {
  id: string
  name: string
  mimeType: string
  thumbnail?: string // base64 data (small, for ranking)
  full?: string      // base64 data (high-res, for extraction)
}

interface PhotoRanking {
  id: string
  name: string
  category: 'exterior' | 'sala' | 'cocina' | 'recamara' | 'bano' | 'alberca' | 'detalle' | 'otro'
  coverScore: number // 0-10, higher = better cover candidate
  order: number
  isCover: boolean
}

interface ExtractedProperty {
  title: string
  type: 'venta' | 'renta' | 'vacacional'
  property_kind: 'departamento' | 'casa' | 'villa' | 'studio' | 'terreno' | 'local' | 'oficina' | 'penthouse'
  bedrooms: number
  bathrooms: number
  area_sqm: number | null
  price: number | null
  price_period: string | null
  description: string
  amenities: {
    pool: boolean
    parking: boolean
    ocean_view: boolean
    pet_friendly: boolean
    furnished: boolean
    gym: boolean
    beach_access: boolean
    rooftop: boolean
    security: boolean
  }
  condition: string
  contact_whatsapp: string | null
  contact_name: string | null
  notes: string
  // From ficha técnica / text
  address: string | null
  neighborhood: string | null
  price_hint: string | null
}

export async function POST(request: NextRequest) {
  try {
    const {
      files,          // DriveFile[] — classified files from browser
      folderName,     // string — folder name hint (e.g. "AWA C103")
      whatsappText,   // string | null — text from WhatsApp message
      folderUrl,      // string — original Drive URL
    } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500, headers: CORS_HEADERS })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400, headers: CORS_HEADERS })
    }

    // Separate file types
    const photos = files.filter((f: DriveFile) =>
      f.mimeType?.startsWith('image/') && f.thumbnail
    )
    const videos = files.filter((f: DriveFile) =>
      f.mimeType?.startsWith('video/')
    )
    const documents = files.filter((f: DriveFile) =>
      f.mimeType?.includes('pdf') ||
      f.mimeType?.includes('word') ||
      f.mimeType?.includes('text') ||
      f.mimeType?.includes('spreadsheet')
    )

    // ── PASS 1: Rank all photos (up to 20 thumbnails) ─────────────────────────
    let photoRankings: PhotoRanking[] = []

    if (photos.length > 0) {
      const thumbnailContent = photos.slice(0, 20).map((f: DriveFile) => ({
        type: 'image',
        source: { type: 'base64', media_type: (f.mimeType?.startsWith('image/') ? f.mimeType : 'image/jpeg') as 'image/jpeg' | 'image/webp' | 'image/png' | 'image/gif', data: f.thumbnail },
      }))

      const rankingPrompt = `Analiza estas ${photos.slice(0, 20).length} fotos de una propiedad inmobiliaria y devuelve un JSON con el análisis de cada foto EN EL MISMO ORDEN que las recibiste.

Para cada foto indica:
- category: "exterior"|"sala"|"cocina"|"recamara"|"bano"|"alberca"|"detalle"|"otro"
- coverScore: número del 0 al 10 (qué tan buena sería para portada: 10=perfecta, exterior amplio bien iluminado; 0=pésima, oscura/borrosa/muy de cerca)
- isCover: true solo para LA MEJOR foto de portada (solo una)

Folder: ${folderName || 'sin nombre'}
Fotos disponibles: ${photos.slice(0, 20).map((f: DriveFile, i: number) => `[${i}] ${f.name}`).join(', ')}

Responde SOLO con este JSON:
{
  "rankings": [
    {"index": 0, "category": "exterior", "coverScore": 9, "isCover": true},
    {"index": 1, "category": "sala", "coverScore": 6, "isCover": false},
    ...
  ]
}`

      const rankRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: [
              ...thumbnailContent,
              { type: 'text', text: rankingPrompt },
            ],
          }],
        }),
      })

      if (rankRes.ok) {
        const rankData = await rankRes.json()
        const rankText = rankData.content?.[0]?.text || ''
        try {
          const clean = rankText.replace(/```json\n?/g, '').replace(/```/g, '').trim()
          const parsed = JSON.parse(clean)
          const rankings = parsed.rankings || []

          photoRankings = photos.slice(0, 20).map((f: DriveFile, i: number) => {
            const rank = rankings.find((r: { index: number }) => r.index === i) || {}
            return {
              id: f.id,
              name: f.name,
              category: rank.category || 'otro',
              coverScore: rank.coverScore || 0,
              isCover: rank.isCover || false,
              order: 0,
            }
          })

          // If no cover selected, pick highest score
          const hasCover = photoRankings.some(r => r.isCover)
          if (!hasCover && photoRankings.length > 0) {
            const best = photoRankings.reduce((a, b) => a.coverScore > b.coverScore ? a : b)
            best.isCover = true
          }

          // Sort by: cover first, then category order, then score
          const categoryOrder = ['exterior', 'sala', 'cocina', 'recamara', 'bano', 'alberca', 'detalle', 'otro']
          photoRankings.sort((a, b) => {
            if (a.isCover) return -1
            if (b.isCover) return 1
            const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
            if (catDiff !== 0) return catDiff
            return b.coverScore - a.coverScore
          })
          photoRankings.forEach((r, i) => { r.order = i })
        } catch {
          photoRankings = photos.slice(0, 20).map((f: DriveFile, i: number) => ({
            id: f.id, name: f.name, category: 'otro' as const,
            coverScore: 0, order: i, isCover: i === 0,
          }))
        }
      }
    }

    const topPhotoIds = photoRankings.slice(0, 8).map(r => r.id)
    const topPhotos = files.filter((f: DriveFile) => topPhotoIds.includes(f.id) && f.full)

    let extracted: ExtractedProperty | null = null

    if (topPhotos.length > 0) {
      const fullContent = topPhotos.map((f: DriveFile) => ({
        type: 'image',
        source: { type: 'base64', media_type: (f.mimeType?.startsWith('image/') ? f.mimeType : 'image/jpeg') as 'image/jpeg' | 'image/webp' | 'image/png' | 'image/gif', data: f.full },
      }))

      const whatsappContext = whatsappText
        ? `\n\nTEXTO DE WHATSAPP (puede tener precio, descripción, contacto):\n${whatsappText}`
        : ''

      const extractPrompt = `Analiza estas imágenes de una propiedad inmobiliaria en la Riviera Maya y extrae TODA la información posible.${whatsappContext}

Devuelve SOLO este JSON (sin texto adicional):
{
  "title": "Nombre descriptivo y atractivo",
  "type": "renta|venta|vacacional",
  "property_kind": "departamento|casa|villa|studio|terreno|local|oficina|penthouse",
  "bedrooms": numero,
  "bathrooms": numero,
  "area_sqm": numero o null,
  "price": numero o null,
  "price_period": "mes|noche|null",
  "description": "Descripción atractiva en español de 3-4 oraciones",
  "amenities": {"pool": bool, "parking": bool, "ocean_view": bool, "pet_friendly": bool, "furnished": bool, "gym": bool, "beach_access": bool, "rooftop": bool, "security": bool},
  "condition": "excelente|bueno|regular",
  "contact_whatsapp": null,
  "contact_name": null,
  "address": null,
  "neighborhood": null,
  "price_hint": null,
  "notes": "observaciones"
}

Folder: ${folderName || 'sin nombre'}`

      const extractRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: [
              ...fullContent,
              { type: 'text', text: extractPrompt },
            ],
          }],
        }),
      })

      if (extractRes.ok) {
        const extractData = await extractRes.json()
        const extractText = extractData.content?.[0]?.text || ''
        try {
          const clean = extractText.replace(/```json\n?/g, '').replace(/```/g, '').trim()
          extracted = JSON.parse(clean)
        } catch {
          extracted = null
        }
      }
    }

    const coverPhoto = photoRankings.find(r => r.isCover)
    const orderedPhotos = photoRankings.map(r => ({
      id: r.id, name: r.name, category: r.category, order: r.order, isCover: r.isCover,
      url: `https://drive.google.com/thumbnail?id=${r.id}&sz=w1200`,
      thumbnail: `https://drive.google.com/thumbnail?id=${r.id}&sz=w400`,
    }))

    return NextResponse.json({
      success: true, folderName, folderUrl,
      summary: { totalFiles: files.length, photos: photos.length, videos: videos.length, documents: documents.length },
      coverPhoto: coverPhoto ? {
        id: coverPhoto.id, url: `https://drive.google.com/thumbnail?id=${coverPhoto.id}&sz=w1200`,
        category: coverPhoto.category, score: coverPhoto.coverScore,
      } : null,
      orderedPhotos,
      videos: videos.map((f: DriveFile) => ({ id: f.id, name: f.name, mimeType: f.mimeType })),
      documents: documents.map((f: DriveFile) => ({ id: f.id, name: f.name, mimeType: f.mimeType })),
      extractedData: extracted,
      propertyRecord: extracted ? {
        title: extracted.title || folderName || 'Sin título',
        type: extracted.type || 'renta',
        property_kind: extracted.property_kind || 'departamento',
        bedrooms: extracted.bedrooms || 0,
        bathrooms: extracted.bathrooms || 0,
        area_sqm: extracted.area_sqm || null,
        price: extracted.price || 0,
        price_period: extracted.price_period || null,
        description: extracted.description || '',
        pool: extracted.amenities?.pool || false,
        parking: extracted.amenities?.parking || false,
        ocean_view: extracted.amenities?.ocean_view || false,
        pet_friendly: extracted.amenities?.pet_friendly || false,
        furnished: extracted.amenities?.furnished || false,
        gym: extracted.amenities?.gym || false,
        beach_access: extracted.amenities?.beach_access || false,
        rooftop: extracted.amenities?.rooftop || false,
        security: extracted.amenities?.security || false,
        contact_whatsapp: extracted.contact_whatsapp || null,
        contact_name: extracted.contact_name || null,
        address: extracted.address || null,
        neighborhood: extracted.neighborhood || null,
        status: 'pendiente',
        source: 'drive',
        source_url: folderUrl || null,
        source_group: folderName || null,
        source_raw: { whatsappText: whatsappText || null, price_hint: extracted.price_hint || null, notes: extracted.notes || null, videosCount: videos.length, documentsCount: documents.length },
      } : null,
    }, { headers: CORS_HEADERS })

  } catch (error) {
    console.error('Process Drive error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500, headers: CORS_HEADERS })
  }
}
