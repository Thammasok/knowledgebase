'use client'

import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import customServiceError from '@/utils/custom-service-error'
import callGlobal from '@/services/global.service'
import { globalApiPath } from '@/configs/service.config'

const requestAccessFormSchema = z.object({
  email: z.email({
    message: 'Email must be a valid email address',
  }),
})

export type TRequestAccessForm = z.infer<typeof requestAccessFormSchema>

const useRequestAccessHook = () => {
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | string[]>('')

  const requestAccessForm = useForm<TRequestAccessForm>({
    resolver: zodResolver(requestAccessFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: TRequestAccessForm) => {
    try {
      setLoading(true)
      setSuccess(false)

      // Remove temp data (email) for send to otp page
      localStorage.removeItem('temp')

      const result = await callGlobal.post(
        globalApiPath.all.path.requestAccess,
        JSON.stringify({
          email: values.email,
        }),
      )

      if (result.status === 201) {
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

  return {
    requestAccessForm,
    onSubmit,
    loading,
    error,
    success,
  }
}

export default useRequestAccessHook
