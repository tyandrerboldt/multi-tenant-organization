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
  Building2,
} from "lucide-react";
import { MenuItem } from "./types";

export const createMenuItems = (organizationSlug: string): MenuItem[] => [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: `/app/${organizationSlug}`,
  },
  {
    label: "Imóveis",
    icon: Building2,
    submenu: [
      {
        label: "Gerenciar",
        icon: Home,
        href: `/app/${organizationSlug}/properties`,
      },
    ],
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