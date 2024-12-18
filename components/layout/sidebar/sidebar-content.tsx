"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher"
import { MenuItem, SidebarProps } from "./types"
import { MenuContent } from "./menu-content"
import { createMenuItems } from "./menu-items"
import { cn } from "@/lib/utils"

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const routes = createMenuItems(organizationSlug)

  // Função para encontrar o menu pai com base na URL atual
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

  // Configura o estado inicial após a montagem do componente
  useEffect(() => {
    const parentMenu = findParentMenu(pathname)
    setActiveMenu(parentMenu)
    setMounted(true)
  }, [pathname])

  const handleMenuSelect = (item: MenuItem) => {
    if (item.submenu) {
      setActiveMenu(item.label)
    } else if (item.href) {
      router.push(item.href)
      onNavigate?.()
    }
  }

  const handleBack = () => {
    setActiveMenu(null)
  }

  if (!mounted) {
    return null // Evita renderização durante SSR
  }

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="px-3 py-2">
        <OrganizationSwitcher currentOrganizationSlug={organizationSlug} />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0">
          <MenuContent
            items={routes}
            activeMenu={activeMenu}
            onMenuSelect={handleMenuSelect}
            onBack={handleBack}
            className={cn(
              "transition-transform duration-300 ease-in-out",
              activeMenu ? "translate-x-0" : "-translate-x-full"
            )}
          />
          <MenuContent
            items={routes}
            activeMenu={null}
            onMenuSelect={handleMenuSelect}
            onBack={handleBack}
            className={cn(
              "absolute inset-0 transition-transform duration-300 ease-in-out",
              activeMenu ? "translate-x-full" : "translate-x-0"
            )}
          />
        </div>
      </div>
    </div>
  )
}