"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { inviteMember } from "@/lib/actions/team"
import { Plan } from "@prisma/client"
import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal"
import { showToast } from "@/lib/toast"
import { usePlanRestrictions } from "@/lib/plans/hooks/use-plan-restriction"
import { Role } from "@/lib/types/permissions"
import { RoleSelect } from "./role-select"

interface InviteMemberDialogProps {
  trigger: React.ReactNode
  organizationId: string
  customRoles: Role[]
  plan: Plan
  currentUsage: number
}

export function InviteMemberDialog({
  trigger,
  organizationId,
  customRoles,
  plan,
  currentUsage,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isUpgradeModalOpen, setIsUpgradeModalOpen, checkAndEnforceLimit } =
    usePlanRestrictions({
      plan,
      usage: { members: currentUsage, domains: 0 },
    })

  const validateEmail = (email: string) => {
    if (!email) return "Email é obrigatório"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Email inválido"
    return null
  }

  const resetForm = () => {
    setEmail("")
    setRoleId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email)
    if (emailError) {
      showToast(emailError, { variant: "error" })
      return
    }

    if (!checkAndEnforceLimit("members")) {
      return
    }

    try {
      setIsSubmitting(true)

      const result = await inviteMember(organizationId, { email, roleId })
      if (result.success) {
        showToast("Membro convidado com sucesso", { variant: "success" })
        resetForm()
        setOpen(false)
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao convidar membro",
        { variant: "error" }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Novo Membro</DialogTitle>
            <DialogDescription>
              Adicione um novo membro à sua organização
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email do membro"
              />
            </div>

            <div className="space-y-2">
              <Label>Função</Label>
              <RoleSelect
                roles={customRoles}
                currentRoleId={roleId}
                onRoleChange={setRoleId}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Convidando..." : "Convidar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        organizationId={organizationId}
        currentPlan={plan}
      />
    </>
  )
}