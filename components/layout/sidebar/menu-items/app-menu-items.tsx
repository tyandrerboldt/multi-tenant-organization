"use client";

import { Settings2, User } from "lucide-react";
import { MenuItem } from "../types";

export const createAppMenuItems = (): MenuItem[] => [
  {
    label: "Conta",
    icon: User,
    href: "/app/account",
  },
  {
    label: "Preferencias",
    icon: Settings2,
    href: "/app/preferences",
  },
];
