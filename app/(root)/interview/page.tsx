import Agent, { CallStatus } from "@/app/components/Agent"

const Page = () => {
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

      <Agent callStatus={CallStatus.ACTIVE} />
    </div>
  )
}

export default Page