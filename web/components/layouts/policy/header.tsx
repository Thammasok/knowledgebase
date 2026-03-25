import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import globalConfig from '@/configs/global.config'


const PolicyHeader = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src={globalConfig.app.logo}
            alt={globalConfig.app.name}
            width={28}
            height={28}
          />
          {globalConfig.app.name}
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2" /> Back to home
        </Link>
      </div>
    </header>
  )
}

export default PolicyHeader
