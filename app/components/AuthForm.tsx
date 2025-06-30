'use client'

import React, { useState } from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from 'next/image'
import logo from "../../public/Logo-soal.png"
import { Form } from "./ui/form"
import { Button } from "./ui/button"
import Link from 'next/link'
import { toast } from 'sonner'
import { FormFieldInput } from "./FormFeild"
import { useRouter } from 'next/navigation'

type FormType = 'sign-in' | 'sign-up'

const authFormSchema = (type: FormType, step: 'form' | 'verify') => {
  return z.object({
    name:
      type === 'sign-up' && step === 'form'
        ? z.string().min(3, "Name is required")
        : z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password:
      step === 'form'
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().optional(),
    code:
      type === 'sign-up' && step === 'verify'
        ? z.string().min(6, "Code must be 6 digits")
        : z.string().optional(),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const router = useRouter()

  const schema = authFormSchema(type, step)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      code: '',
    },
  })

  const isSignIn = type === "sign-in"

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (type === 'sign-up' && step === 'form') {
        // 📨 Normally you'd call your backend to send the code here
        toast.success('Verification code sent to your email!')
        setStep('verify')
      } else if (type === 'sign-up' && step === 'verify') {
        // ✅ Backend would verify the code here
        toast.success('Account verified successfully!')
        router.push('/log-in')
      } else {
        // 🟢 Sign-in
        toast.success('Logged in successfully!')
        router.push('/')
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-white dark:bg-dark-200 shadow-xl rounded-2xl p-8 sm:p-10 border border-border animate-fadeIn">
        <div className="flex justify-center items-center">
          <Image className="mb-5" src={logo} height={120} width={120} alt="logo" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Only show on sign-up step 1 */}
            {!isSignIn && step === 'form' && (
              <FormFieldInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}

            {/* Email is always needed */}
            <FormFieldInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
            />

            {/* Password for sign-in or step 1 of sign-up */}
            {step === 'form' && (
              <FormFieldInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
              />
            )}

            {/* Code input only in sign-up step 2 */}
            {type === 'sign-up' && step === 'verify' && (
              <FormFieldInput
                control={form.control}
                name="code"
                label="Verification Code"
                placeholder="6-digit code"
              />
            )}

            <Button
              type="submit"
              className="w-full rounded-full font-bold min-h-10 bg-purple-600 text-white hover:bg-purple-700"
            >
              {isSignIn
                ? 'Log in'
                : step === 'form'
                ? 'Continue'
                : 'Verify & Create Account'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignIn
            ? `Don't have an account? `
            : `Already have an account? `}
          <Link
            href={isSignIn ? '/sign-up' : '/log-in'}
            className="text-primary-200 font-medium hover:underline"
          >
            {isSignIn ? 'Sign up' : 'Log in'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthForm