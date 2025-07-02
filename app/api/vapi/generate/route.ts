import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { initializeFirestore } from "@/firebase/admin";

// CORS config
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow Vapi, frontend, Postman etc.
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Preflight handler (for CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  const { db } = initializeFirestore();

  try {
    const { type, role, level, techstack, amount, userid } = await request.json();

    console.log("[VAPI API HIT]", { type, role, level, techstack, amount, userid });

    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
      `,
    });

    const cleaned = rawQuestions
      .replace(/```json/i, "")
      .replace(/```/, "")
      .trim();

    const parsedQuestions = JSON.parse(cleaned);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions: parsedQuestions,
      userId: userid || "not found",
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[🔥 VAPI ERROR]", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ success: true, data: "Ping from API ✅" }), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}