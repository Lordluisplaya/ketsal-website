import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createAdminClient()
  let q = supabase.from('properties').select('*, zones(name,slug,city)').order('created_at', { ascending: false })
  const status = searchParams.get('status')
  if (status) q = q.eq('status', status)
  const { data, error } = await q.limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json()
  const supabase = createAdminClient()
  const update: Record<string, unknown> = { status }
  if (status === 'publicada') update.published_at = new Date().toISOString()
  const { data, error } = await supabase.from('properties').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}