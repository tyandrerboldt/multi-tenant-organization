"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { DomainFormData } from "@/lib/validations/domain"
import { revalidatePath } from "next/cache"

export async function getDomains(organizationId: string, page = 1, limit = 10) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const skip = (page - 1) * limit

  const [domains, total] = await Promise.all([
    prisma.domain.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.domain.count({
      where: { organizationId },
    }),
  ])

  return {
    domains,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export async function createDomain(organizationId: string, data: DomainFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
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
    throw new Error("Only organization owners can add domains")
  }

  // Verificar se o domínio já existe
  const existingDomain = await prisma.domain.findUnique({
    where: { name: data.name },
  })

  if (existingDomain) {
    throw new Error("Domain already exists")
  }

  const domain = await prisma.domain.create({
    data: {
      name: data.name,
      organizationId,
    },
  })

  revalidatePath(`/app/${organizationId}/settings/domains`)
  return { success: true, domain }
}

export async function deleteDomain(organizationId: string, domainId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
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
    throw new Error("Only organization owners can delete domains")
  }

  await prisma.domain.delete({
    where: { id: domainId },
  })

  revalidatePath(`/app/${organizationId}/settings/domains`)
  return { success: true }
}