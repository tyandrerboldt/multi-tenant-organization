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
    throw new Error("Unauthorized")
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return members
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

export async function removeMember(organizationId: string, memberId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check if the current user has permission to remove members
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
    throw new Error("You don't have permission to remove members")
  }

  // Prevent removing the owner
  const targetMembership = await prisma.membership.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
  })

  if (!targetMembership) {
    throw new Error("Member not found")
  }

  if (targetMembership.role === Role.OWNER) {
    throw new Error("Cannot remove the organization owner")
  }

  await prisma.membership.delete({
    where: {
      id: memberId,
    },
  })

  return { success: true }
}


export async function updateMemberRole(
  organizationId: string,
  memberId: string,
  newRole: Role
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
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
    throw new Error("Only organization owners can change member roles")
  }

  // Não permitir alterar o papel do OWNER
  const targetMembership = await prisma.membership.findFirst({
    where: {
      id: memberId,
      organizationId,
    },
  })

  if (!targetMembership) {
    throw new Error("Member not found")
  }

  if (targetMembership.role === Role.OWNER) {
    throw new Error("Cannot change the owner's role")
  }

  const updatedMembership = await prisma.membership.update({
    where: {
      id: memberId,
    },
    data: {
      role: newRole,
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

  revalidatePath(`/app/${organizationId}/team`)
  return { success: true, membership: updatedMembership }
}