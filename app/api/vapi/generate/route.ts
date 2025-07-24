import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { initializeFirestore } from '@/firebase/admin'
import { z } from 'zod'

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

export async function POST(request: Request) {
  const { db } = initializeFirestore()

  try {
    const { userId, transcript } = await request.json()

    console.log('[🟢 POST /api/vapi/generate]', { userId })
    console.log('[📝 Transcript Input]', transcript?.slice(0, 300))

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      prompt: `
You are an AI assistant that analyzes transcripts of voice-based job interview setup calls.

Your goal is to extract structured information and generate a list of custom interview questions based on what the user said.

Here’s what you must return as a JSON object:

{
  "role": string — the job title mentioned (e.g., "Frontend Developer"),
  "level": string — the experience level (e.g., "Junior", "Mid", "Senior"),
  "techstack": string[] — list of technologies mentioned (e.g., ["React", "Next.js", "Tailwind"]),
  "type": string — either "technical" or "behavioral" depending on what the user asked for,
  "questions": string[] — 5–10 custom interview questions
}

DO NOT include explanation or markdown, just return the JSON object.

Transcript:
${transcript}
`,
      schema: z.object({
        role: z.string(),
        level: z.string(),
        type: z.string(),
        techstack: z.array(z.string()),
        questions: z.array(z.string()),
      }),
      system:
        'You are a structured extractor of job-related transcripts. Be precise. Never make up values not mentioned.',
    })

    console.log('[✅ Gemini Parsed Result]', result)

    const object = result.object

    const isValid =
      object?.role &&
      object?.level &&
      object?.type &&
      Array.isArray(object?.techstack) &&
      object.techstack.length > 0 &&
      Array.isArray(object?.questions) &&
      object.questions.length > 0

    if (!isValid) {
      console.warn('[⚠️ Gemini returned incomplete data]', result)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing fields: Make sure you clearly mention role, level, techstack, and type during the interview.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const interview = {
      userId,
      ...object,
      finalized: true,
      createdAt: new Date().toISOString(),
    }

    await db.collection('interviews').add(interview)

    return new Response(JSON.stringify({ success: true, data: interview }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[🔥 GENERATE API ERROR]', error)
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}