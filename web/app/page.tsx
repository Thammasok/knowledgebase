'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import useSession from '@/hooks/use-session.hook'
import globalConfig from '@/configs/global.config'

export default function Home() {
  const { session } = useSession()
  const [isChangeBg, setIsChangeBg] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsChangeBg(true)
      } else {
        setIsChangeBg(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div>
      <div
        className={cn(
          'fixed top-0 z-10 px-6 py-3 w-full flex flex-row justify-between',
          isChangeBg && 'bg-base-50 shadow-sm backdrop-blur-md',
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-100"
          >
            <Image
              src={globalConfig.app.logo}
              alt={globalConfig.app.name}
              width={32}
              height={32}
            />
            {globalConfig.app.logoName}
          </Link>
          <div className="flex flex-row gap-2">
            {session?.token.accessToken ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: 'sm' }))}
              >
                Go to App
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(buttonVariants({ size: 'sm' }))}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'outline' }),
                  )}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'bg-base-200 min-h-screen rounded-b-lg bg-cover bg-center bg-no-repeat',
          `bg-[url('https://images.unsplash.com/photo-1531256379416-9f000e90aacc?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] `,
        )}
      >
        <div className="flex justify-center items-center align-middle h-screen text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl leading-14 font-bold text-gray-800">
              Welcome to {globalConfig.app.name}
            </h1>
            <p className="py-6 text-gray-600">{globalConfig.app.description}</p>
            <Link
              href="/auth/request-access"
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <footer className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-base-200 text-base-content p-10">
        <aside>
          <Image
            src={globalConfig.app.logo}
            alt={globalConfig.app.name}
            width={64}
            height={64}
          />
          <p className="text-lg font-semibold">{globalConfig.app.logoName}</p>
          <p className="text-sm text-muted">
            Provide by Digital Village & Innovation Co.,Ltd.
          </p>
        </aside>
        <nav className="flex flex-col gap-1">
          <h6 className="text-lg font-semibold">Services</h6>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Financial Planning
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Tax Planning
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Investments
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            CRM Tools
          </Link>
        </nav>
        <nav className="flex flex-col gap-1">
          <h6 className="text-lg font-semibold">Company</h6>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            About us
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Contact
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Jobs
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Press kit
          </Link>
        </nav>
        <nav className="flex flex-col gap-1">
          <h6 className="text-lg font-semibold">Legal</h6>
          <Link href="/terms" className="text-sm hover:underline text-gray-500">
            Terms of use
          </Link>
          <Link
            href="/privacy"
            className="text-sm hover:underline text-gray-500"
          >
            Privacy policy
          </Link>
          <Link href="#" className="text-sm hover:underline text-gray-500">
            Cookie policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
