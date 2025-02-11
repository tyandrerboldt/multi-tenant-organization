"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

interface PropertyFormLayoutProps {
  children: React.ReactNode;
  organizationSlug: string;
  propertyCode?: string;
}

export function PropertyFormLayout({
  children,
  organizationSlug,
  propertyCode,
}: PropertyFormLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isEditing = !!propertyCode;
  const baseUrl = `/app/${organizationSlug}/properties/${propertyCode}`;

  const tabs = [
    {
      value: "general",
      label: "Informações Gerais",
      path: isEditing ? baseUrl : `/app/${organizationSlug}/properties/add`,
    },
    {
      value: "features",
      label: "Características",
      path: `${baseUrl}/features`,
      disabled: !isEditing,
    },
    {
      value: "images",
      label: "Imagens",
      path: `${baseUrl}/images`,
      disabled: !isEditing,
    },
    {
      value: "address",
      label: "Endereço",
      path: `${baseUrl}/address`,
      disabled: !isEditing,
    },
  ];

  const getCurrentTab = () => {
    if (pathname.endsWith("/features")) return "features";
    if (pathname.endsWith("/images")) return "images";
    if (pathname.endsWith("/address")) return "address";
    return "general";
  };

  const handleTabChange = (path: string) => {
    router.push(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Editar Imóvel" : "Adicionar Imóvel"}
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Atualize as informações do imóvel"
              : "Cadastre um novo imóvel no sistema"}
          </p>
        </div>
      </div>

      <Tabs value={getCurrentTab()} className="space-y-6">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => handleTabChange(tab.path)}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {children}
      </Tabs>
    </div>
  );
}
