import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET ?collaborationId=... — returns qr_data for influencer's collaboration (influencer must be owner)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const collaborationId = searchParams.get('collaborationId')
  if (!collaborationId) {
    return NextResponse.json({ error: 'collaborationId required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: collaboration, error: collabError } = await supabase
    .from('collaborations')
    .select('id, influencer_id')
    .eq('id', collaborationId)
    .single()

  if (collabError || !collaboration || collaboration.influencer_id !== user.id) {
    return NextResponse.json({ error: 'Collaboration not found or access denied' }, { status: 404 })
  }

  const { data: qr, error: qrError } = await supabase
    .from('qr_codes')
    .select('qr_data')
    .eq('collaboration_id', collaborationId)
    .eq('is_active', true)
    .single()

  if (qrError || !qr?.qr_data) {
    return NextResponse.json({ error: 'QR code not found for this collaboration' }, { status: 404 })
  }

  return NextResponse.json({ qr_data: qr.qr_data })
}
