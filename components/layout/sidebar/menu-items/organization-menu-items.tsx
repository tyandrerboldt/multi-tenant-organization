"use client"

import {
  LayoutDashboard,
  Settings,
  Users,
  Globe,
  Home,
  LogOut,
  Shield
} from "lucide-react"
import { MenuItem } from "../types"
import { signOut } from "next-auth/react"

export const createOrganizationMenuItems = (organizationSlug: string): MenuItem[] => [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: `/app/${organizationSlug}`,
  },
  {
    label: "Team",
    icon: Users,
    href: `/app/${organizationSlug}/team`,
  },
  {
    label: "Settings",
    icon: Settings,
    submenu: [
      {
        label: "General",
        icon: Home,
        href: `/app/${organizationSlug}/settings`,
      },
      {
        label: "Domains",
        icon: Globe,
        href: `/app/${organizationSlug}/settings/domains`,
      },
      {
        label: "Roles",
        icon: Shield,
        href: `/app/${organizationSlug}/settings/roles`,
      },
    ],
  },
  {
    label: "Sair",
    icon: LogOut,
    onClick: () => signOut({ callbackUrl: "/login" }),
  },
]