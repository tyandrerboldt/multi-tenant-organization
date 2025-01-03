"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlanGrid } from "./plan-grid"
import { Plan } from "@prisma/client"
import { getOrganizationBillingData } from "@/lib/actions/billing"
import { OrganizationBillingData } from "@/lib/actions/billing"

interface UpgradePlanModalProps {
  isOpen: boolean
  onClose: () => void
  organizationId: string
  currentPlan: Plan
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  organizationId,
  currentPlan,
}: UpgradePlanModalProps) {
  const [billingData, setBillingData] = useState<OrganizationBillingData | null>(null)

  useEffect(() => {
    if (isOpen) {
      getOrganizationBillingData(organizationId)
        .then(setBillingData)
        .catch(console.error)
    }
  }, [isOpen, organizationId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that better fits your needs
          </DialogDescription>
        </DialogHeader>

        <PlanGrid
          organizationId={organizationId}
          currentPlan={currentPlan}
          stripeCustomerId={billingData?.stripeCustomerId}
          stripeSubscriptionId={billingData?.stripeSubscriptionId}
        />
      </DialogContent>
    </Dialog>
  )
}