'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApiPath } from '@/configs/service.config'
import callWithAuth from '@/services/auth.service'

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(255),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
})

export type ProfileForm = z.infer<typeof profileSchema>

export function useAccountProfileHook() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '', firstName: '', lastName: '' },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await callWithAuth.get(
          authApiPath.account.path.getAccountProfile,
        )
        const data = res.data
        form.reset({
          displayName: data.displayName ?? '',
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
        })
        setEmail(data.email ?? '')
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [form])

  const onSubmit = async (values: ProfileForm) => {
    setSubmitting(true)
    try {
      await callWithAuth.patch(
        authApiPath.account.path.updateAccountProfile,
        values,
      )
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  return { form, email, loading, submitting, onSubmit }
}
