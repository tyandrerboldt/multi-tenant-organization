"use client"

import { useState } from "react"
import { Role } from "@/lib/types/permissions"
import { RoleItem } from "./role-item"

interface RoleListProps {
  roles: Role[]
  organizationId: string
}

export function RoleList({ roles, organizationId }: RoleListProps) {
  const [expandedRole, setExpandedRole] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <RoleItem
          key={role.id}
          role={role}
          organizationId={organizationId}
          isExpanded={expandedRole === role.id}
          onToggle={() => setExpandedRole(
            expandedRole === role.id ? null : role.id
          )}
        />
      ))}

      {roles.length === 0 && (
        <p className="text-center text-gray-500">
          Nenhuma função criada ainda
        </p>
      )}
    </div>
  )
}