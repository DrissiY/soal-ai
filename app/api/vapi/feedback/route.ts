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
    console.log('[POST /api/vapi/feedback] Received body:', body)

    const { interviewId, userId, transcript, feedbackId } = body

    if (!interviewId || !userId || typeof transcript !== 'string') {
      console.warn('[POST /api/vapi/feedback] Missing or invalid data:', {
        interviewId,
        userId,
        transcriptType: typeof transcript,
      })

      return new Response(
        JSON.stringify({ success: false, error: 'Missing or invalid data' }),
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('[POST /api/vapi/feedback] Creating feedback with:', {
      interviewId,
      userId,
      feedbackId,
      transcriptSnippet: transcript.slice(0, 100), 
    })

    const result = await createFeedback({
      interviewId,
      userId,
      transcript,
      feedbackId,
    })

    console.log('[POST /api/vapi/feedback] Feedback created successfully:', result)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[POST /api/vapi/feedback] Error creating feedback:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export async function GET() {
  console.log('[GET /api/vapi/feedback] Endpoint pinged')
  return new Response(
    JSON.stringify({ success: true, message: 'Feedback endpoint ready' }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}