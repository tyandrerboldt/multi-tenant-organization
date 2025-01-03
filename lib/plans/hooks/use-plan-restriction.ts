"use client"

import { useState, useCallback } from "react"
import { Plan } from "@prisma/client"
import { getPlanResourceLimit } from "../limits"
import { ResourceUsage } from "../usage"

interface UsePlanRestrictionsProps {
  plan: Plan
  usage: ResourceUsage
}

export function usePlanRestrictions({ plan, usage }: UsePlanRestrictionsProps) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  const checkAndEnforceLimit = useCallback(
    (resource: keyof ResourceUsage): boolean => {
      const limit = getPlanResourceLimit(plan, resource)
      const currentUsage = usage[resource]

      if (limit !== Infinity && currentUsage >= limit) {
        setIsUpgradeModalOpen(true)
        return false
      }

      return true
    },
    [plan, usage]
  )

  return {
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    checkAndEnforceLimit,
  }
}