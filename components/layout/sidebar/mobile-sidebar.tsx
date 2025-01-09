"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarProps } from "./types"
import { useState } from "react"
import { SidebarContent } from "./sidebar-content"

export function MobileSidebar({ organizationSlug }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTitle> </SheetTitle>
      <SheetDescription> </SheetDescription>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="fixed top-2 left-2 lg:hidden"
          size="icon"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <SidebarContent 
          organizationSlug={organizationSlug} 
          onNavigate={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}