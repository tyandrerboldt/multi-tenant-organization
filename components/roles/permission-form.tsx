"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
    name: "Domínios",
    value: "domains" as const,
    actions: [
      { name: "Visualizar", value: "read" as const },
      { name: "Criar", value: "create" as const },
      { name: "Atualizar", value: "update" as const },
      { name: "Remover", value: "delete" as const },
    ],
  },
  {
    name: "Equipe",
    value: "team" as const,
    actions: [
      { name: "Visualizar", value: "read" as const },
      { name: "Criar", value: "create" as const },
      { name: "Atualizar", value: "update" as const },
      { name: "Remover", value: "delete" as const },
    ],
  },
  {
    name: "Configurações",
    value: "settings" as const,
    actions: [
      { name: "Visualizar", value: "read" as const },
      { name: "Criar", value: "create" as const },
      { name: "Atualizar", value: "update" as const },
      { name: "Remover", value: "delete" as const },
    ],
  },
  {
    name: "Imóveis",
    value: "property" as const,
    actions: [
      { name: "Captar", value: "capture" as const },
      { name: "Visualizar", value: "read" as const },
      { name: "Criar", value: "create" as const },
      { name: "Atualizar", value: "update" as const },
      { name: "Remover", value: "delete" as const },
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
          role.permissions.find((p) => p.resource == resource.value)
            ?.actions || [],
      })),
    },
  });

  const permissions = watch("permissions");

  const onSubmit = async (data: RoleFormData) => {
    try {
      await updateRole(organizationId, role.id, data);
      showToast("Permissões atualizadas com sucesso", { variant: "success" });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao atualizar permissões",
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

  const toggleAllActions = (resourceIndex: number) => {
    const resource = RESOURCES[resourceIndex];
    const currentActions = permissions[resourceIndex].actions;
    const allActions = resource.actions.map((a) => a.value);

    // Se todas as ações estiverem selecionadas, desmarque todas. Caso contrário, selecione todas.
    const newActions =
      currentActions.length === allActions.length ? [] : allActions;

    setValue(`permissions.${resourceIndex}.actions`, newActions);
  };

  const isAllSelected = (resourceIndex: number) => {
    const resource = RESOURCES[resourceIndex];
    const currentActions = permissions[resourceIndex].actions;
    return resource.actions.length === currentActions.length;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {RESOURCES.map((resource, resourceIndex) => (
          <Card key={resource.value} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">{resource.name}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllActions(resourceIndex)}
                >
                  {isAllSelected(resourceIndex)
                    ? "Desmarcar todos"
                    : "Marcar todos"}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {resource.actions.map((action) => {
                  const isChecked = permissions[resourceIndex].actions.includes(
                    action.value
                  );
                  return (
                    <div
                      key={action.value}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
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
                        className="text-sm font-normal cursor-pointer"
                      >
                        {action.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
