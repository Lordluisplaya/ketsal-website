import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    const supabase = createAdminClient()
    const { data: props } = await supabase
      .from('v_properties_public')
      .select('id,title,type,price,bedrooms,neighborhood')
      .limit(20)

    const context = (props || [])
      .map(p => '- ' + p.title + ': ' + p.type + ', USD $' + (p.price?.toLocaleString() || 'consultar') + ', ' + (p.bedrooms || 0) + ' rec, ' + (p.neighborhood || 'Riviera Maya'))
      .join('\n')

    const systemPrompt = 'Eres el asistente de Ketsal Real Estate en Playa del Carmen, Riviera Maya, Mexico. ' +
      'Ayuda a encontrar propiedades. Se amigable y profesional. ' +
      'Sugiere contactar por WhatsApp para mas detalles.\n\nPropiedades disponibles:\n' + context

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages: messages,
    })

    return NextResponse.json({ message: response.content[0].type === 'text' ? response.content[0].text : '' })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Error al procesar mensaje' }, { status: 500 })
  }
}