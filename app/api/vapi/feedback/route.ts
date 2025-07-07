import { NextRequest } from 'next/server'
import { createFeedback } from '@/lib/actions/general.action'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { interviewId, userId, transcript } = body

    if (!interviewId || !userId || !Array.isArray(transcript)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid data' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const result = await createFeedback({
      interviewId,
      userId,
      transcript,
    })

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API] Feedback Error:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export async function GET() {
  return new Response(JSON.stringify({ success: true, message: 'Feedback endpoint ready' }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}