'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb as BreadcrumbPrimitive,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { BREADCRUMBS } from '@/constants/breadcrumbs.constant'

export const Breadcrumb = () => {
  const currentPath = usePathname()
  const currentBreadcrumb = BREADCRUMBS.find((b) => b.url === currentPath)

  if (!currentBreadcrumb) return null

  return (
    <BreadcrumbPrimitive>
      <BreadcrumbList>
        {currentBreadcrumb.list.map((item, index) => (
          <React.Fragment key={item.name}>
            <BreadcrumbItem>
              {item.url ? (
                <BreadcrumbLink href={item.url}>{item.name}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < currentBreadcrumb.list.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  )
}
