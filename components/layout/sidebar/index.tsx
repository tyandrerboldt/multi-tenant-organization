"use client"

import { SidebarContent } from "./sidebar-content"
import { MobileSidebar } from "./mobile-sidebar"
import { SidebarProps } from "./types"

export function Sidebar({ organizationSlug }: SidebarProps) {
  return (
    <>
      <MobileSidebar organizationSlug={organizationSlug} />
      <div className="hidden lg:block w-64 border-r bg-card">
        <SidebarContent organizationSlug={organizationSlug} />
      </div>
    </>
  )
}