import Agent, { CallStatus } from "@/app/components/Agent"
import { getCurrentUser } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"

const Page = async () => {
  const user = await getCurrentUser()

  if (!user) {
    console.warn("[Page] No user found. Redirecting to home.")
    redirect("/") // ✅ redirect from server
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-semibold">Talk to Soal AI</h2>
        <p className="text-gray-600 text-sm">
          Speak with our AI assistant to generate a customized interview for you.
          <br />
          Just tell us what job or topic you want the interview to be about.
        </p>
      </div>

      <Agent
        username={user.name}
        userId={user.id}
        currentUser={user}
        type="generate"
      />
    </div>
  )
}

export default Page