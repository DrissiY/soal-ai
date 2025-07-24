import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Mic, 
  Brain, 
  FileText, 
  Users, 
  Building, 
  GraduationCap, 
  Check, 
  Mail, 
  Globe, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  MessageSquare
} from 'lucide-react'

const LandingPageSections = () => {
  const [openFaq, setOpenFaq] = React.useState(null)

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const faqItems = [
    {
      question: "Do I need a webcam or video?",
      answer: "No. For now, SoalAI is voice-only, focusing on spoken communication."
    },
    {
      question: "How many questions does an interview include?",
      answer: "It typically includes 5–8 questions, tailored to your selected role or skill."
    },
    {
      question: "Is the feedback instant?",
      answer: "Yes — the transcript and feedback are generated automatically within seconds after the session ends."
    },
    {
      question: "Can I customize the questions?",
      answer: "Yes, if you're a Pro user or part of a hiring team, you can upload a CV or write a custom prompt, and the AI generates a tailored interview."
    },
    {
      question: "What languages are supported?",
      answer: "Currently: English and French (Darija & other languages coming soon)."
    }
  ]

  return (
    <div className="">
      {/* What is SoalAI Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">What is SoalAI?</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              AI-Powered Interview Assistant
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-purple-700">SoalAI</span> is an AI-powered interview assistant that helps users{' '}
              <span className="text-green-600 font-semibold">prepare for real interviews</span>,{' '}
              <span className="text-purple-600 font-semibold">get personalized feedback</span>, and{' '}
              <span className="text-violet-600 font-semibold">train their communication skills</span> using voice-based mock sessions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: MessageSquare,
                title: "Real Conversations",
                description: "Experience natural, human-like interviews powered by advanced AI technology."
              },
              {
                icon: Target,
                title: "Structured Feedback",
                description: "Get detailed analysis with scores, strengths, and improvement areas."
              },
              {
                icon: Users,
                title: "For Everyone",
                description: "Perfect for job seekers, hiring teams, and career coaches alike."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-10 bg-gradient-to-br from-purple-50 to-violet-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-full mb-6">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">How It Works</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Simple. Powerful. Effective.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Mic,
                step: "01",
                title: "Talk to AI Interviewer",
                description: "Start a mock interview via voice. No webcam needed - just speak naturally."
              },
              {
                icon: Brain,
                step: "02",
                title: "Real-Time Interaction",
                description: "Experience natural conversation flow. AI adapts questions based on your responses."
              },
              {
                icon: FileText,
                step: "03",
                title: "Get Instant Feedback",
                description: "Receive full transcript and structured analysis with scores and improvement tips."
              },
              {
                icon: Sparkles,
                step: "04",
                title: "Try First, Subscribe",
                description: "Every new user gets one free interview. Then choose from affordable packages."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className="text-6xl font-black text-purple-100 mb-4">{step.step}</div>
                <step.icon className="w-12 h-12 text-purple-600 mb-6 -mt-12 relative z-10" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Built for <span className="bg-gradient-to-r from-purple-700 to-green-500 bg-clip-text text-transparent">Everyone</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Users,
                title: "For Individuals",
                subtitle: "Mock Interviews",
                features: [
                  "Practice technical & behavioral interviews",
                  "Low-stress environment",
                  "AI-generated improvement feedback",
                  "Industry-specific questions"
                ],
                color: "purple"
              },
              {
                icon: Building,
                title: "For Hiring Teams",
                subtitle: "Candidate Assessment",
                features: [
                  "Voice-based interview tests",
                  "Automatic communication assessment",
                  "Filter stronger candidates early",
                  "Save time in hiring process"
                ],
                color: "green"
              },
              {
                icon: GraduationCap,
                title: "For Career Coaches",
                subtitle: "Student Training",
                features: [
                  "Personalized practice tools",
                  "Progress tracking with transcripts",
                  "Add value without extra workload",
                  "Structured feedback reports"
                ],
                color: "violet"
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`bg-gradient-to-br ${
                  useCase.color === 'purple' ? 'from-purple-50 to-purple-100' :
                  useCase.color === 'green' ? 'from-green-50 to-emerald-100' :
                  'from-violet-50 to-violet-100'
                } rounded-2xl p-8 border border-gray-100`}
              >
                <useCase.icon className={`w-12 h-12 ${
                  useCase.color === 'purple' ? 'text-purple-600' :
                  useCase.color === 'green' ? 'text-green-600' :
                  'text-violet-600'
                } mb-6`} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className={`text-sm font-medium ${
                  useCase.color === 'purple' ? 'text-purple-700' :
                  useCase.color === 'green' ? 'text-green-700' :
                  'text-violet-700'
                } mb-6`}>{useCase.subtitle}</p>
                <ul className="space-y-3">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className={`w-5 h-5 ${
                        useCase.color === 'purple' ? 'text-purple-600' :
                        useCase.color === 'green' ? 'text-green-600' :
                        'text-violet-600'
                      } mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-10 bg-gradient-to-br from-purple-50 to-violet-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Free Trial",
                price: "Free",
                description: "Perfect for trying out SoalAI",
                features: [
                  "1 Mock Interview",
                  "AI Feedback Report",
                  "No credit card required"
                ],
                buttonText: "Start Free Trial",
                popular: false
              },
              {
                name: "Basic Plan",
                price: "$9/month",
                description: "Ideal for job seekers",
                features: [
                  "3 interviews / month",
                  "Full transcripts",
                  "AI feedback",
                  "CV-based interviews"
                ],
                buttonText: "Choose Basic",
                popular: true
              },
              {
                name: "Pro Plan",
                price: "$29/month",
                description: "For hiring or coaching use",
                features: [
                  "10+ interviews / month",
                  "Upload custom prompts / CVs",
                  "Priority support",
                  "Share feedback reports"
                ],
                buttonText: "Choose Pro",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  plan.popular ? 'border-purple-500 shadow-lg' : 'border-gray-100'
                } hover:shadow-lg transition-shadow duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-black text-purple-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-4 rounded-full font-bold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:scale-105 hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <p className="text-gray-600">
              Custom enterprise plans available for HR teams & bootcamps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact/About Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-10 bg-gradient-to-br from-purple-900 to-violet-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black mb-6">
              Let's Connect
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-purple-100 max-w-3xl mx-auto">
              SoalAI is built with ❤️ by a team passionate about making interviews more{' '}
              <span className="text-green-400 font-semibold">fair</span>,{' '}
              <span className="text-purple-300 font-semibold">accessible</span>, and{' '}
              <span className="text-violet-300 font-semibold">data-driven</span>.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: Mail,
                title: "Email Us",
                content: "hello@soalai.com",
                description: "Questions? Partnerships? We'd love to hear from you."
              },
              {
                icon: Globe,
                title: "Visit Our Website",
                content: "soalai.com",
                description: "Explore more features and get started today."
              },
              {
                icon: MapPin,
                title: "Our Location",
                content: "Based in Morocco",
                description: "Serving globally with local expertise."
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <contact.icon className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                <p className="text-2xl font-bold text-green-400 mb-2">{contact.content}</p>
                <p className="text-purple-100">{contact.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <p className="text-purple-100">
              Ready to ace your next interview? Join thousands of users who trust SoalAI.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPageSections