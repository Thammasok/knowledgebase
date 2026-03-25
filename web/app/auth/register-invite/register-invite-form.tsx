'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { AlertCircleIcon, CheckIcon, XIcon } from 'lucide-react'
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
import useRegisterInviteHook from './use-register-invite.hook'
import globalConfig from '@/configs/global.config'
import Image from 'next/image'

export function RegisterInviteForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    registerInviteForm,
    onSubmit,
    passwordValidation,
    loading,
    error,
    success,
  } = useRegisterInviteHook()

  const renderPasswordValidation = () => {
    if (passwordValidation.length > 0) {
      return (
        <div className="space-y-2 text-left text-xs text-gray-400">
          {passwordValidation.map((item) => (
            <div key={item.condition} className="flex items-center gap-1">
              {item.isValid ? (
                <CheckIcon size={16} color="green" />
              ) : (
                <XIcon size={16} color="red" />
              )}
              {item.message}
            </div>
          ))}
        </div>
      )
    }
  }

  return success ? (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md">
        <FieldGroup>
          <Field>
            <div className="flex flex-col items-center text-center">
              <Image src="/success.png" alt="success" width={80} height={80} />
            </div>
          </Field>

          <Field>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Congratulations</h1>

              <p className="text-sm text-balance text-muted-foreground">
                Your account has been created You can logged in with your email
                and password
              </p>
            </div>
          </Field>

          <Field className={cn('flex flex-col items-center gap-2')}>
            <FieldDescription className="px-6 text-center">
              {`You can `}
              <Link href="/auth/login">Login</Link> now
            </FieldDescription>
          </Field>
        </FieldGroup>
      </div>
    </div>
  ) : (
    <Form {...registerInviteForm}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={registerInviteForm.handleSubmit(onSubmit)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to create your account
            </p>
          </div>

          <Field>
            <FormField
              control={registerInviteForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input
                      id="displayName"
                      placeholder="Enter your display name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          <Field>
            <FormField
              control={registerInviteForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  {renderPasswordValidation()}
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          <FieldDescription>
            {`By proceeding you agree to ${globalConfig.app.name}'s `}
            <Link href="#" className="btn-link btn-primary">
              Terms of use
            </Link>
            {` and `}
            <Link href="#" className="btn-link btn-primary">
              Privacy policy
            </Link>
          </FieldDescription>

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
              Create an account
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/auth/login">Login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
