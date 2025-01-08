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
import { RoleFormData, roleSchema } from "@/lib/validations/roles"
import { createRole } from "@/lib/actions/roles"
import { showToast } from "@/lib/toast"

interface AddRoleDialogProps {
  organizationId: string
}

export function AddRoleDialog({ organizationId }: AddRoleDialogProps) {
  const [open, setOpen] = useState(false)
  
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
      await createRole(organizationId, data)
      showToast("Função criada com sucesso", { variant: "success" })
      setOpen(false)
      reset()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao criar função",
        { variant: "error" }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        reset()
      }
    }}>
      <DialogTrigger asChild>
        <Button title="Nova função">
          <Plus className="mr-2 h-4 w-4" />
          Função
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Função</DialogTitle>
          <DialogDescription>
            Crie uma nova função para sua organização
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
            placeholder="Insira o nome da função, ex: Marketing"
              id="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
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
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}