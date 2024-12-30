"use client"

import { useEffect, useState } from "react"
import { Theme } from "@prisma/client"
import { PreferencesContext } from "@/lib/hooks/use-preferences"

interface PreferencesProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultOrganizationId?: string | null
}

export function PreferencesProvider({
  children,
  defaultTheme = "system",
  defaultOrganizationId,
}: PreferencesProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
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