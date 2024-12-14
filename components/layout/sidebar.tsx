"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher"
import {
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"

interface SidebarProps {
  organization?: {
    id: string
    name: string
    slug: string
  }
}

export function Sidebar({ organization }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/app/${organization?.slug}`,
    },
    {
      label: "Team",
      icon: Users,
      href: `/app/${organization?.slug}/team`,
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/app/${organization?.slug}/settings`,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="px-3 py-2">
        <OrganizationSwitcher currentOrganization={organization} />
      </div>
      <div className="flex-1 space-y-1 px-3">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={pathname === route.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === route.href && "bg-secondary"
            )}
            asChild
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}