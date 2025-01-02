"use client"

import { useState } from "react"
import { Role } from "@/lib/types/permissions"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Trash2, RotateCcw } from "lucide-react"
import { PermissionForm } from "./permission-form"
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
import { deleteRole, resetRolePermissions } from "@/lib/actions/roles"

interface RoleItemProps {
  role: Role
  organizationId: string
  isExpanded: boolean
  onToggle: () => void
}

export function RoleItem({
  role,
  organizationId,
  isExpanded,
  onToggle,
}: RoleItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteRole(organizationId, role.id)
    } catch (error) {
      console.error("Failed to delete role:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleReset = async () => {
    try {
      setIsResetting(true)
      await resetRolePermissions(organizationId, role.id)
    } catch (error) {
      console.error("Failed to reset permissions:", error)
    } finally {
      setIsResetting(false)
      setShowResetDialog(false)
    }
  }

  return (
    <div className="border rounded-lg">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">{role.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetDialog(true)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <PermissionForm
            role={role}
            organizationId={organizationId}
          />
        </div>
      )}

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Função</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta função? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir Permissões</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja redefinir as permissões desta função? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? "Redefinindo..." : "Redefinir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}