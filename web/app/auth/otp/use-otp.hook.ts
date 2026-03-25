import CryptoJS from 'crypto-js'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import customServiceError from '@/utils/custom-service-error'
import globalConfig from '@/configs/global.config'
import callGlobal from '@/services/global.service'
import { globalApiPath } from '@/configs/service.config'

const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, {
      message: 'OTP must be 6 digits',
    })
    .regex(/^\d+$/, {
      message: 'OTP must be a number',
    }),
})

export type TOtpForm = z.infer<typeof otpFormSchema>

interface IUseOtpHook {
  startCountdown: () => void
}

const useOtpHook = ({ startCountdown }: IUseOtpHook) => {
  const router = useRouter()

  const otpLength = 6
  const [email, setEmail] = useState<string>('')
  const [refCode, setRefCode] = useState<string>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Form
  const otpForm = useForm<TOtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  })

  // Submit form
  const onSubmit = async (values: TOtpForm) => {
    try {
      setLoading(true)

      if (email) {
        const result = await callGlobal.patch(
          globalApiPath.all.path.verifyMail,
          JSON.stringify({
            email: email,
            ref: refCode,
            otp: values.otp,
          }),
        )

        if (result.status === 200) {
          localStorage.removeItem(globalConfig.localStorage.sentEmailToOtp)

          router.push('/auth/signup/complete')
        }
      } else {
        setError('Something went wrong Please refresh page')
      }
    } catch (error) {
      const err = customServiceError(error)

      if (err) {
        setError(err.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  const onOtpToEmail = async (emailDecode?: string) => {
    try {
      setLoading(true)

      if (email || emailDecode) {
        const result = await callGlobal.post(
          globalApiPath.all.path.sendOtp,
          JSON.stringify({
            email: email || emailDecode,
          }),
        )

        if (result.status === 200) {
          setError('')
          setRefCode(result.data.ref)

          // Start countdown
          startCountdown()

          // Show toast message when resend otp
          if (refCode) {
            toast('OTP sent to your email Please check your email')
          }
        }
      } else {
        setError('Email not found')
      }
    } catch (error) {
      const err = customServiceError(error)

      if (err) {
        setError(err.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!email) {
      const tempEmail = localStorage.getItem(
        globalConfig.localStorage.sentEmailToOtp,
      )

      if (tempEmail) {
        const emailDecode = CryptoJS.AES.decrypt(
          tempEmail,
          process.env.NEXT_PUBLIC_TEMP_SECRET_KEY as string,
        ).toString(CryptoJS.enc.Utf8)

        setEmail(emailDecode)
      }
    } else if (email) {
      onOtpToEmail()
    }
  }, [email])

  return {
    email,
    refCode,
    otpLength,
    otpForm,
    onSubmit,
    loading,
    error,
    onOtpToEmail,
  }
}

export default useOtpHook
