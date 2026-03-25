import Image from 'next/image'
import Link from 'next/link'
import globalConfig from '@/configs/global.config'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const Logo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Image
                src={globalConfig.app.logo}
                alt={globalConfig.app.name}
                width={24}
                height={24}
              />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">{globalConfig.app.logoName}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default Logo
