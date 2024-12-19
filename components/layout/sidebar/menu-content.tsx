"use client"

import { usePathname } from "next/navigation"
import { MenuItem } from "./types"
import { MenuButton } from "./menu-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuContentProps {
  items: MenuItem[]
  activeMenu: string | null
  onMenuSelect: (item: MenuItem) => void
  onBack: () => void
  className?: string
  isMain?: boolean
}

export function MenuContent({ 
  items, 
  activeMenu, 
  onMenuSelect, 
  onBack,
  className,
  isMain = false
}: MenuContentProps) {
  const pathname = usePathname()

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (item.href === pathname) return true
    if (item.submenu) {
      return item.submenu.some(subItem => subItem.href === pathname)
    }
    return false
  }

  const activeMenuData = items.find((item) => item.label === activeMenu)

  return (
    <div className={cn(
      "absolute inset-0 px-3 transition-all duration-300 ease-in-out",
      className,
      isMain ? (
        activeMenu ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
      ) : (
        activeMenu ? "translate-x-0 opacity-100 delay-150" : "translate-x-full opacity-0"
      )
    )}>
      {!isMain ? (
        <div className={cn(
          "space-y-4 transition-all duration-300",
          activeMenu ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold">{activeMenu}</h2>
          </div>
          <div className="space-y-1">
            {activeMenuData?.submenu?.map((item) => (
              <MenuButton
                key={item.label}
                item={item}
                isActive={pathname === item.href}
                onClick={() => onMenuSelect(item)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={cn(
          "space-y-1 transition-all duration-300",
          !activeMenu ? "opacity-100" : "opacity-0"
        )}>
          {items.map((item) => (
            <MenuButton
              key={item.label}
              item={item}
              isActive={isMenuItemActive(item)}
              onClick={() => onMenuSelect(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}