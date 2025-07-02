import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { initializeFirestore } from "@/firebase/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

Return ONLY a raw JSON array of questions like:
["Question 1", "Question 2", "Question 3"]

Do NOT include any extra text, explanation, markdown, or formatting.`
    });

    console.log("[🧪 Gemini RAW Output]", rawQuestions);

    const cleaned = rawQuestions
      .replace(/```json/i, "")
      .replace(/```/, "")
      .trim();

    let parsedQuestions: string[] = [];

    try {
      parsedQuestions = JSON.parse(cleaned);
      if (!Array.isArray(parsedQuestions)) throw new Error("Not an array");
    } catch (err) {
      console.warn("[⚠️ Gemini returned non-JSON or invalid array]", cleaned);
      parsedQuestions = [
        "Could not generate valid questions.",
        "Please try again or adjust the input.",
      ];
    }

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
  return new Response(JSON.stringify({ success: true, data: "Ping from Vapi API" }), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}