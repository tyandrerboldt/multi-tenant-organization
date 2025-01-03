import { Plan } from "@prisma/client"
import { getPlanResourceLimit } from "./limits"
import { getOrganizationUsage, isResourceLimitReached } from "./usage"

export class PlanRestrictionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PlanRestrictionError"
  }
}

export async function checkResourceLimit(
  organizationId: string,
  plan: Plan,
  resource: "members" | "domains"
): Promise<boolean> {
  const usage = await getOrganizationUsage(organizationId)
  const limit = getPlanResourceLimit(plan, resource)
  
  return !isResourceLimitReached(usage[resource], limit)
}

export async function enforceResourceLimit(
  organizationId: string,
  plan: Plan,
  resource: "members" | "domains"
): Promise<void> {
  const canAdd = await checkResourceLimit(organizationId, plan, resource)
  
  if (!canAdd) {
    const limit = getPlanResourceLimit(plan, resource)
    throw new PlanRestrictionError(
      `Your plan is limited to ${limit} ${resource}. Please upgrade to add more.`
    )
  }
}