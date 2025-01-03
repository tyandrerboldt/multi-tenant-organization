import { Plan } from "@prisma/client"
import { PLANS } from "@/lib/constants/plans"

export interface ResourceLimits {
  members: number
  domains: number
}

export const PLAN_LIMITS: Record<Plan, ResourceLimits> = {
  FREE: {
    members: 3,
    domains: 1,
  },
  STARTER: {
    members: 10,
    domains: 3,
  },
  PRO: {
    members: 25,
    domains: 10,
  },
  ENTERPRISE: {
    members: Infinity,
    domains: Infinity,
  },
}

export function getPlanResourceLimit(plan: Plan, resource: keyof ResourceLimits): number {
  return PLAN_LIMITS[plan][resource]
}

export function isPlanFeatureAvailable(plan: Plan, feature: string): boolean {
  return PLANS[plan].features.some(f => f.name === feature && f.included)
}