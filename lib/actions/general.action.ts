"use server"

import { generateObject } from "ai"
import { google } from "@ai-sdk/google"

import { initializeFirestore } from "@/firebase/admin"
import { feedbackSchema } from "@/constants"

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params

  try {
    const { db } = initializeFirestore()

    // 👇 Convert transcript string to structured array
    const lines = transcript.split('\n').filter(Boolean)

    const minResponseLength = 10;
    const structuredTranscript = lines.map((line) => {
      const [role, ...rest] = line.split(':')
      const content = rest.join(':').trim();

      return {
        role: role?.trim() || 'unknown',
        content: content,
        isAdequate: role?.trim() === 'user' ? content.length >= minResponseLength && content.split(' ').length >= 3 : true
      }
    })

    // 👇 Check if interview has sufficient responses
    const adequateUserResponses = structuredTranscript.filter(t => t.role === 'user' && t.isAdequate);
    const hasInsufficientData = adequateUserResponses.length < 2;

    // 👇 Format transcript for prompt
    const formattedTranscript = structuredTranscript
      .map(({ role, content }) => `- ${role}: ${content}`)
      .join('\n')

    console.log('[📝 Prompt sent to Gemini]', formattedTranscript)

    const result = await generateObject({
      model: google('gemini-1.5-flash', { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
You are a professional AI interview assessor trained to evaluate mock technical interviews with fairness, structure, and precision.

Your task is to analyze the following mock interview transcript between an AI interviewer and a user.

CRITICAL INSTRUCTIONS:
- Only evaluate questions that the user clearly responded to with substantial, meaningful answers
- Do NOT score or comment on questions where the user gave no meaningful answer, incomplete responses, or responses that are too brief (less than 10 words)
- Do NOT infer, guess, or imagine answers that weren't actually given
- If a response is unclear, fragmented, or doesn't address the question, treat it as "No clear answer provided"
- Base your total score ONLY on questions that received adequate responses
- If the interview lacks sufficient responses, mention this in your assessment

MINIMUM RESPONSE CRITERIA:
- Response must be at least 10 words long
- Response must directly address the question asked
- Response must be grammatically coherent and complete
- Response must demonstrate actual knowledge or experience

SCORING GUIDELINES:
- If 0-1 adequate responses: Total score should be 0-25
- If 2-3 adequate responses: Total score should be 25-50
- If 4+ adequate responses: Score based on quality (50-100)

Use this format for your response:

1. **Total Score** (0–100) — based **only on adequately answered questions**
2. **Category Scores** (0–10 each):
   - Communication Skills  
   - Technical Knowledge  
   - Problem-Solving  
   - Cultural & Role Fit  
   - Confidence & Clarity  
3. **Strengths** — List 2–5 strong points observed in valid answers (write "Limited responses provided" if insufficient data)
4. **Areas for Improvement** — List 2–5 suggestions based on actual performance
5. **Final Assessment** — A honest paragraph based on actual responses only
6. **Structured Q&A Feedback** — For each question in the transcript:
   - **Question**: The interview question  
   - **User Answer**: ONLY include if the answer meets minimum criteria above. If not adequate, write: "Response too brief or unclear"
   - **AI Feedback**: 
     * If answered adequately: Specific, constructive comment
     * If not answered adequately: "No clear answer provided — question skipped"
   - **Score (0–10)**: Only assign if answer meets minimum criteria, otherwise "N/A"

IMPORTANT: Be honest about the quality of responses. If most questions lack adequate responses, reflect this in a lower total score and mention in the final assessment that the interview lacked sufficient depth for proper evaluation.

Additional Context: This interview ${hasInsufficientData ? 'appears to have insufficient responses for a comprehensive evaluation' : 'has adequate responses for evaluation'}.

Transcript:
${formattedTranscript}
`,
      system: "You are a professional interviewer providing structured feedback. You must be honest about incomplete or inadequate responses and not fabricate or assume answers that weren't given. Focus on accuracy and truthfulness over being overly positive.",
    })

    console.log('[🧠 Gemini Raw Result]', result)

    if (!result.object) {
      console.error('[❌ Gemini output did not match schema]', result)
      return { success: false, error: 'AI did not return a valid structured object.' }
    }

    const object = result.object

    const feedback = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      questions: object.questions ?? [],
      createdAt: new Date().toISOString(),
      hasInsufficientData,
      adequateResponseCount: adequateUserResponses.length,
    }

    const feedbackRef = feedbackId
      ? db.collection('feedback').doc(feedbackId)
      : db.collection('feedback').doc()

    await feedbackRef.set(feedback)

    return { success: true, feedbackId: feedbackRef.id }
  } catch (error) {
    console.error('❌ Error saving feedback:', error)
    return { success: false, error: error.message }
  }
}


export async function getInterviewById(id: string): Promise<Interview | null> {
  const { db } = initializeFirestore()

  const interview = await db.collection("interviews").doc(id).get()
  return interview.exists ? { id: interview.id, ...interview.data() } as Interview : null
}

export async function getFeedbackByInterviewId(params: { interviewId: string }): Promise<Feedback | null> {
  const { db } = initializeFirestore()
  const { interviewId } = params
  
  console.log('[getFeedbackByInterviewId] Looking for:', interviewId)
  console.log('[getFeedbackByInterviewId] Looking for (type):', typeof interviewId)
  console.log('[getFeedbackByInterviewId] Looking for (length):', interviewId.length)
  
  // First, let's see what interviewIds actually exist in the database
  const allSnapshot = await db.collection("feedback").get()
  console.log('[getFeedbackByInterviewId] All existing interviewIds:')
  allSnapshot.forEach(doc => {
    const data = doc.data()
    console.log('  -', data.interviewId, '(type:', typeof data.interviewId, ', length:', data.interviewId?.length, ')')
  })
  
  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId.trim())
    .limit(1)
    .get()
    
  console.log('[getFeedbackByInterviewId] Found:', querySnapshot.size)
  
  if (querySnapshot.empty) {
    console.log('[getFeedbackByInterviewId] No documents found for interviewId:', interviewId)
    return null
  }
  
  const feedbackDoc = querySnapshot.docs[0]
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { db } = initializeFirestore()
  const { userId, limit = 20 } = params

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get()

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const { db } = initializeFirestore()

  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get()

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]
}

export async function getAllFeedbacks() {
    const { db } = initializeFirestore()

    const snapshot = await db.collection("feedback").get()
console.log("All feedback count:", snapshot.size)
snapshot.forEach(doc => {
  console.log(doc.id, doc.data())
})

return snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
})) as Feedback[]
}
