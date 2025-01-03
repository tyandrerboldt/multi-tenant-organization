"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateRole } from "@/lib/actions/roles";
import { showToast } from "@/lib/toast";
import { Role } from "@/lib/types/permissions";
import { RoleFormData, roleSchema } from "@/lib/validations/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface PermissionFormProps {
  role: Role;
  organizationId: string;
}

const RESOURCES = [
  {
    name: "Domains",
    value: "domains" as const,
    actions: [
      { name: "View", value: "read" as const },
      { name: "Create", value: "create" as const },
      { name: "Update", value: "update" as const },
      { name: "Delete", value: "delete" as const },
    ],
  },
];

export function PermissionForm({ role, organizationId }: PermissionFormProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role.name,
      permissions: RESOURCES.map((resource) => ({
        resource: resource.value,
        actions:
          role.permissions.find((p) => p.resource === resource.value)
            ?.actions || [],
      })),
    },
  });

  const permissions = watch("permissions");

  const onSubmit = async (data: RoleFormData) => {
    try {
      await updateRole(organizationId, role.id, data);
      showToast("Permissions updated successfully", { variant: "success" });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to update permissions",
        { variant: "error" }
      );
    }
  };

  const toggleAction = (resourceIndex: number, action: string) => {
    const currentActions = permissions[resourceIndex].actions;
    const newActions = currentActions.includes(action)
      ? currentActions.filter((a) => a != action)
      : [...currentActions, action];

    setValue(`permissions.${resourceIndex}.actions`, newActions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {RESOURCES.map((resource, resourceIndex) => (
          <div key={resource.value} className="space-y-2">
            <Label>{resource.name}</Label>
            <div className="grid grid-cols-2 gap-4">
              {resource.actions.map((action) => {
                const isChecked = permissions[resourceIndex].actions.includes(
                  action.value
                );
                return (
                  <div
                    key={action.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`${resource.value}-${action.value}`}
                      checked={isChecked}
                      onCheckedChange={() =>
                        toggleAction(resourceIndex, action.value)
                      }
                    />
                    <Label
                      htmlFor={`${resource.value}-${action.value}`}
                      className="text-sm font-normal"
                    >
                      {action.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
