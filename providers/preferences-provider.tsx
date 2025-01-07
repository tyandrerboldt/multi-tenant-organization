"use client"

import { useEffect, useState } from "react"
import { Theme } from "@prisma/client"
import { PreferencesContext } from "@/lib/hooks/use-preferences"
import { useTheme } from "next-themes"

interface PreferencesProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultOrganizationId?: string | null
}

export function PreferencesProvider({
  children,
  defaultTheme = "light",
  defaultOrganizationId,
}: PreferencesProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const { setTheme: setNextTheme } = useTheme()

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setNextTheme(newTheme)
  }

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        defaultOrganizationId,
        setTheme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}