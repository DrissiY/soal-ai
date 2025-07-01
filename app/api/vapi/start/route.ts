// /app/api/vapi/start/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { userId, userName } = body;

  const VAPI_SECRET_KEY = process.env.VAPI_SECRET_KEY; // You must add this in .env

  if (!VAPI_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing VAPI_SECRET_KEY' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VAPI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistant: {
          // If you're using a workflow instead of assistant, change this to `workflow`
          workflow: process.env.VAPI_WORKFLOW_ID,
          variableValues: {
            username: userName,
            userid: userId,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}