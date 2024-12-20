"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { PlanDetails } from "@/lib/constants/plans"
import { Plan } from "@prisma/client"

interface PlanCardProps {
  plan: PlanDetails
  currentPlan: Plan
  onSelect: (plan: PlanDetails) => void
  disabled?: boolean
}

export function PlanCard({ plan, currentPlan, onSelect, disabled }: PlanCardProps) {
  const isCurrentPlan = plan.name === currentPlan
  const formatPrice = (price: number | null) => {
    if (price === null) return "Personalizado"
    if (price === 0) return "Grátis"
    return `R$${(price / 100).toFixed(2)}/mês`
  }

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-gray-500">{plan.description}</p>
      </div>

      <div className="text-3xl font-bold mb-6">
        {formatPrice(plan.price)}
      </div>

      <div className="space-y-4 flex-grow">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            {feature.included ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <X className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span>
              {feature.name}
              {feature.limit && ` (${feature.limit})`}
            </span>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSelect(plan)}
        disabled={disabled || isCurrentPlan}
        className="mt-6 w-full"
        variant={isCurrentPlan ? "secondary" : "default"}
      >
        {isCurrentPlan ? "Plano Atual" : "Selecionar Plano"}
      </Button>
    </Card>
  )
}