import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  try {
    const { images, folderName } = await request.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Build message with up to 8 images
    const imageContent = images.slice(0, 8).map((img: { data: string; mediaType: string }) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mediaType || 'image/jpeg',
        data: img.data,
      },
    }))

    const prompt = `Analiza estas imágenes de una propiedad inmobiliaria en la Riviera Maya (Playa del Carmen / Tulum area) y extrae la siguiente información en JSON:

{
  "title": "Nombre sugerido para la propiedad (ej: Departamento en Aldea Zama, Villa en Tulum)",
  "type": "departamento|casa|villa|studio|terreno|local",
  "bedrooms": número de recámaras (0 si es studio o no aplica),
  "bathrooms": número de baños,
  "area_sqm": área aproximada en m2 si es visible (null si no se puede determinar),
  "description": "Descripción atractiva en español de 2-3 oraciones basada en lo que ves",
  "amenities": {
    "pool": true/false,
    "parking": true/false,
    "ocean_view": true/false,
    "pet_friendly": false,
    "furnished": true/false
  },
  "condition": "excelente|bueno|regular",
  "price_hint": "si ves algún precio o anuncio en las imágenes, escríbelo aquí, sino null",
  "notes": "cualquier observación relevante"
}

Folder name hint: ${folderName || 'no disponible'}

Responde SOLO con el JSON, sin texto adicional.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              ...imageContent,
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Anthropic error: ${err}` }, { status: 500, headers: CORS_HEADERS })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Parse JSON from response
    let extracted
    try {
      const clean = text.replace(/```json\n?/g, '').replace(/```/g, '').trim()
      extracted = JSON.parse(clean)
    } catch {
      extracted = { raw: text }
    }

    return NextResponse.json({ success: true, data: extracted }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Extract error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500, headers: CORS_HEADERS })
  }
}
