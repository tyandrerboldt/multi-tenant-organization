"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { Role } from "@/lib/types/permissions"

interface RolesContextType {
  roles: Role[]
  updateRoles: (roles: Role[]) => void
}

const RolesContext = createContext<RolesContextType | undefined>(undefined)

interface RolesProviderProps {
  children: React.ReactNode
  initialRoles: Role[]
}

export function RolesProvider({ children, initialRoles }: RolesProviderProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles)

  const updateRoles = useCallback((newRoles: Role[]) => {
    setRoles(newRoles)
  }, [])

  return (
    <RolesContext.Provider value={{ roles, updateRoles }}>
      {children}
    </RolesContext.Provider>
  )
}

export function useRoles() {
  const context = useContext(RolesContext)
  if (context === undefined) {
    throw new Error("useRoles must be used within a RolesProvider")
  }
  return context
}