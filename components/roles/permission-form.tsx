"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Role } from "@/lib/types/permissions"
import { RoleFormData, roleSchema } from "@/lib/validations/roles"
import { updateRole } from "@/lib/actions/roles"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface PermissionFormProps {
  role: Role
  organizationId: string
}

const RESOURCES = [
  {
    name: "Domínios",
    value: "domains" as const,
    actions: [
      { name: "Visualizar", value: "read" as const },
      { name: "Criar", value: "create" as const },
      { name: "Atualizar", value: "update" as const },
      { name: "Excluir", value: "delete" as const },
    ],
  },
]

export function PermissionForm({ role, organizationId }: PermissionFormProps) {
  const [error, setError] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role.name,
      permissions: RESOURCES.map(resource => ({
        resource: resource.value,
        actions: role.permissions
          .find(p => p.resource === resource.value)
          ?.actions || [],
      })),
    },
  })

  const permissions = watch("permissions")

  const onSubmit = async (data: RoleFormData) => {
    try {
      setError("")
      setIsSaved(false)
      await updateRole(organizationId, role.id, data)
      setIsSaved(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Algo deu errado")
    }
  }

  const toggleAction = (resourceIndex: number, action: string) => {
    const currentActions = permissions[resourceIndex].actions
    const newActions = currentActions.includes(action)
      ? currentActions.filter(a => a !== action)
      : [...currentActions, action]

    setValue(`permissions.${resourceIndex}.actions`, newActions)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="destructive">{error}</Alert>}
      {isSaved && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          Permissões atualizadas com sucesso
        </Alert>
      )}

      <div className="space-y-4">
        {RESOURCES.map((resource, resourceIndex) => (
          <div key={resource.value} className="space-y-2">
            <Label>{resource.name}</Label>
            <div className="grid grid-cols-2 gap-4">
              {resource.actions.map((action) => {
                const isChecked = permissions[resourceIndex].actions.includes(action.value)
                return (
                  <div key={action.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${resource.value}-${action.value}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleAction(resourceIndex, action.value)}
                    />
                    <Label
                      htmlFor={`${resource.value}-${action.value}`}
                      className="text-sm font-normal"
                    >
                      {action.name}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  )
}