import { prisma } from "@/lib/prisma"
import { ResourceLimits } from "./limits"

export interface ResourceUsage {
  members: number
  domains: number
}

export async function getOrganizationUsage(organizationId: string): Promise<ResourceUsage> {
  const [membersCount, domainsCount] = await Promise.all([
    prisma.membership.count({
      where: { organizationId }
    }),
    prisma.domain.count({
      where: { organizationId }
    })
  ])

  return {
    members: membersCount,
    domains: domainsCount
  }
}

export function isResourceLimitReached(
  usage: number,
  limit: number
): boolean {
  return limit !== Infinity && usage >= limit
}