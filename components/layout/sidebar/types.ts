import { LucideIcon } from "lucide-react"

export interface MenuItem {
  label: string
  icon: LucideIcon
  href?: string
  submenu?: MenuItem[]
  onClick?: () => void
}

export interface SidebarProps {
  organizationSlug: string
}