import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { initializeFirestore } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

// Handle CORS preflight request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, role, level, techStack, amount, userId: rawUserId } = body;

    console.log("[VAPI API HIT] Received POST with data:", body);

    const { db } = initializeFirestore();

    // Step 1: Determine userId (from body OR session fallback)
    let userId = typeof rawUserId === "string" ? rawUserId : "not found";

    if (userId === "not found") {
      try {
        const user = await getCurrentUser();
        if (user?.id) {
          userId = user.id;
        }
      } catch (err) {
        console.warn("[⚠️ Auth Warning] No session detected, using fallback");
      }
    }

    // Step 2: Generate interview questions
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is ${amount}.
        Please return only the questions as raw JSON array like:
        ["Question 1", "Question 2", "Question 3"]
        Do NOT include any Markdown formatting like \`\`\`.
        No explanations, no titles.
      `,
    });

    // Step 3: Clean and parse questions
    const cleaned = rawQuestions
      .replace(/```json/i, "")
      .replace(/```/, "")
      .trim();

    let parsedQuestions: string[];

    try {
      parsedQuestions = JSON.parse(cleaned);
    } catch (err) {
      console.error("[❌ JSON Parse Error]", cleaned);
      throw new Error("Failed to parse questions. Response was not valid JSON.");
    }

    // Step 4: Build interview object
    const interview = {
      role,
      type,
      level,
      techstack: (techStack || "").split(",").map((t: string) => t.trim()),
      questions: parsedQuestions,
      userId,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[🔥 VAPI ERROR]", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ success: true, data: "Thank you!" }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}