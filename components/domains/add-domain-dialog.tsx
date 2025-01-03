"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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
import { DomainFormData, domainSchema } from "@/lib/validations/domain"
import { createDomain } from "@/lib/actions/domain"
import { Plan } from "@prisma/client"
import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal"
import { showToast } from "@/lib/toast"
import { usePlanRestrictions } from "@/lib/plans/hooks/use-plan-restriction"

interface AddDomainDialogProps {
  organizationId: string
  plan: Plan
  currentUsage: number
}

export function AddDomainDialog({ 
  organizationId, 
  plan,
  currentUsage,
}: AddDomainDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, checkAndEnforceLimit } = 
    usePlanRestrictions({
      plan,
      usage: { domains: currentUsage, members: 0 }
    })
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DomainFormData>({
    resolver: zodResolver(domainSchema),
  })

  const onSubmit = async (data: DomainFormData) => {
    if (!checkAndEnforceLimit("domains")) {
      return
    }

    try {
      await createDomain(organizationId, data)
      showToast("Domain added successfully", { variant: "success" })
      setOpen(false)
      reset()
      router.refresh()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to add domain",
        { variant: "error" }
      )
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          reset()
        }
      }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
            <DialogDescription>
              Add a new domain to your organization.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Domain Name</Label>
              <Input
                id="name"
                placeholder="example.com"
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Domain"}
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