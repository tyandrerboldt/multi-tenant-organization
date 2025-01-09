"use client"

import { Role } from "@/lib/types/permissions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RoleSelectProps {
  roles: Role[]
  currentRoleId?: string | null
  onRoleChange: (roleId: string | null) => void
  disabled?: boolean
}

export function RoleSelect({
  roles,
  currentRoleId,
  onRoleChange,
  disabled
}: RoleSelectProps) {
  return (
    <Select
      value={currentRoleId || ""}
      onValueChange={(value) => onRoleChange(value || null)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full md:max-w-[200px]">
        <SelectValue>
          {currentRoleId
            ? roles.find((role) => role.id == currentRoleId)?.name
            : "Selecionar função"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NOTTING">Nenhuma função</SelectItem>
        {roles?.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
