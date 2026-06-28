import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { messages } = await request.json()
  const supabase = createAdminClient()
  const { data: props } = await supabase.from('v_properties_public').select('id,title,type,price,currency,bedrooms,zone_name').limit(20)
  const context = (props || []).map(p => `- ${p.title}: ${p.type}, ${p.currency} ${p.price?.toLocaleString()}, ${p.bedrooms||0} rec, ${p.zone_name}`).join('\n')
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: `Eres el asistente bilingüe (español/inglés) de Ketsal Real Estate en Playa del Carmen, Riviera Maya, México. Ayuda a encontrar propiedades. Sé amigable y profesional. Siempre sugiere contactar por WhatsApp para más detalles.\n\nPropiedades disponibles:\n${context}`,
    messages,
  })
  return NextResponse.json({ message: response.content[0].type === 'text' ? response.content[0].text : '' })
}