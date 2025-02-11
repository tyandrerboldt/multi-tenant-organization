"use client";

import { Organization, Property } from "@prisma/client";
import { createContext, useContext, useState } from "react";

interface PropertyContextType {
  property: Property | null;
  organization: Organization | null;
  setProperty: (property: Property | null) => void;
  setOrganization: (organization: Organization | null) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export function PropertyProvider({
  children,
  initialProperty = null,
  initialOrganization = null,
}: {
  children: React.ReactNode;
  initialProperty?: Property | null;
  initialOrganization?: Organization | null;
}) {
  const [property, setProperty] = useState<Property | null>(initialProperty);
  const [organization, setOrganization] = useState<Organization | null>(initialOrganization);

  return (
    <PropertyContext.Provider
      value={{
        property,
        organization,
        setOrganization,
        setProperty,
      }}
    >
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
