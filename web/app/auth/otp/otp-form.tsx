'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { AlertCircleIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import useCountdown from '@/hooks/use-countdown.hook'
import useOtpHook from './use-otp.hook'

export function OTPForm({ className, ...props }: React.ComponentProps<'form'>) {
  const { seconds, isActive, start, formatTime } = useCountdown({
    initialSeconds: 60,
  })

  const {
    otpLength,
    email,
    refCode,
    otpForm,
    onSubmit,
    onOtpToEmail,
    error,
    loading,
  } = useOtpHook({
    startCountdown: start,
  })

  const getButtonText = () => {
    if (loading) return 'Sending...'
    if (isActive) return `Resend in ${formatTime(seconds)}`
    return 'Resend again'
  }

  const isDisabled = isActive || loading

  const getButtonClass = () => {
    const baseClass = `transition-all duration-200`

    if (isDisabled) {
      return `${baseClass} text-gray-500 cursor-not-allowed`
    }

    return `${baseClass} cursor-pointer text-primary-600 dark:text-primary-500 cursor-pointer hover:underline`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const length = inputValue.length

    if (/^\d*$/.test(inputValue)) {
      if (length <= otpLength) {
        otpForm.setValue('otp', inputValue)
      }
    }
  }

  return (
    <Form {...otpForm}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={otpForm.handleSubmit(onSubmit)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{`Last step Let's finish it`}</h1>
            <p className="text-sm text-balance text-muted-foreground">
              We created an account for you check your email to verify
            </p>
          </div>
          <Field>
            <div className="my-4 text-center">
              <span className="text-base">{email}</span>
            </div>
          </Field>
          <Field>
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {refCode
                      ? `Verification Code (${refCode})`
                      : 'Verification Code'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="s"
                      autoSave="off"
                      type="text"
                      placeholder="Enter OTP"
                      {...field}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          <Field>
            <div className="flex flex-col items-center justify-center gap-1 text-sm">
              <div className="text-gray-500">If you not found email</div>

              <button
                onClick={() => onOtpToEmail()}
                disabled={isDisabled}
                className={getButtonClass()}
              >
                {getButtonText()}
              </button>
            </div>
          </Field>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Field>
            <Button type="submit" disabled={loading}>
              {loading ?? <Spinner />}
              Verify Your Email
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
