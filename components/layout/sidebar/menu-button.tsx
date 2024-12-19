"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MenuItem } from "./types"

interface MenuButtonProps {
  item: MenuItem
  isActive: boolean
  onClick: () => void
}

export function MenuButton({ item, isActive, onClick }: MenuButtonProps) {
  const handleClick = () => {
    if (item.onClick) {
      item.onClick()
    } else {
      onClick()
    }
  }

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        isActive && "bg-secondary"
      )}
      onClick={handleClick}
    >
      <item.icon className="mr-2 h-4 w-4" />
      {item.label}
    </Button>
  )
}