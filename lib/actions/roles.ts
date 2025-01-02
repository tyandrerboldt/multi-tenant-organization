"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { RoleFormData } from "@/lib/validations/roles"
import { revalidatePath } from "next/cache"
import { Action, Resource } from "@/lib/types/permissions"

export async function getRoles(organizationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const roles = await prisma.customRole.findMany({
    where: { organizationId },
    include: {
      permissions: true
    },
    orderBy: { createdAt: "desc" }
  })

  return roles
}

export async function createRole(organizationId: string, data: RoleFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é OWNER
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!membership) {
    throw new Error("Apenas proprietários podem criar funções")
  }

  const role = await prisma.customRole.create({
    data: {
      name: data.name,
      organizationId,
      permissions: {
        create: data.permissions.map(permission => ({
          resource: permission.resource,
          actions: permission.actions
        }))
      }
    },
    include: {
      permissions: true
    }
  })

  revalidatePath(`/app/${organizationId}/settings/roles`)
  return { success: true, role }
}

export async function updateRole(
  organizationId: string,
  roleId: string,
  data: RoleFormData
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é OWNER
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!membership) {
    throw new Error("Apenas proprietários podem atualizar funções")
  }

  const role = await prisma.customRole.update({
    where: { id: roleId },
    data: {
      name: data.name,
      permissions: {
        deleteMany: {},
        create: data.permissions.map(permission => ({
          resource: permission.resource,
          actions: permission.actions
        }))
      }
    },
    include: {
      permissions: true
    }
  })

  revalidatePath(`/app/${organizationId}/settings/roles`)
  return { success: true, role }
}

export async function deleteRole(organizationId: string, roleId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é OWNER
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!membership) {
    throw new Error("Apenas proprietários podem excluir funções")
  }

  await prisma.customRole.delete({
    where: { id: roleId }
  })

  revalidatePath(`/app/${organizationId}/settings/roles`)
  return { success: true }
}

export async function resetRolePermissions(
  organizationId: string,
  roleId: string
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const role = await prisma.customRole.findUnique({
    where: { id: roleId },
    include: { permissions: true }
  })

  if (!role) {
    throw new Error("Função não encontrada")
  }

  await prisma.permission.deleteMany({
    where: { roleId }
  })

  revalidatePath(`/app/${organizationId}/settings/roles`)
  return { success: true }
}

export async function checkPermission(
  userId: string,
  organizationId: string,
  resource: Resource,
  action: Action
): Promise<boolean> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      organizationId,
    },
    include: {
      user: {
        include: {
          permissions: true
        }
      }
    }
  })

  if (!membership) return false

  // OWNER tem acesso total
  if (membership.role === Role.OWNER) return true

  // Verificar permissões específicas do usuário
  const userPermission = membership.user.permissions.find(
    p => p.resource === resource
  )

  if (userPermission?.actions.includes(action)) return true

  // Verificar permissões da função
  const rolePermissions = await prisma.permission.findMany({
    where: {
      role: {
        memberships: {
          some: {
            userId,
            organizationId
          }
        }
      },
      resource
    }
  })

  return rolePermissions.some(p => p.actions.includes(action))
}