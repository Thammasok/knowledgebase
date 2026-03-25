'use client'

import Link from 'next/link'
import Image from 'next/image'
import globalConfig from '@/configs/global.config'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'

export default function SignupCompletePage() {
  const router = useRouter()
  const [showManualLogin, setShowManualLogin] = useState(false)

  useEffect(() => {
    const timeoutRedirect = setTimeout(() => {
      router.push('/auth/login')
    }, 5000)

    const timeoutManual = setTimeout(() => {
      setShowManualLogin(true)
    }, 2500)

    return () => {
      clearTimeout(timeoutRedirect)
      clearTimeout(timeoutManual)
    }
  }, [router])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <Image
                src={globalConfig.app.logo}
                alt={globalConfig.app.name}
                width={200}
                height={200}
              />
            </div>
            {globalConfig.app.name}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <FieldGroup>
              <Field>
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="/success.png"
                    alt="success"
                    width={80}
                    height={80}
                  />
                </div>
              </Field>

              <Field>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Congratulations</h1>

                  <p className="text-sm text-balance text-muted-foreground">
                    Your account has been created We will logged you in
                    automatically
                  </p>
                </div>
              </Field>

              <Field
                className={cn(
                  'flex flex-col items-center gap-2 transition duration-300',
                  showManualLogin
                    ? 'visible opacity-100'
                    : 'invisible opacity-0',
                )}
              >
                <FieldDescription className="px-6 text-center">
                  Did we keep you waiting too long. You can go to{' '}
                  <Link href="/auth/login">Login</Link> here
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          width={2070}
          height={1380}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
