"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { InviteMemberFormData } from "@/lib/validations/team"
import { revalidatePath } from "next/cache"

export async function getTeamMembers(organizationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const members = await prisma.membership.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      },
      customRole: true
    },
    orderBy: { createdAt: "desc" }
  })

  return members.map(member => ({
    ...member,
    roleId: member.customRole?.id || null
  }))
}

export async function inviteMember(
  organizationId: string,
  data: InviteMemberFormData
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário atual é OWNER
  const currentMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!currentMembership) {
    throw new Error("Apenas proprietários podem convidar membros")
  }

  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!existingUser) {
    throw new Error("Usuário não encontrado")
  }

  // Verificar se o usuário já é membro
  const existingMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: existingUser.id,
    },
  })

  if (existingMembership) {
    throw new Error("Usuário já é membro desta organização")
  }

  // Criar novo membro
  const membership = await prisma.membership.create({
    data: {
      role: Role.MEMBER,
      userId: existingUser.id,
      organizationId,
      customRoleId: data.roleId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      customRole: true,
    },
  })

  revalidatePath(`/app/${organizationId}/team`)
  return { success: true, membership }
}

export async function assignRole(
  organizationId: string,
  memberId: string,
  roleId: string | null
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário atual é OWNER
  const currentMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!currentMembership) {
    throw new Error("Apenas proprietários podem atribuir funções")
  }

  const updatedMembership = await prisma.membership.update({
    where: { id: memberId },
    data: {
      customRoleId: roleId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      customRole: true,
    },
  })

  revalidatePath(`/app/${organizationId}/team`)
  return { success: true, membership: updatedMembership }
}

export async function removeMember(organizationId: string, memberId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário atual é OWNER
  const currentMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!currentMembership) {
    throw new Error("Apenas proprietários podem remover membros")
  }

  // Não permitir remover o OWNER
  const targetMembership = await prisma.membership.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
  })

  if (!targetMembership) {
    throw new Error("Membro não encontrado")
  }

  if (targetMembership.role === Role.OWNER) {
    throw new Error("Não é possível remover o proprietário")
  }

  await prisma.membership.delete({
    where: { id: memberId },
  })

  revalidatePath(`/app/${organizationId}/team`)
  return { success: true }
}

export async function searchCapturers(
  organizationId: string,
  search: string,
  memberId?: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const where = {
    organizationId,
    customRole: {
      permissions: {
        some: {
          resource: "property",
          actions: { has: "capture" },
        },
      },
    },
    ...(memberId
      ? { id: memberId }
      : search
      ? {
          OR: [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const capturers = await prisma.membership.findMany({
    where,
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    take: memberId ? 1 : 5,
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return capturers;
}