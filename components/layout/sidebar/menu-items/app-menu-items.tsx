"use client";

import { User } from "lucide-react";
import { MenuItem } from "../types";

export const createAppMenuItems = (): MenuItem[] => [
  {
    label: "Conta",
    icon: User,
    href: "/app/account",
  },
];
