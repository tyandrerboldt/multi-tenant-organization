"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const routes = createMenuItems(organizationSlug)

  const handleMenuSelect = (item: MenuItem) => {
    if (item.submenu) {
      setIsTransitioning(true)
      setActiveMenu(item.label)
    } else if (item.href) {
      router.push(item.href)
      onNavigate?.()
    }
  }

  const handleBack = () => {
    setIsTransitioning(true)
    setActiveMenu(null)
  }

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="px-3 py-2">
        <OrganizationSwitcher currentOrganizationSlug={organizationSlug} />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <MenuContent
          items={routes}
          activeMenu={activeMenu}
          onMenuSelect={handleMenuSelect}
          onBack={handleBack}
          className={cn(
            "absolute inset-0 transition-transform duration-300 ease-in-out",
            isTransitioning && (activeMenu
              ? "translate-x-0"
              : "translate-x-full"
            ),
            !isTransitioning && !activeMenu && "-translate-x-full"
          )}
        />
        <MenuContent
          items={routes}
          activeMenu={null}
          onMenuSelect={handleMenuSelect}
          onBack={handleBack}
          className={cn(
            "absolute inset-0 transition-transform duration-300 ease-in-out",
            isTransitioning && (activeMenu
              ? "-translate-x-full"
              : "translate-x-0"
            ),
            !isTransitioning && !activeMenu && "translate-x-0"
          )}
        />
      </div>
    </div>
  )
}