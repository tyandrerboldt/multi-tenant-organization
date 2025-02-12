"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { PlanDetails } from "@/lib/constants/plans"
import { Plan } from "@prisma/client"
import { cn } from "@/lib/utils"

interface PlanCardProps {
  plan: PlanDetails
  currentPlan: Plan
  hasActiveSubscription: boolean
  onSelect: (plan: PlanDetails) => void
  disabled?: boolean
}

export function PlanCard({ 
  plan, 
  currentPlan, 
  hasActiveSubscription,
  onSelect, 
  disabled 
}: PlanCardProps) {
  const isCurrentPlan = plan.name.toUpperCase() == currentPlan
  
  const formatPrice = (price: number | null) => {
    if (price === null) return "Personalizado"
    if (price === 0) return "Grátis"
    return `R$${(price / 100).toFixed(2)}/mês`
  }

  const getButtonText = () => {
    if (isCurrentPlan) {
      return hasActiveSubscription ? "Plano Atual" : "Selecionar Plano"
    }
    return "Selecionar Plano"
  }

  const isDisabled = disabled || (isCurrentPlan && hasActiveSubscription)

  return (
    <Card className={cn(
      "p-6 flex flex-col h-full relative transition-all",
      isCurrentPlan && "ring-2 ring-primary"
    )}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
            Plano Atual
          </span>
        </div>
      )}

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
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
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
        disabled={isDisabled}
        className="mt-6 w-full"
        variant={isCurrentPlan ? "secondary" : "default"}
      >
        {getButtonText()}
      </Button>
    </Card>
  )
}