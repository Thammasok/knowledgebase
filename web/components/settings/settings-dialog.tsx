'use client'

import { useState } from 'react'
import {
  BellIcon,
  CheckIcon,
  GlobeIcon,
  HomeIcon,
  KeyboardIcon,
  LinkIcon,
  LockIcon,
  MenuIcon,
  MessageCircleIcon,
  PaintbrushIcon,
  SettingsIcon,
  UserIcon,
  VideoIcon,
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { useAccountProfileHook } from '@/components/settings/use-account-profile.hook'

const data = {
  nav: [
    { name: 'Account', icon: UserIcon },
    { name: 'Notifications', icon: BellIcon },
    { name: 'Navigation', icon: MenuIcon },
    { name: 'Home', icon: HomeIcon },
    { name: 'Appearance', icon: PaintbrushIcon },
    { name: 'Messages & media', icon: MessageCircleIcon },
    { name: 'Language & region', icon: GlobeIcon },
    { name: 'Accessibility', icon: KeyboardIcon },
    { name: 'Mark as read', icon: CheckIcon },
    { name: 'Audio & video', icon: VideoIcon },
    { name: 'Connected accounts', icon: LinkIcon },
    { name: 'Privacy & visibility', icon: LockIcon },
    { name: 'Advanced', icon: SettingsIcon },
  ],
}

interface DialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

function AccountContent() {
  const { form, email, loading, submitting, onSubmit } = useAccountProfileHook()

  if (loading) {
    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl space-y-4"
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label className="opacity-60">Email</Label>
          <Input
            value={email}
            disabled
            className="cursor-not-allowed opacity-60"
          />
        </div>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </Form>
  )
}

export function SettingsDialog({ open, setOpen }: DialogProps) {
  const [activeItem, setActiveItem] = useState('Account')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-125 md:max-w-175 lg:max-w-200">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === activeItem}
                        >
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveItem(item.name)
                            }}
                          >
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-120 flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeItem}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activeItem === 'Account' ? (
                <AccountContent />
              ) : (
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video max-w-3xl rounded-xl bg-muted/50"
                  />
                ))
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
