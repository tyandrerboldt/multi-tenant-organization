"use client"

import {
  LayoutDashboard,
  Settings,
  Users,
  Globe,
  Home
} from "lucide-react"
import { MenuItem } from "./types"

export const createMenuItems = (organizationSlug: string): MenuItem[] => [
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
    ],
  },
]