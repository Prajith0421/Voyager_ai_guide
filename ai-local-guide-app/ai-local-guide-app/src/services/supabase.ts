import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ChatMessage, SavedPlace } from '../types'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key || url === 'your_url') return null

  client = createClient(url, key)
  return client
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null
}

export async function signInWithEmail(email: string, password: string) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')
  return sb.auth.signUp({ email, password })
}

export async function signOut() {
  const sb = getSupabase()
  if (!sb) return
  return sb.auth.signOut()
}

export async function getSession() {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data.session
}

export async function fetchSavedPlaces(userId: string): Promise<SavedPlace[]> {
  const sb = getSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('saved_places')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function savePlace(
  userId: string,
  place: Omit<SavedPlace, 'id' | 'user_id' | 'created_at'>
) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')

  const { data: existing, error: lookupError } = await sb
    .from('saved_places')
    .select('id')
    .eq('user_id', userId)
    .eq('place_id', place.place_id)
    .maybeSingle()

  if (lookupError) throw lookupError
  if (existing) return

  const { error } = await sb.from('saved_places').insert({
    user_id: userId,
    place_id: place.place_id,
    name: place.name,
    category: place.category,
    lat: place.lat,
    lng: place.lng,
    address: place.address,
  })

  if (error) {
    if (error.code === '23505') return
    throw error
  }
}

export async function removeSavedPlace(id: string) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')

  const { error } = await sb.from('saved_places').delete().eq('id', id)
  if (error) throw error
}

export async function saveChat(
  userId: string,
  title: string,
  messages: ChatMessage[],
  locationLabel: string
) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase not configured')

  const { error } = await sb.from('saved_chats').insert({
    user_id: userId,
    title,
    messages,
    location_label: locationLabel,
  })

  if (error) throw error
}

export async function fetchSavedChats(userId: string) {
  const sb = getSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('saved_chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
