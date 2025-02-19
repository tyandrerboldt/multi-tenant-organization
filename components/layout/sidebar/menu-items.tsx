"use client";

import {
  Building2,
  DollarSign,
  FolderKanban,
  Globe,
  Home,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  UserSquare2,
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
      {
        label: "Proprietários",
        icon: UserSquare2,
        href: `/app/${organizationSlug}/properties/owners`,
      },
    ],
  },
  {
    label: "Quadros",
    icon: FolderKanban,
    href: `/app/${organizationSlug}/boards`,
    resource: "boards",
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
        label: "Regras de Acesso",
        icon: Shield,
        href: `/app/${organizationSlug}/settings/roles`,
      },
      {
        label: "Assinatura",
        icon: DollarSign,
        href: `/app/${organizationSlug}/settings/billing`,
      },
    ],
  },
];
