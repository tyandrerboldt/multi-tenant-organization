"use client";

import { Theme } from "@prisma/client";
import { createContext, useContext } from "react";

interface PreferencesContextType {
  theme: Theme;
  defaultOrganizationId?: string | null;
  setTheme: (theme: Theme) => void;
}

export const PreferencesContext = createContext<
  PreferencesContextType | undefined
>(undefined);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context == undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
