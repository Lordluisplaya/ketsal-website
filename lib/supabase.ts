import { createClient as supabaseCreateClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

export function createClient() {
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey)
}

// Alias for backward compatibility with admin routes
export function createAdminClient() {
  return supabaseCreateClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  })
}

export const supabase = createClient()
