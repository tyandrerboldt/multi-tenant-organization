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
}

export function MenuContent({ 
  items, 
  activeMenu, 
  onMenuSelect, 
  onBack,
  className 
}: MenuContentProps) {
  const pathname = usePathname()
  const activeMenuData = items.find((item) => item.label === activeMenu)

  return (
    <div className={cn("space-y-1", className)}>
      {activeMenu ? (
        <div className="space-y-4">
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
        items.map((item) => (
          <MenuButton
            key={item.label}
            item={item}
            isActive={pathname === item.href}
            onClick={() => onMenuSelect(item)}
          />
        ))
      )}
    </div>
  )
}