"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteRole, updateRole } from "@/lib/actions/roles";
import { showToast } from "@/lib/toast";
import { Role } from "@/lib/types/permissions";
import { Check, ChevronDown, ChevronUp, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { PermissionForm } from "./permission-form";

interface RoleItemProps {
  role: Role;
  organizationId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RoleItem({
  role,
  organizationId,
  isExpanded,
  onToggle,
}: RoleItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(role.name);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteRole(organizationId, role.id);
      showToast("Role deleted successfully", { variant: "success" });
    } catch (error) {
      showToast("Failed to delete role", { variant: "error" });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleUpdateName = async () => {
    if (newName.trim() === "") {
      showToast("Role name cannot be empty", { variant: "error" });
      return;
    }

    try {
      await updateRole(organizationId, role.id, {
        name: newName,
        permissions: role.permissions,
      });
      showToast("Role name updated successfully", { variant: "success" });
      setIsEditing(false);
    } catch (error) {
      showToast("Failed to update role name", { variant: "error" });
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8"
                autoFocus
              />
              <Button variant="ghost" size="sm" onClick={handleUpdateName}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setNewName(role.name);
                }}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-medium">{role.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle}>
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
          <PermissionForm role={role} organizationId={organizationId} />
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
