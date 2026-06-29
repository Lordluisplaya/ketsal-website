import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo')
  const kind = searchParams.get('kind')

  let query = supabase
    .from('v_properties_public')
    .select('*')
    .order('created_at', { ascending: false })

  if (tipo) query = query.eq('type', tipo)
  if (kind) query = query.eq('property_kind', kind)

  const { data, error } = await query

  if (error) {
    console.error('Properties API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  }

  return NextResponse.json(data || [], { headers: CORS })
}
