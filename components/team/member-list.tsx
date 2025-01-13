"use client"

import { useState } from "react"
import { Role as SystemRole } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { removeMember, assignRole } from "@/lib/actions/team"
import { UserX } from "lucide-react"
import { RoleSelect } from "./role-select"
import { Role } from "@/lib/types/permissions"
import { usePermissions } from "@/lib/hooks/use-permissions"

interface Member {
  id: string
  role: SystemRole
  roleId: string | null
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface MemberListProps {
  organizationId: string
  members: Member[]
  customRoles: Role[]
  currentUserId: string
  isOwner: boolean
}

export function MemberList({
  organizationId,
  members,
  customRoles,
  currentUserId,
  isOwner,
}: MemberListProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { checkPermission } = usePermissions()

  // Se for OWNER, tem todas as permissões
  const canUpdate = isOwner || checkPermission("team", "update")
  const canDelete = isOwner || checkPermission("team", "delete")

  const handleRemoveMember = async () => {
    if (!selectedMemberId) return

    try {
      setIsRemoving(true)
      await removeMember(organizationId, selectedMemberId)
    } catch (error) {
      console.error("Falha ao remover membro:", error)
    } finally {
      setIsRemoving(false)
      setSelectedMemberId(null)
    }
  }

  const handleRoleChange = async (memberId: string, roleId: string | null) => {
    try {
      setIsUpdating(true)
      await assignRole(organizationId, memberId, roleId)
    } catch (error) {
      console.error("Falha ao atualizar função do membro:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Mobile view - Cards
  const MobileView = () => (
    <div className="grid grid-cols-1 gap-4">
      {members.map((member) => (
        <div key={member.id} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback>
                  {member.user.name?.[0] ?? member.user.email?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.user.name}</div>
                <div className="text-sm text-gray-500">{member.user.email}</div>
              </div>
            </div>
            {member.role !== SystemRole.OWNER &&
              member.user.id !== currentUserId &&
              canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMemberId(member.id)}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              )}
          </div>
          {member.role !== SystemRole.OWNER && canUpdate && (
            <div className="mt-4">
              <RoleSelect
                roles={customRoles}
                currentRoleId={member.roleId}
                onRoleChange={(roleId) => handleRoleChange(member.id, roleId)}
                disabled={isUpdating || member.user.id === currentUserId}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // Desktop view - Table
  const DesktopView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Membro</TableHead>
          <TableHead>Função</TableHead>
          {(canUpdate || canDelete) && (
            <TableHead className="text-right">Ações</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback>
                    {member.user.name?.[0] ?? member.user.email?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium truncate">{member.user.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {member.user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {member.role !== SystemRole.OWNER && canUpdate && (
                <RoleSelect
                  roles={customRoles}
                  currentRoleId={member.roleId}
                  onRoleChange={(roleId) => handleRoleChange(member.id, roleId)}
                  disabled={isUpdating || member.user.id === currentUserId}
                />
              )}
            </TableCell>
            {(canUpdate || canDelete) && (
              <TableCell className="text-right">
                {member.role !== SystemRole.OWNER &&
                  member.user.id !== currentUserId &&
                  canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMemberId(member.id)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <>
      <div className="block md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>

      <AlertDialog
        open={!!selectedMemberId}
        onOpenChange={() => setSelectedMemberId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este membro? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} disabled={isRemoving}>
              {isRemoving ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}