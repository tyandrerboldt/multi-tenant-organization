"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert } from "@/components/ui/alert"
import { RoleFormData, roleSchema } from "@/lib/validations/roles"
import { createRole } from "@/lib/actions/roles"

interface AddRoleDialogProps {
  organizationId: string
}

export function AddRoleDialog({ organizationId }: AddRoleDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>("")
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      permissions: [
        {
          resource: "domains",
          actions: [],
        },
      ],
    },
  })

  const onSubmit = async (data: RoleFormData) => {
    try {
      setError("")
      await createRole(organizationId, data)
      setOpen(false)
      reset()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Algo deu errado")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        reset()
        setError("")
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Função
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Função</DialogTitle>
          <DialogDescription>
            Crie uma nova função para sua organização
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Função</Label>
            <Input
              id="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Função"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}