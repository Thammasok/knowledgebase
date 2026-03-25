'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input, PasswordInput } from '@/components/ui/input'
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
import { toggleConfig } from '@/configs/toggle.config'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import globalConfig from '@/configs/global.config'
import useSignupHook from './use-signup-hook'

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { signupForm, onSubmit, passwordValidation, loading, error } =
    useSignupHook()

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

  return (
    <Form {...signupForm}>
      <form
        className={cn('flex flex-col gap-2', className)}
        onSubmit={signupForm.handleSubmit(onSubmit)}
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
              control={signupForm.control}
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
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Enter your email address"
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
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
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
            <Link
              href="/terms"
              target="_blank"
              className="btn-link btn-primary"
            >
              Terms of use
            </Link>
            {` and `}
            <Link
              href="/privacy"
              target="_blank"
              className="btn-link btn-primary"
            >
              Privacy policy
            </Link>
            {` of ${globalConfig.app.name}`}
          </FieldDescription>

          {error && (
            <Field>
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </Field>
          )}

          <Field>
            <Button type="submit" disabled={loading}>
              {loading ?? <Spinner />}
              Create Account
            </Button>
          </Field>

          {toggleConfig.signupWithSocials && (
            <OAuthButtons title="Or continue with" />
          )}

          <Field>
            {/* <OAuthButtons /> */}
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/auth/login">Login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
