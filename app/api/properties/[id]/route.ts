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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: property, error } = await supabase
    .from('v_properties_public')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404, headers: CORS })
  }

  const { data: photos } = await supabase
    .from('property_photos')
    .select('id, url, is_cover, sort_order')
    .eq('property_id', params.id)
    .order('sort_order', { ascending: true })

  return NextResponse.json({ ...property, photos: photos || [] }, { headers: CORS })
}
