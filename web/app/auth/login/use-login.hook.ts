'use client'

import CryptoJS from 'crypto-js'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import useSession from '@/hooks/use-session.hook'
import callGlobal from '@/services/global.service'
import { globalApiPath } from '@/configs/service.config'
import callWithAuth from '@/services/auth.service'
import globalConfig from '@/configs/global.config'
import customServiceError from '@/utils/custom-service-error'

const loginSchema = z.object({
  email: z.email({
    message: 'Enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Enter your password',
  }),
})

export type LoginForm = z.infer<typeof loginSchema>

export const useLoginHook = () => {
  const router = useRouter()
  const { setSession } = useSession()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const searchParams = useSearchParams()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      setError('')

      const result = await callGlobal.post(globalApiPath.all.path.login, data)

      if (result.status === 200) {
        const { token, account } = result.data

        if (!account.isVerify) {
          // Save email to local storage to send otp
          const emailEncode = CryptoJS.AES.encrypt(
            account.email,
            process.env.NEXT_PUBLIC_TEMP_SECRET_KEY as string,
          )

          localStorage.setItem(
            globalConfig.localStorage.sentEmailToOtp,
            emailEncode.toString(),
          )

          router.push('/auth/otp')
        } else {
          const session = {
            token: {
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
            },
            user: {
              name: account.displayName,
              email: account.email,
              image: account.image,
              isVerify: account.isVerify,
            },
          }

          setSession(session)

          callWithAuth.defaults.headers.common['Authorization'] =
            `Bearer ${token.accessToken}`

          router.push(
            searchParams.get('callbackUrl') ?? globalConfig.auth.afterLoginUrl,
          )
        }
      } else {
        router.push('/auth/login?error=invalid')
      }
    } catch (error) {
      const err = customServiceError(error)

      if (err) {
        setError(err?.message as string)
      }

      setLoading(false)
    }
  }

  return {
    loginForm,
    onSubmit,
    loading,
    error,
  }
}
