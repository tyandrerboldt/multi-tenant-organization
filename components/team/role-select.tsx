"use client"

import { Role } from "@prisma/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLE_TRANSLATIONS, EDITABLE_ROLES } from "@/lib/constants/roles"

interface RoleSelectProps {
  currentRole: Role
  onRoleChange: (role: Role) => void
  disabled?: boolean
}

export function RoleSelect({ currentRole, onRoleChange, disabled }: RoleSelectProps) {
  return (
    <Select
      value={currentRole}
      onValueChange={(value) => onRoleChange(value as Role)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>{ROLE_TRANSLATIONS[currentRole]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {EDITABLE_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_TRANSLATIONS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}