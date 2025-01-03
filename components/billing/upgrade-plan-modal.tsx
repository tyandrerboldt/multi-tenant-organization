"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlanGrid } from "./plan-grid"
import { Plan } from "@prisma/client"

interface UpgradePlanModalProps {
  isOpen: boolean
  onClose: () => void
  organizationId: string
  currentPlan: Plan
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  organizationId,
  currentPlan,
  stripeCustomerId,
  stripeSubscriptionId,
}: UpgradePlanModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that better fits your needs
          </DialogDescription>
        </DialogHeader>

        <PlanGrid
          organizationId={organizationId}
          currentPlan={currentPlan}
          stripeCustomerId={stripeCustomerId}
          stripeSubscriptionId={stripeSubscriptionId}
        />
      </DialogContent>
    </Dialog>
  )
}