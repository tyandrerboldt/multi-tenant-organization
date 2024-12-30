"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Theme } from "@prisma/client"

interface PreferencesContextType {
  theme: Theme
  defaultOrganizationId?: string | null
  setTheme: (theme: Theme) => void
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}