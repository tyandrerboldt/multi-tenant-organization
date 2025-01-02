"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { InviteMemberFormData } from "../validations/team"

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
          permissions: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return members
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

  // Obter informações do membro
  const member = await prisma.membership.findUnique({
    where: { id: memberId },
    include: { user: true },
  })

  if (!member || !member.user) {
    throw new Error("Membro não encontrado")
  }

  const userId = member.user.id

  console.log("userId");
  console.log(userId);


  // Executar operações como uma transação
  await prisma.$transaction(async (tx) => {
    // Remover permissões atuais do usuário
    const deleted = await tx.permission.deleteMany({
      where: {
        userId,
        role: {
          organizationId,
        },
      },
    })

    console.log("deleted");
    console.log(deleted);


    // Atribuir nova função
    if (roleId) {
      const customRole = await tx.customRole.findFirst({
        where: {
          id: roleId,
          organizationId,
        },
        include: { permissions: true },
      })

      console.log("customRole");
      console.log(customRole)

      if (customRole) {

        for (const permission of customRole.permissions) {
          const permissionCreated = await tx.permission.create({
            data: {
              userId,
              resource: permission.resource,
              actions: permission.actions,
              roleId: customRole.id
            },
          })

          console.log("permissionCreated");
          console.log(permissionCreated);
          
        }
      }
    }
  })

  revalidatePath(`/app/${organizationId}/team`)
  return { success: true }
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


export async function inviteMember(organizationId: string, data: InviteMemberFormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check if the current user has permission to invite members
  const currentMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: {
        in: [Role.OWNER, Role.ADMIN],
      },
    },
  })

  if (!currentMembership) {
    throw new Error("You don't have permission to invite members")
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  // If user doesn't exist, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
      },
    })
  }

  // Check if user is already a member
  const existingMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: user.id,
    },
  })

  if (existingMembership) {
    throw new Error("User is already a member of this organization")
  }

  // Create membership
  const membership = await prisma.membership.create({
    data: {
      organizationId,
      userId: user.id,
      role: data.role,
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
    },
  })

  return { success: true, membership }
}