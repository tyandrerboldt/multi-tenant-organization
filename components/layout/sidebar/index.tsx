"use client";

import { MobileSidebar } from "./mobile-sidebar";
import { SidebarContent } from "./sidebar-content";

export function Sidebar({ organizationSlug }: SidebarProps) {
  return (
    <>
      <MobileSidebar organizationSlug={organizationSlug} />
      <div className="hidden lg:block w-64 border-r bg-gray-50/50">
        <SidebarContent organizationSlug={organizationSlug} />
      </div>
    </>
  );
}
