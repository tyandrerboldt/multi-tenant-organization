"use client";

import { Property } from "@prisma/client";
import { createContext, useContext, useState } from "react";

interface PropertyContextType {
  property: Property | null;
  setProperty: (property: Property | null) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ 
  children,
  initialProperty = null 
}: { 
  children: React.ReactNode;
  initialProperty?: Property | null;
}) {
  const [property, setProperty] = useState<Property | null>(initialProperty);
  const [isDirty, setIsDirty] = useState(false);

  return (
    <PropertyContext.Provider value={{ 
      property, 
      setProperty,
      isDirty,
      setIsDirty
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
}