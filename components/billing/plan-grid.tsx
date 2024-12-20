"use client"

import { useState } from "react"
import { PlanCard } from "./plan-card"
import { PLANS, PlanDetails } from "@/lib/constants/plans"
import { Plan } from "@prisma/client"
import { updateSubscription } from "@/lib/actions/billing"
import { loadStripe } from "@stripe/stripe-js"

interface PlanGridProps {
  organizationId: string
  currentPlan: Plan
  stripeCustomerId?: string | null
}

export function PlanGrid({ organizationId, currentPlan, stripeCustomerId }: PlanGridProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePlanSelect = async (plan: PlanDetails) => {
    try {
      setIsLoading(true)

      if (plan.price === 0) {
        // Downgrade para plano gratuito
        await updateSubscription(organizationId, "FREE")
        return
      }

      if (!stripeCustomerId) {
        throw new Error("Stripe customer ID not found")
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) throw new Error("Failed to load Stripe")

      const { sessionId } = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          organizationId,
          customerId: stripeCustomerId,
        }),
      }).then(res => res.json())

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) throw error
    } catch (error) {
      console.error("Error selecting plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(PLANS).map(([key, plan]) => (
        <PlanCard
          key={key}
          plan={plan}
          currentPlan={currentPlan}
          onSelect={handlePlanSelect}
          disabled={isLoading}
        />
      ))}
    </div>
  )
}