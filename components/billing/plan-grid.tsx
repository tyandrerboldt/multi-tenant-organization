"use client";

import { updateSubscription } from "@/lib/actions/billing";
import { PLANS, PlanDetails } from "@/lib/constants/plans";
import { Plan } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { PlanCard } from "./plan-card";

interface PlanGridProps {
  organizationId: string;
  currentPlan: Plan;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export function PlanGrid({
  organizationId,
  currentPlan,
  stripeCustomerId,
  stripeSubscriptionId,
}: PlanGridProps) {
  const [isLoading, setIsLoading] = useState(false);
  const hasActiveSubscription = !!stripeSubscriptionId;

  const handlePlanSelect = async (plan: PlanDetails) => {
    try {
      setIsLoading(true);

      // Se está fazendo downgrade para o plano gratuito
      if (plan.price === 0) {
        await updateSubscription(organizationId, "FREE");
        return;
      }

      if (!stripeCustomerId) {
        throw new Error("ID do cliente Stripe não encontrado");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (!stripe) throw new Error("Falha ao carregar Stripe");

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
      }).then((res) => res.json());

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao selecionar plano:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(PLANS).map(([key, plan]) => (
        <PlanCard
          key={key}
          plan={plan}
          currentPlan={currentPlan}
          hasActiveSubscription={hasActiveSubscription}
          onSelect={handlePlanSelect}
          disabled={isLoading}
        />
      ))}
    </div>
  );
}
