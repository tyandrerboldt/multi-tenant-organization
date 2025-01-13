"use client";

import { useRoles } from "@/providers/roles-provider";
import { Action, Resource } from "@/lib/types/permissions";
import { useSession } from "next-auth/react";

export function usePermissions() {
  const { roles } = useRoles();
  const { data: session } = useSession();

  const checkPermission = (resource: Resource, action: Action): boolean => {
    // Se não houver sessão, não tem permissão
    if (!session?.user) return false;

    // Verifica se o usuário é OWNER (tem acesso total)
    const isOwner = roles.some((role) => role.name == "OWNER");
    if (isOwner) return true;

    // Se não for OWNER, verifica as permissões específicas
    return roles.some((role) => {
      const permission = role.permissions.find((p) => p.resource == resource);
      return permission?.actions.includes(action) || false;
    });
  };

  return { checkPermission };
}