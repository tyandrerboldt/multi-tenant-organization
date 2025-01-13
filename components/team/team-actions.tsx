"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InviteMemberDialog } from "@/components/team/invite-member-dialog"
import { usePermissions } from "@/lib/hooks/use-permissions"
import { Role } from "@/lib/types/permissions"
import { Plan } from "@prisma/client"

interface TeamActionsProps {
  organizationId: string
  customRoles: Role[]
  plan: Plan
  currentUsage: number
  isOwner: boolean
}

export function TeamActions({
  organizationId,
  customRoles,
  plan,
  currentUsage,
  isOwner,
}: TeamActionsProps) {
  const { checkPermission } = usePermissions()
  const canCreate = isOwner || checkPermission("team", "create")

  if (!canCreate) return null

  return (
    <InviteMemberDialog
      trigger={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar
        </Button>
      }
      organizationId={organizationId}
      customRoles={customRoles}
      plan={plan}
      currentUsage={currentUsage}
    />
  )
}