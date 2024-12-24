"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher"
import { UserMenu } from "@/components/user/user-menu"
import { MenuItem, SidebarProps } from "./types"
import { MenuContent } from "./menu-content"
import { createMenuItems } from "./menu-items"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface SidebarContentProps extends SidebarProps {
  className?: string
  onNavigate?: () => void
}

export function SidebarContent({ 
  organizationSlug, 
  className,
  onNavigate 
}: SidebarContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const routes = createMenuItems(organizationSlug)

  const findParentMenu = (path: string) => {
    for (const route of routes) {
      if (route.submenu) {
        const hasActiveChild = route.submenu.some(
          submenu => submenu.href === path
        )
        if (hasActiveChild) {
          return route.label
        }
      }
    }
    return null
  }

  useEffect(() => {
    const parentMenu = findParentMenu(pathname)
    setActiveMenu(parentMenu)
  }, [pathname])

  const handleMenuSelect = (item: MenuItem) => {
    if (item.submenu) {
      setIsTransitioning(true)
      setActiveMenu(item.label)
      setTimeout(() => setIsTransitioning(false), 450)
    } else if (item.href) {
      router.push(item.href)
      onNavigate?.()
    }
  }

  const handleBack = () => {
    setIsTransitioning(true)
    setActiveMenu(null)
    setTimeout(() => setIsTransitioning(false), 450)
  }

  if (!session?.user) return null

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="px-3 py-2 flex items-center gap-2 justify-between">
        <OrganizationSwitcher currentOrganizationSlug={organizationSlug} />
        <UserMenu user={session.user} />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <MenuContent
          items={routes}
          activeMenu={activeMenu}
          onMenuSelect={handleMenuSelect}
          onBack={handleBack}
          isMain={true}
          className={cn(isTransitioning && "pointer-events-none")}
        />
        <MenuContent
          items={routes}
          activeMenu={activeMenu}
          onMenuSelect={handleMenuSelect}
          onBack={handleBack}
          className={cn(isTransitioning && "pointer-events-none")}
        />
      </div>
    </div>
  )
}