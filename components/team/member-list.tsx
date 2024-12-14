"use client"

import { useState } from "react"
import { Role } from "@prisma/client"
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
import { removeMember } from "@/lib/actions/team"
import { UserX } from "lucide-react"

interface Member {
  id: string
  role: Role
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
  currentUserId: string
  onMemberRemoved?: () => void
}

export function MemberList({ 
  organizationId, 
  members, 
  currentUserId,
  onMemberRemoved 
}: MemberListProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  const handleRemoveMember = async () => {
    if (!selectedMemberId) return

    try {
      setIsRemoving(true)
      await removeMember(organizationId, selectedMemberId)
      onMemberRemoved?.()
    } catch (error) {
      console.error("Failed to remove member:", error)
    } finally {
      setIsRemoving(false)
      setSelectedMemberId(null)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback>
                    {member.user.name?.[0] ?? member.user.email?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.user.name}</div>
                  <div className="text-sm text-gray-500">{member.user.email}</div>
                </div>
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                {member.role !== Role.OWNER && member.user.id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog 
        open={!!selectedMemberId} 
        onOpenChange={() => setSelectedMemberId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}