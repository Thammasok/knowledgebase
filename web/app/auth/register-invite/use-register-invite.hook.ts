'use client'

import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import customServiceError from '@/utils/custom-service-error'
import callGlobal from '@/services/global.service'
import { IPasswordCheck, validatePassword } from '@/utils/validate'
import { globalApiPath } from '@/configs/service.config'

const registerInviteFormSchema = z.object({
  requestId: z.string(),
  displayName: z
    .string()
    .min(3, {
      message: 'Display name must be at least 3 characters',
    })
    .max(50, {
      message: 'Display name must be at most 50 characters',
    }),
  password: z
    .string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,64}$/, {
      message:
        'Password must contain 8 characters one uppercase one lowercase one number and one special case character',
    }),
})

export type TRegisterInviteForm = z.infer<typeof registerInviteFormSchema>

const useRegisterInviteHook = () => {
  const searchParams = useSearchParams()

  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | string[]>('')
  const [passwordValidation, setPasswordValidation] = useState<
    IPasswordCheck[]
  >([])

  const registerInviteForm = useForm<TRegisterInviteForm>({
    resolver: zodResolver(registerInviteFormSchema),
    defaultValues: {
      requestId: '',
      displayName: '',
      password: '',
    },
  })

  const onSubmit = async (values: TRegisterInviteForm) => {
    try {
      setLoading(true)
      setSuccess(false)

      const result = await callGlobal.post(
        globalApiPath.all.path.registerInvite,
        JSON.stringify({
          requestId: values.requestId,
          displayName: values.displayName,
          password: values.password,
        }),
      )

      if (result.status === 201) {
        // Reset error message
        setError('')
        setSuccess(true)
      }
    } catch (error) {
      const err = customServiceError(error)

      if (err) {
        setError(err?.message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  const password = registerInviteForm.watch('password')
  useEffect(() => {
    if (password) {
      const { checks } = validatePassword(password)
      setPasswordValidation(checks)
    } else {
      setPasswordValidation([])
    }
  }, [password])

  useEffect(() => {
    const requestId = searchParams.get('rid')

    if (requestId) {
      registerInviteForm.setValue('requestId', requestId)
    }
  }, [searchParams, registerInviteForm])

  return {
    registerInviteForm,
    onSubmit,
    loading,
    error,
    success,
    passwordValidation,
  }
}

export default useRegisterInviteHook
