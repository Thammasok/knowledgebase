'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
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
import useRequestAccessHook from './use-request-access.hook'
import Link from 'next/link'
import Image from 'next/image'

export function OTPForm({ className, ...props }: React.ComponentProps<'form'>) {
  const { requestAccessForm, onSubmit, loading, error, success } =
    useRequestAccessHook()

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
              <h1 className="text-2xl font-bold">
                Request access successfully
              </h1>

              <p className="text-sm text-balance text-muted-foreground">
                We recieved your request We will consider inviting you
              </p>
            </div>
          </Field>

          <Field className={cn('flex flex-col items-center gap-2')}>
            <FieldDescription className="px-6 text-center">
              {`Back to `}
              <Link href="/">Home</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </div>
    </div>
  ) : (
    <Form {...requestAccessForm}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={requestAccessForm.handleSubmit(onSubmit)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Request Access</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Please enter your email address to request access
            </p>
          </div>

          <Field>
            <FormField
              control={requestAccessForm.control}
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
              Request Access
            </Button>
          </Field>

          <Field>
            <FieldDescription className="px-6 text-center">
              Back to <Link href="/">Home</Link> or{' '}
              <Link href="/auth/login">Login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
