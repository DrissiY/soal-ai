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

    const structuredTranscript = lines.map((line) => {
      const [role, ...rest] = line.split(':')
      return {
        role: role?.trim() || 'unknown',
        content: rest.join(':').trim(),
      }
    })

    // 👇 Format transcript for prompt
    const formattedTranscript = structuredTranscript
      .map(({ role, content }) => `- ${role}: ${content}`)
      .join('\n')

    const { object } = await generateObject({
      model: google('gemini-1.5-flash', { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on the transcript below.

Be structured, honest, and specific. Provide:

1. A **total score** (0-100).
2. Detailed **category scores** for:
   - Communication Skills
   - Technical Knowledge
   - Problem-Solving
   - Cultural & Role Fit
   - Confidence & Clarity
3. A list of **strengths** and **areas for improvement**.
4. A **final written assessment**.
5. A structured array of **interview questions** with:
   - Question
   - User's answer (infer from transcript)
   - AI feedback (comment)
   - A score (0-10)

Transcript:
${formattedTranscript}
      `,
      system: "You are a professional interviewer providing structured feedback on a candidate’s performance.",
    })

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
    }

    const feedbackRef = feedbackId
      ? db.collection('feedback').doc(feedbackId)
      : db.collection('feedback').doc()

    await feedbackRef.set(feedback)

    return { success: true, feedbackId: feedbackRef.id }
  } catch (error) {
    console.error('❌ Error saving feedback:', error)
    return { success: false }
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
