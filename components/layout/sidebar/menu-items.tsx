"use client";

import {
  Currency,
  DollarSign,
  Globe,
  Home,
  LayoutDashboard,
  Receipt,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { MenuItem } from "./types";
import { Resource } from "@/lib/types/permissions";

interface MenuItemConfig {
  resource?: Resource;
  submenu?: {
    resource?: Resource;
  }[];
}

// Configuração de permissões necessárias para cada item do menu
const menuConfig: Record<string, MenuItemConfig> = {
  "Equipe": { resource: "team" },
  "Configurações": {
    resource: "settings",
    submenu: [
      { resource: "settings" }, // Geral
      { resource: "domains" }, // Domínios
      { resource: "settings" }, // Planos
      { resource: "settings" }, // Regras de Acesso
    ]
  }
};

export const createMenuItems = (organizationSlug: string): MenuItem[] => [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: `/app/${organizationSlug}`,
  },
  {
    label: "Equipe",
    icon: Users,
    href: `/app/${organizationSlug}/team`,
    resource: "team",
  },
  {
    label: "Configurações",
    icon: Settings,
    submenu: [
      {
        label: "Geral",
        icon: Home,
        href: `/app/${organizationSlug}/settings`,
      },
      {
        label: "Domínios",
        icon: Globe,
        href: `/app/${organizationSlug}/settings/domains`,
      },
      {
        label: "Planos",
        icon: DollarSign,
        href: `/app/${organizationSlug}/settings/billing`,
      },
      {
        label: "Regras de Acesso",
        icon: Shield,
        href: `/app/${organizationSlug}/settings/roles`,
      },
    ],
  },
];