import { LucideIcon } from "lucide-react"
import { Resource } from "@/lib/types/permissions"

export interface MenuItem {
  label: string
  icon: LucideIcon
  href?: string
  submenu?: MenuItem[]
  onClick?: () => void
  resource?: Resource
}

export interface SidebarProps {
  organizationSlug?: string
}