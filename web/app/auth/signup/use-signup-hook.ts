'use client'

import CryptoJS from 'crypto-js'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import globalConfig from '@/configs/global.config'
import customServiceError from '@/utils/custom-service-error'
import { IPasswordCheck, validatePassword } from '@/utils/validate'
import { globalApiPath } from '@/configs/service.config'
import callGlobal from '@/services/global.service'

const signUpFormSchema = z.object({
  displayName: z
    .string()
    .min(3, {
      message: 'Display name must be at least 3 characters',
    })
    .max(50, {
      message: 'Display name must be at most 50 characters',
    }),
  email: z.email({
    message: 'Email must be a valid email address',
  }),
  password: z
    .string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,64}$/, {
      message:
        'Password must contain 8 characters one uppercase one lowercase one number and one special case character',
    }),
})

export type TSignupForm = z.infer<typeof signUpFormSchema>

const useSignupHook = () => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | string[]>('')
  const [passwordValidation, setPasswordValidation] = useState<
    IPasswordCheck[]
  >([])

  const signupForm = useForm<TSignupForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: TSignupForm) => {
    try {
      setLoading(true)
      setError('')
      // Remove temp data (email) for send to otp page
      localStorage.removeItem('temp')

      const result = await callGlobal.post(
        globalApiPath.all.path.signup,
        {
          displayName: values.displayName,
          email: values.email,
          password: values.password,
        }
      )

      if (result.status === 201) {
        // Reset error message
        setError('')

        // Save email to local storage to send otp
        const emailEncode = CryptoJS.AES.encrypt(
          values.email,
          process.env.NEXT_PUBLIC_TEMP_SECRET_KEY as string,
        )

        localStorage.setItem(
          globalConfig.localStorage.sentEmailToOtp,
          emailEncode.toString(),
        )

        setTimeout(() => {
          router.push('/auth/otp')
        }, 1000)
      }
    } catch (error) {
      const err = customServiceError(error)
      console.log('pass error')
      if (err) {
        setError(err?.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const { password } = signupForm.getValues()
    if (password) {
      const { checks } = validatePassword(password)
      setPasswordValidation(checks)
    } else {
      setPasswordValidation([])
    }
  }, [signupForm.watch('password')])

  return {
    signupForm,
    onSubmit,
    loading,
    error,
    passwordValidation,
  }
}

export default useSignupHook
