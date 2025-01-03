import { Plan } from "@prisma/client"

export interface ResourceLimits {
  members: number
  domains: number
}

export interface ResourceUsage {
  members: number
  domains: number
}

export interface PlanFeature {
  name: string
  included: boolean
  limit?: number
}

export interface PlanDetails {
  name: string
  description: string
  price: number
  features: PlanFeature[]
  stripePriceId: string | null
}

export interface PlanConfig {
  limits: Record<Plan, ResourceLimits>
  features: Record<Plan, PlanDetails>
}